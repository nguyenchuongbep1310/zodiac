package service

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/zodiac/backend/internal/domain"
	astrologydom "github.com/zodiac/backend/internal/domain/astrology"
	domrepo "github.com/zodiac/backend/internal/domain/repository"
)

// ChartService handles natal chart calculation and retrieval use-cases.
type ChartService struct {
	chartRepo   domrepo.ChartRepository
	profileRepo domrepo.ProfileRepository
	calculator  astrologydom.ChartCalculator
	ephePath    string
	log         *zap.Logger
}

// NewChartService constructs the service with all required dependencies.
func NewChartService(
	chartRepo domrepo.ChartRepository,
	profileRepo domrepo.ProfileRepository,
	calculator astrologydom.ChartCalculator,
	ephePath string,
	log *zap.Logger,
) *ChartService {
	return &ChartService{
		chartRepo:   chartRepo,
		profileRepo: profileRepo,
		calculator:  calculator,
		ephePath:    ephePath,
		log:         log,
	}
}

// Calculate fetches the birth profile (enforcing ownership), runs the
// ephemeris-based calculation pipeline, and persists the resulting NatalChart.
func (s *ChartService) Calculate(
	ctx context.Context,
	profileID uuid.UUID,
	requestingUserID uuid.UUID,
	houseSystem string,
	zodiacSystem string,
) (*domain.NatalChart, error) {
	// 1. Fetch and authorise the profile.
	profile, err := s.profileRepo.GetByID(ctx, profileID)
	if err != nil {
		return nil, fmt.Errorf("chartService.Calculate profile fetch: %w", err)
	}
	if profile.UserID != requestingUserID {
		return nil, domain.ErrForbidden("you do not own this profile")
	}

	// 2. Resolve house system.
	hs, houseSystemStr := resolveHouseSystem(houseSystem)

	// 3. Build the calculation input.
	input := astrologydom.ChartInput{
		BirthTime:   profile.BirthTime.Date,
		Latitude:    profile.Location.Latitude,
		Longitude:   profile.Location.Longitude,
		HouseSystem: hs,
		EphePath:    s.ephePath,
	}

	// 4. Run the calculation pipeline.
	output, err := s.calculator.Calculate(input)
	if err != nil {
		return nil, fmt.Errorf("chartService.Calculate engine: %w", err)
	}

	// 5. Map output → domain NatalChart.
	chart := mapOutputToChart(output, profileID, houseSystemStr, zodiacSystem)

	// 6. Persist to the database.
	saved, err := s.chartRepo.Save(ctx, chart)
	if err != nil {
		return nil, fmt.Errorf("chartService.Calculate save: %w", err)
	}

	s.log.Info("natal chart calculated and saved",
		zap.String("chart_id", saved.ID.String()),
		zap.String("profile_id", profileID.String()),
	)

	return saved, nil
}

// GetByID returns a NatalChart by its primary key.
func (s *ChartService) GetByID(ctx context.Context, chartID uuid.UUID, requestingUserID uuid.UUID) (*domain.NatalChart, error) {
	chart, err := s.chartRepo.GetByID(ctx, chartID)
	if err != nil {
		return nil, fmt.Errorf("chartService.GetByID: %w", err)
	}

	// Authorise via the owning profile.
	profile, err := s.profileRepo.GetByID(ctx, chart.ProfileID)
	if err != nil {
		return nil, fmt.Errorf("chartService.GetByID profile: %w", err)
	}
	if profile.UserID != requestingUserID {
		return nil, domain.ErrForbidden("you do not own this chart")
	}

	return chart, nil
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

func resolveHouseSystem(hs string) (astrologydom.HouseSystem, string) {
	switch hs {
	case "koch":
		return astrologydom.HouseKoch, "koch"
	case "whole_sign":
		return astrologydom.HouseWholeSign, "whole_sign"
	case "equal":
		return astrologydom.HouseEqual, "equal"
	default:
		return astrologydom.HousePlacidus, "placidus"
	}
}

func mapOutputToChart(
	out *astrologydom.ChartOutput,
	profileID uuid.UUID,
	houseSystem string,
	zodiacSystem string,
) *domain.NatalChart {

	if zodiacSystem == "" {
		zodiacSystem = "tropical"
	}

	chart := &domain.NatalChart{
		ID:           uuid.New(),
		ProfileID:    profileID,
		HouseSystem:  houseSystem,
		ZodiacSystem: zodiacSystem,
		IsRectified:  false,
	}

	for _, p := range out.Planets {
		chart.Planets = append(chart.Planets, domain.PlanetPosition{
			ID:            uuid.New(),
			ChartID:       chart.ID,
			PlanetName:    p.Planet.Name(),
			Longitude:     p.Longitude,
			Latitude:      p.Latitude,
			Speed:         p.Speed,
			IsRetrograde:  p.IsRetrograde,
			Sign:          p.Sign.String(),
			HousePosition: p.HouseNumber,
		})
	}

	for _, h := range out.Houses {
		chart.Houses = append(chart.Houses, domain.HouseCusp{
			ID:            uuid.New(),
			ChartID:       chart.ID,
			HouseNumber:   h.Number,
			CuspLongitude: h.Longitude,
			Sign:          h.Sign.String(),
		})
	}

	for _, a := range out.Aspects {
		chart.Aspects = append(chart.Aspects, domain.Aspect{
			ID:         uuid.New(),
			ChartID:    chart.ID,
			Planet1:    a.Planet1.Name(),
			Planet2:    a.Planet2.Name(),
			AspectType: domain.AspectType(a.Type),
			Orb:        a.Orb,
			IsApplying: a.IsApplying,
		})
	}

	return chart
}
