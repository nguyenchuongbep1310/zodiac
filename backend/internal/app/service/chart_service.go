package service

import (
	"context"
	"fmt"
	"time"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/zodiac/backend/internal/domain"
	astrologydom "github.com/zodiac/backend/internal/domain/astrology"
	domrepo "github.com/zodiac/backend/internal/domain/repository"
)

// ChartService handles natal chart calculation and retrieval use-cases.
type ChartService struct {
	chartRepo   domrepo.ChartRepository
	calculator  astrologydom.ChartCalculator
	ephePath    string
	log         *zap.Logger
}

// NewChartService constructs the service with all required dependencies.
func NewChartService(
	chartRepo domrepo.ChartRepository,
	calculator astrologydom.ChartCalculator,
	ephePath string,
	log *zap.Logger,
) *ChartService {
	return &ChartService{
		chartRepo:   chartRepo,
		calculator:  calculator,
		ephePath:    ephePath,
		log:         log,
	}
}

type CalculateParams struct {
	UserID       *uuid.UUID
	Name         string
	BirthDate    time.Time
	BirthTime    time.Time
	Timezone     string
	Latitude     float64
	Longitude    float64
	City         string
	HouseSystem  string
	ZodiacSystem string
}

// Calculate fetches the birth profile (enforcing ownership), runs the
// ephemeris-based calculation pipeline, and persists the resulting NatalChart.
func (s *ChartService) Calculate(
	ctx context.Context,
	params CalculateParams,
) (*domain.NatalChart, error) {
	// 2. Resolve house system.
	hs, houseSystemStr := resolveHouseSystem(params.HouseSystem)

	loc, err := time.LoadLocation(params.Timezone)
	if err != nil {
		return nil, domain.ErrValidation("timezone must be a valid IANA time zone name, e.g. Asia/Ho_Chi_Minh")
	}

	utcTime := time.Date(
		params.BirthDate.Year(), params.BirthDate.Month(), params.BirthDate.Day(),
		params.BirthTime.Hour(), params.BirthTime.Minute(), params.BirthTime.Second(),
		0, loc,
	).UTC()

	// 3. Build the calculation input.
	input := astrologydom.ChartInput{
		BirthTime:   utcTime,
		Latitude:    params.Latitude,
		Longitude:   params.Longitude,
		HouseSystem: hs,
		EphePath:    s.ephePath,
	}

	// 4. Run the calculation pipeline.
	output, err := s.calculator.Calculate(input)
	if err != nil {
		return nil, fmt.Errorf("chartService.Calculate engine: %w", err)
	}

	// 5. Map output → domain NatalChart.
	chart := mapOutputToChart(output, params, houseSystemStr)

	// 6. Persist to the database.
	saved, err := s.chartRepo.Save(ctx, chart)
	if err != nil {
		return nil, fmt.Errorf("chartService.Calculate save: %w", err)
	}

	s.log.Info("natal chart calculated and saved",
		zap.String("chart_id", saved.ID.String()),
	)

	return saved, nil
}

// GetByID returns a NatalChart by its primary key.
func (s *ChartService) GetByID(ctx context.Context, chartID uuid.UUID) (*domain.NatalChart, error) {
	chart, err := s.chartRepo.GetByID(ctx, chartID)
	if err != nil {
		return nil, fmt.Errorf("chartService.GetByID: %w", err)
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
	params CalculateParams,
	houseSystem string,
) *domain.NatalChart {

	if params.ZodiacSystem == "" {
		params.ZodiacSystem = "tropical"
	}

	chart := &domain.NatalChart{
		ID:           uuid.New(),
		UserID:       params.UserID,
		Name:         params.Name,
		BirthDate:    params.BirthDate,
		BirthTime:    params.BirthTime,
		Timezone:     params.Timezone,
		Latitude:     params.Latitude,
		Longitude:    params.Longitude,
		City:         params.City,
		HouseSystem:  houseSystem,
		ZodiacSystem: params.ZodiacSystem,
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
