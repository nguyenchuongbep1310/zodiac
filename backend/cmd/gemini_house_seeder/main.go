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
	apiKey := os.Getenv("GEMINI_API_KEY")
	if apiKey == "" {
		log.Fatal("GEMINI_API_KEY environment variable is required")
	}

	cfg, err := config.Load(".")
	if err != nil {
		log.Fatalf("Failed to load config: %v", err)
	}

	dbConn, err := database.NewPostgres(cfg.Database)
	if err != nil {
		log.Fatalf("Failed to connect to db: %v", err)
	}
	defer dbConn.Close()

	ctx := context.Background()

	client, err := genai.NewClient(ctx, &genai.ClientConfig{
		Backend: genai.BackendGeminiAPI,
		APIKey:  apiKey,
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

	for _, house := range houses {
		for _, sign := range signs {
			for _, lang := range languages {
				fmt.Printf("Generating House %s in %s in %s...\n", house, sign, lang)

				prompt := fmt.Sprintf(`Act as a highly experienced psychological astrologer. Please provide a detailed astrological analysis for House %s located in the zodiac sign of %s.

Provide a profound, easy-to-understand, and highly applicable interpretation. Format your response strictly according to the following 7 sections:

Core Meaning: Analyze the essence, primary energy, and fundamental meaning of this House/Sign combination.
In Reality: Specifically describe how this energy manifests in the native's daily life, habits, worldview, and behaviors.
Strengths: Highlight the greatest advantages, natural talents, and gifts that this placement brings.
Challenges: Point out the blind spots, difficulties, psychological lessons, or pitfalls the native is prone to experience.
Relationships: Explain how this placement affects the native's interaction style, connections, and communication with others.
Growth Path: Provide practical advice for the native to evolve, maximize their potential, and balance their shortcomings.
Key Themes: A list of exactly 5 keywords representing the combination.

Note: The tone should be positive, empathetic, and healing, aimed at helping the reader gain better self-awareness. Keep the language in %s.

Return ONLY a valid JSON object matching this schema without any markdown formatting or code blocks:
{
  "core_meaning": "string",
  "real_life": "string",
  "strengths": "string",
  "challenges": "string",
  "relationships": "string",
  "growth_path": "string",
  "key_themes": ["string", "string", "string", "string", "string"]
}`, house, sign, lang)

				resp, err := client.Models.GenerateContent(ctx, "gemini-flash-latest", genai.Text(prompt), &genai.GenerateContentConfig{
					Temperature: genai.Ptr[float32](0.7),
				})
				if err != nil {
					log.Printf("Error requesting House %s in %s (%s): %v", house, sign, lang, err)
					continue
				}

				if len(resp.Candidates) == 0 || resp.Candidates[0].Content == nil {
					log.Printf("Empty response for House %s in %s", house, sign)
					continue
				}

				jsonText := ""
				for _, part := range resp.Candidates[0].Content.Parts {
					if part.Text != "" {
						jsonText += part.Text
					}
				}

				jsonText = strings.TrimSpace(jsonText)
				jsonText = strings.TrimPrefix(jsonText, "```json")
				jsonText = strings.TrimPrefix(jsonText, "```")
				jsonText = strings.TrimSuffix(jsonText, "```")
				jsonText = strings.TrimSpace(jsonText)

				var genContent GeneratedContent
				if err := json.Unmarshal([]byte(jsonText), &genContent); err != nil {
					log.Printf("Error parsing JSON schema content for House %s in %s (%s): %v\nRaw text: %s", house, sign, lang, err, jsonText)
					continue
				}

				id := uuid.New()
				
				var keyThemes string
				var quotedThemes []string
				for _, t := range genContent.KeyThemes {
					escaped := strings.ReplaceAll(t, "\"", "\\\"")
					quotedThemes = append(quotedThemes, `"`+escaped+`"`)
				}
				keyThemes = `{` + strings.Join(quotedThemes, ",") + `}`

				record := map[string]interface{}{
					"id":             id,
					"language":       lang,
					"factor_type":    "house_in_sign",
					"factor_value_1": house,
					"factor_value_2": sign,
					"factor_value_3": "",
					"core_meaning":   genContent.CoreMeaning,
					"real_life":      genContent.RealLife,
					"strengths":      genContent.Strengths,
					"challenges":     genContent.Challenges,
					"relationships":  genContent.Relationships,
					"growth_path":    genContent.GrowthPath,
					"key_themes":     keyThemes,
				}

				_, err = dbConn.NamedExecContext(ctx, insertStmt, record)
				if err != nil {
					log.Printf("Failed to insert House %s in %s (%s): %v", house, sign, lang, err)
				} else {
					fmt.Printf("Successfully inserted House %s in %s in %s\n", house, sign, lang)
				}

				time.Sleep(2 * time.Second)
			}
		}
	}

	fmt.Println("Seeding complete!")
}
