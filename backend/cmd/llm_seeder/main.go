package main

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/google/uuid"
	"github.com/zodiac/backend/internal/config"
	"github.com/zodiac/backend/internal/infrastructure/database"
)

var planets = []string{
	"Sun", "Moon", "Mercury", "Venus", "Mars", 
	"Jupiter", "Saturn", "Uranus", "Neptune", "Pluto",
}

var signs = []string{
	"Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
	"Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
}

type GeneratedContent struct {
	CoreMeaning   string   `json:"core_meaning"`
	RealLife      string   `json:"real_life"`
	Strengths     string   `json:"strengths"`
	Challenges    string   `json:"challenges"`
	Relationships string   `json:"relationships"`
	GrowthPath    string   `json:"growth_path"`
	KeyThemes     []string `json:"key_themes"`
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

	insertStmt := `
		INSERT INTO placement_interpretations (
			id, language, factor_type, factor_value_1, factor_value_2,
			core_meaning, real_life, strengths, challenges, relationships, growth_path, key_themes
		) VALUES (
			:id, :language, :factor_type, :factor_value_1, :factor_value_2,
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
		
		keyThemesStr := "{"
		for i, k := range s.KeyThemes {
			if i > 0 {
				keyThemesStr += ","
			}
			keyThemesStr += `"` + k + `"`
		}
		keyThemesStr += "}"

		record := map[string]interface{}{
			"id":             id,
			"language":       s.Language,
			"factor_type":    s.FactorType,
			"factor_value_1": s.FactorValue1,
			"factor_value_2": s.FactorValue2,
			"core_meaning":   s.CoreMeaning,
			"real_life":      s.RealLife,
			"strengths":      s.Strengths,
			"challenges":     s.Challenges,
			"relationships":  s.Relationships,
			"growth_path":    s.GrowthPath,
			"key_themes":     keyThemesStr,
		}

		_, err = dbConn.NamedExecContext(ctx, insertStmt, record)
		if err != nil {
			log.Fatalf("Failed to insert %s %s (%s): %v", s.FactorValue1, s.FactorValue2, s.Language, err)
		}
		fmt.Printf("Inserted %s %s in %s\n", s.FactorValue1, s.FactorValue2, s.Language)
	}

	fmt.Println("Seeding complete. A massive set of Sun interpretations has been saved!")
}
