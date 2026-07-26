package service

import (
	"context"
	"fmt"
	"sort"
	"strconv"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/zodiac/backend/internal/domain"
	domrepo "github.com/zodiac/backend/internal/domain/repository"
)

// InterpretationService resolves interpretations for a given NatalChart.
//
// Lookup Strategy (single round-trip per Interpret call):
//   1. Walk every planet → build PlanetInSign + PlanetInHouse factors.
//   2. Walk every aspect  → build Aspect factors (planet pair sorted alphabetically).
//   3. Call repo.BatchLookup once with all factors and the requested language.
//   4. Map results back into the structured ChartInterpretation aggregate.
//
// Localization Strategy:
//   • The caller passes a language code ("en" | "vi").
//   • The repository transparently falls back to "en" for any missing translation.
//   • The service records the effective language on the returned aggregate.
type InterpretationService struct {
	interpRepo domrepo.InterpretationRepository
	chartRepo  domrepo.ChartRepository
	log        *zap.Logger
}

// NewInterpretationService constructs the service.
func NewInterpretationService(
	interpRepo domrepo.InterpretationRepository,
	chartRepo domrepo.ChartRepository,
	log *zap.Logger,
) *InterpretationService {
	return &InterpretationService{
		interpRepo:  interpRepo,
		chartRepo:   chartRepo,
		log:         log,
	}
}

// Interpret fetches the chart, authorises the requesting user, builds all
// lookup factors in one pass, performs a single batch repository query, and
// returns the fully populated ChartInterpretation aggregate.
func (s *InterpretationService) Interpret(
	ctx context.Context,
	chartID uuid.UUID,
	language string,
) (*domain.ChartInterpretation, error) {
	// 1. Resolve and normalise language.
	lang := resolveLanguage(language)

	// 2. Fetch chart.
	chart, err := s.chartRepo.GetByID(ctx, chartID)
	if err != nil {
		return nil, fmt.Errorf("interpretationService.Interpret chart: %w", err)
	}

	// 3. (Profile check removed since auth is removed)

	// 4. Build lookup factors.
	factors := buildFactors(chart)

	// 5. Single batch lookup — one DB round-trip.
	templates, err := s.interpRepo.BatchLookup(ctx, lang, factors)
	if err != nil {
		return nil, fmt.Errorf("interpretationService.Interpret batch lookup: %w", err)
	}

	s.log.Info("interpretation lookup",
		zap.String("chart_id", chartID.String()),
		zap.String("language", lang),
		zap.Int("factors", len(factors)),
		zap.Int("matched", len(templates)),
	)

	// 6. Assemble the aggregate.
	return assemble(chartID, lang, chart, templates), nil
}

// ── Factor construction ───────────────────────────────────────────────────────

// buildFactors constructs the flat slice of LookupFactor for every astrological
// component in the chart (planet-in-sign, planet-in-house, house-in-sign, aspect).
func buildFactors(chart *domain.NatalChart) []domain.LookupFactor {
	// Pre-allocate: 2 factors per planet + 1 per house + 1 per aspect.
	capacity := 2*len(chart.Planets) + len(chart.Houses) + len(chart.Aspects)
	factors := make([]domain.LookupFactor, 0, capacity)

	for _, p := range chart.Planets {
		factors = append(factors, buildPlanetInSignFactor(p))
		factors = append(factors, buildPlanetInHouseFactor(p))
	}

	for _, h := range chart.Houses {
		factors = append(factors, buildHouseInSignFactor(h))
	}

	for _, a := range chart.Aspects {
		factors = append(factors, buildAspectFactor(a))
	}

	return factors
}

// ── Result assembly ───────────────────────────────────────────────────────────

