package astrology

import (
	"math"

	domain "github.com/zodiac/backend/internal/domain/astrology"
)

// AspectEngine detects angular aspects between pairs of planet positions.
// It is stateless and safe for concurrent use.
type AspectEngine struct {
	definitions []domain.AspectDefinition
}

// NewAspectEngine creates an AspectEngine with the given aspect definitions.
// Pass domain.StandardAspects for a conventional natal chart analysis.
func NewAspectEngine(definitions []domain.AspectDefinition) *AspectEngine {
	return &AspectEngine{definitions: definitions}
}

// Calc examines all unique planet pairs in the provided positions and returns
// every aspect whose orb is within the configured tolerance.
//
// Complexity: O(n² * k) where n = number of planets, k = number of aspect definitions.
// For standard charts (12 planets, 8 aspects) this is negligible.
func (e *AspectEngine) Calc(positions []domain.PlanetPosition) []domain.Aspect {
	var aspects []domain.Aspect

	for i := 0; i < len(positions); i++ {
		for j := i + 1; j < len(positions); j++ {
			p1 := positions[i]
			p2 := positions[j]

			if a, found := e.matchAspect(p1, p2); found {
				aspects = append(aspects, a)
			}
		}
	}

	return aspects
}

// matchAspect checks whether p1 and p2 form any configured aspect.
// Returns the matched Aspect and true if found; zero value and false otherwise.
func (e *AspectEngine) matchAspect(p1, p2 domain.PlanetPosition) (domain.Aspect, bool) {
	sep := domain.AngularSeparation(p1.Longitude, p2.Longitude)

	for _, def := range e.definitions {
		orb := math.Abs(sep - def.Angle)
		if orb <= def.Orb {
			return domain.Aspect{
				Planet1:    p1.Planet,
				Planet2:    p2.Planet,
				Type:       def.Type,
				ExactAngle: def.Angle,
				Orb:        orb,
				IsApplying: calcIsApplying(p1, p2, def.Angle),
			}, true
		}
	}

	return domain.Aspect{}, false
}

// calcIsApplying determines whether two planets are moving toward (applying)
// or away from (separating) the exact aspect angle.
//
// Method: project both planet positions one day forward using their speeds,
// then compare the resulting orb to the current orb. If the future orb is
// smaller, the aspect is applying.
func calcIsApplying(p1, p2 domain.PlanetPosition, aspectAngle float64) bool {
	const dt = 1.0 // 1 day forward projection

	futLon1 := domain.NormalizeLongitude(p1.Longitude + p1.Speed*dt)
	futLon2 := domain.NormalizeLongitude(p2.Longitude + p2.Speed*dt)

	currentSep := domain.AngularSeparation(p1.Longitude, p2.Longitude)
	futureSep := domain.AngularSeparation(futLon1, futLon2)

	currentOrb := math.Abs(currentSep - aspectAngle)
	futureOrb := math.Abs(futureSep - aspectAngle)

	return futureOrb < currentOrb
}
