package main

import (
	"context"
	"fmt"
	"log"

	"github.com/google/uuid"
	"github.com/zodiac/backend/internal/config"
	"github.com/zodiac/backend/internal/infrastructure/database"
)

type SeedData struct {
	Language      string
	FactorType    string
	FactorValue1  string
	FactorValue2  string
	FactorValue3  string
	CoreMeaning   string
	RealLife      string
	Strengths     string
	Challenges    string
	Relationships string
	GrowthPath    string
	KeyThemes     []string
}

func main() {
	cfg, err := config.Load(".")
	if err != nil {
		log.Fatalf("Failed to load config: %v", err)
	}
	dbConn, err := database.NewPostgres(cfg.Database)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer dbConn.Close()

	ctx := context.Background()
	
	var seeds []SeedData
	seeds = append(seeds, getSunSeeds()...)
	seeds = append(seeds, getSunSeedsPart2()...)
	seeds = append(seeds, getMoonSeeds()...)
	seeds = append(seeds, getMoonSeedsPart2()...)
	seeds = append(seeds, getJupiterSeeds()...)
	seeds = append(seeds, getJupiterSeedsPart2()...)
	seeds = append(seeds, getSaturnSeeds()...)
	seeds = append(seeds, getSaturnSeedsPart2()...)
	seeds = append(seeds, getUranusSeeds()...)
	seeds = append(seeds, getUranusSeedsPart2()...)
	seeds = append(seeds, getNeptuneSeeds()...)
	seeds = append(seeds, getNeptuneSeedsPart2()...)
	seeds = append(seeds, getPlutoSeeds()...)
	seeds = append(seeds, getPlutoSeedsPart2()...)
	seeds = append(seeds, getNorthNodeSeeds()...)
	seeds = append(seeds, getNorthNodeSeedsPart2()...)
	seeds = append(seeds, getChironSeeds()...)
	seeds = append(seeds, getChironSeedsPart2()...)
	
	// Add mock data for Aspects and Houses so the UI works
	seeds = append(seeds, getMockHouseSeeds()...)
	seeds = append(seeds, getMockAspectSeeds()...)
	seeds = append(seeds, getMockHouseInSignSeeds()...)

	insertStmt := `
		INSERT INTO placement_interpretations (
			id, language, factor_type, factor_value_1, factor_value_2, factor_value_3,
			core_meaning, real_life, strengths, challenges, relationships, growth_path, key_themes
		) VALUES (
			:id, :language, :factor_type, :factor_value_1, :factor_value_2, NULLIF(:factor_value_3, ''),
			:core_meaning, :real_life, :strengths, :challenges, :relationships, :growth_path, :key_themes
		) ON CONFLICT (language, factor_type, factor_value_1, factor_value_2, factor_value_3)
		DO UPDATE SET
			core_meaning = EXCLUDED.core_meaning,
			real_life = EXCLUDED.real_life,
			strengths = EXCLUDED.strengths,
			challenges = EXCLUDED.challenges,
			relationships = EXCLUDED.relationships,
			growth_path = EXCLUDED.growth_path,
			key_themes = EXCLUDED.key_themes,
			updated_at = CURRENT_TIMESTAMP;
	`

	for _, s := range seeds {
		id := uuid.New()
		
		record := map[string]interface{}{
			"id":             id,
			"language":       s.Language,
			"factor_type":    s.FactorType,
			"factor_value_1": s.FactorValue1,
			"factor_value_2": s.FactorValue2,
			"factor_value_3": s.FactorValue3,
			"core_meaning":   s.CoreMeaning,
			"real_life":      s.RealLife,
			"strengths":      s.Strengths,
			"challenges":     s.Challenges,
			"relationships":  s.Relationships,
			"growth_path":    s.GrowthPath,
			"key_themes":     `{"` + s.KeyThemes[0] + `","` + s.KeyThemes[1] + `","` + s.KeyThemes[2] + `","` + s.KeyThemes[3] + `","` + s.KeyThemes[4] + `"}`, // simple pg array string
		}

		_, err = dbConn.NamedExecContext(ctx, insertStmt, record)
		if err != nil {
			log.Fatalf("Failed to insert %s %s (%s): %v", s.FactorValue1, s.FactorValue2, s.Language, err)
		}
		fmt.Printf("Inserted %s %s in %s\n", s.FactorValue1, s.FactorValue2, s.Language)
	}

	fmt.Println("Seeding complete.")
}