func assemble(
	chartID uuid.UUID,
	lang string,
	chart *domain.NatalChart,
	templates map[string]*domain.PlacementInterpretation,
) *domain.ChartInterpretation {
	interp := &domain.ChartInterpretation{
		ChartID:  chartID,
		Language: lang,

		PlanetInSign:  make([]domain.PlanetInSignInterpretation, 0, len(chart.Planets)),
		PlanetInHouse: make([]domain.PlanetInHouseInterpretation, 0, len(chart.Planets)),
		HouseInSign:   make([]domain.HouseInSignInterpretation, 0, len(chart.Houses)),
		Aspects:       make([]domain.AspectInterpretation, 0, len(chart.Aspects)),
	}

	for _, p := range chart.Planets {
		signKey := buildPlanetInSignFactor(p).Key()
		interp.PlanetInSign = append(interp.PlanetInSign, domain.PlanetInSignInterpretation{
			Planet:   p.PlanetName,
			Sign:     p.Sign,
			Template: templates[signKey], // nil if no template found
		})

		houseKey := buildPlanetInHouseFactor(p).Key()
		interp.PlanetInHouse = append(interp.PlanetInHouse, domain.PlanetInHouseInterpretation{
			Planet:      p.PlanetName,
			HouseNumber: p.HousePosition,
			Template:    templates[houseKey],
		})
	}

	for _, h := range chart.Houses {
		houseInSignKey := buildHouseInSignFactor(h).Key()
		interp.HouseInSign = append(interp.HouseInSign, domain.HouseInSignInterpretation{
			HouseNumber: h.HouseNumber,
			Sign:        h.Sign,
			Template:    templates[houseInSignKey],
		})
	}

	for _, a := range chart.Aspects {
		aspectKey := buildAspectFactor(a).Key()
		interp.Aspects = append(interp.Aspects, domain.AspectInterpretation{
			Planet1:    a.Planet1,
			Planet2:    a.Planet2,
			AspectType: string(a.AspectType),
			Orb:        a.Orb,
			IsApplying: a.IsApplying,
			Template:   templates[aspectKey],
		})
	}

	return interp
}

// ── Helpers ───────────────────────────────────────────────────────────────────

func buildPlanetInSignFactor(p domain.PlanetPosition) domain.LookupFactor {
	return domain.LookupFactor{
		FactorType:   domain.FactorPlanetInSign,
		FactorValue1: p.PlanetName,
		FactorValue2: p.Sign,
	}
}

func buildPlanetInHouseFactor(p domain.PlanetPosition) domain.LookupFactor {
	return domain.LookupFactor{
		FactorType:   domain.FactorPlanetInHouse,
		FactorValue1: p.PlanetName,
		FactorValue2: strconv.Itoa(p.HousePosition),
	}
}

func buildHouseInSignFactor(h domain.HouseCusp) domain.LookupFactor {
	return domain.LookupFactor{
		FactorType:   domain.FactorHouseInSign,
		FactorValue1: strconv.Itoa(h.HouseNumber),
		FactorValue2: h.Sign,
	}
}

func buildAspectFactor(a domain.Aspect) domain.LookupFactor {
	p1, p2 := sortedPlanetPair(a.Planet1, a.Planet2)
	at := string(a.AspectType)
	return domain.LookupFactor{
		FactorType:   domain.FactorAspect,
		FactorValue1: p1,
		FactorValue2: p2,
		FactorValue3: &at,
	}
}

// resolveLanguage normalises and validates the requested language code.
// Unknown codes fall back to "en".
func resolveLanguage(requested string) string {
	for _, supported := range domain.SupportedLanguages {
		if supported == requested {
			return requested
		}
	}
	return domain.DefaultLanguage
}

// sortedPlanetPair returns (a, b) with a < b alphabetically.
// This mirrors the CHECK constraint on the aspects table and the unique index
// on interpretation_templates, ensuring deterministic lookups.
func sortedPlanetPair(p1, p2 string) (string, string) {
	pair := []string{p1, p2}
	sort.Strings(pair)
	return pair[0], pair[1]
}
