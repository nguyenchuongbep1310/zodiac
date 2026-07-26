package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/joho/godotenv"
	"github.com/zodiac/backend/internal/config"
	"github.com/zodiac/backend/internal/infrastructure/database"
	"google.golang.org/genai"
)

var houses = []string{"1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"}
var signs = []string{
	"Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
	"Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
}
var languages = []string{"en", "vi"}

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
	_ = godotenv.Load(".env")
	
	if os.Getenv("GEMINI_API_KEY") == "" {
		log.Fatalf("Error: GEMINI_API_KEY is not set in the environment or backend/.env file.")
	}

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

	client, err := genai.NewClient(ctx, &genai.ClientConfig{
		Backend: genai.BackendGeminiAPI,
		APIKey:  os.Getenv("GEMINI_API_KEY"),
	})
	if err != nil {
		log.Fatalf("Error creating client: %v", err)
	}

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

	for _, lang := range languages {
		for _, house := range houses {
			for _, sign := range signs {
				fmt.Printf("Generating house_in_sign %s in %s for %s...\n", house, sign, lang)
				
				promptText := fmt.Sprintf(`You are an expert astrologer. Write a detailed astrological interpretation for the astrological placement: House %s in the sign of %s.
Write the response in the '%s' language (if 'vi', use Vietnamese; if 'en', use English).
Return ONLY a valid JSON object matching this schema without any markdown formatting or code blocks:
{
  "core_meaning": "string (core essence)",
  "real_life": "string (how it manifests in real life)",
  "strengths": "string (strengths)",
  "challenges": "string (challenges)",
  "relationships": "string (how it affects relationships)",
  "growth_path": "string (how to grow)",
  "key_themes": ["string", "string", "string"]
}`, house, sign, lang)

				resp, err := client.Models.GenerateContent(ctx, "gemini-flash-latest", genai.Text(promptText), &genai.GenerateContentConfig{
					Temperature: genai.Ptr[float32](0.7),
				})
				if err != nil {
					log.Printf("Error generating content for %s in %s: %v", house, sign, err)
					time.Sleep(5 * time.Second)
					continue
				}

				if len(resp.Candidates) == 0 || resp.Candidates[0].Content == nil {
					log.Printf("Empty response for %s in %s", house, sign)
					continue
				}

				jsonText := ""
				for _, part := range resp.Candidates[0].Content.Parts {
					if part.Text != "" {
						jsonText += part.Text
					}
				}

				// Clean up markdown block if present
				jsonText = strings.TrimSpace(jsonText)
				jsonText = strings.TrimPrefix(jsonText, "```json")
				jsonText = strings.TrimPrefix(jsonText, "```")
				jsonText = strings.TrimSuffix(jsonText, "```")
				jsonText = strings.TrimSpace(jsonText)

				var content GeneratedContent
				if err := json.Unmarshal([]byte(jsonText), &content); err != nil {
					log.Printf("Error parsing JSON for %s in %s: %v. Raw text: %s", house, sign, err, jsonText)
					continue
				}

				keyThemesStr := "{"
				for i, k := range content.KeyThemes {
					if i > 0 {
						keyThemesStr += ","
					}
					// Escape quotes in PostgreSQL arrays
					escaped := strings.ReplaceAll(k, "\"", "\\\"")
					keyThemesStr += `"` + escaped + `"`
				}
				keyThemesStr += "}"

				record := map[string]interface{}{
					"id":             uuid.New(),
					"language":       lang,
					"factor_type":    "house_in_sign",
					"factor_value_1": house,
					"factor_value_2": sign,
					"factor_value_3": "",
					"core_meaning":   content.CoreMeaning,
					"real_life":      content.RealLife,
					"strengths":      content.Strengths,
					"challenges":     content.Challenges,
					"relationships":  content.Relationships,
					"growth_path":    content.GrowthPath,
					"key_themes":     keyThemesStr,
				}

				_, err = dbConn.NamedExecContext(ctx, insertStmt, record)
				if err != nil {
					log.Printf("Failed to insert %s %s (%s): %v", house, sign, lang, err)
				} else {
					fmt.Printf("Successfully saved %s %s in %s\n", house, sign, lang)
				}
				
				// Sleep to respect API rate limits
				time.Sleep(2 * time.Second)
			}
		}
	}

	fmt.Println("Seeding complete! Real interpretations have been saved.")
}
