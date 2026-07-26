package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"sort"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/zodiac/backend/internal/config"
	"github.com/zodiac/backend/internal/infrastructure/database"
	"google.golang.org/genai"
)

var planets = []string{
	"Sun", "Moon", "Mercury", "Venus", "Mars", "Jupiter", "Saturn",
	"Uranus", "Neptune", "Pluto", "North Node", "South Node", "Chiron", "Lilith",
}

var aspectTypes = []string{
	"conjunction", "sextile", "square", "trine", "opposition",
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

func sortedPlanetPair(p1, p2 string) (string, string) {
	pair := []string{p1, p2}
	sort.Strings(pair)
	return pair[0], pair[1]
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
			:id, :language, :factor_type, :factor_value_1, :factor_value_2, :factor_value_3,
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

	for i := 0; i < len(planets); i++ {
		for j := i + 1; j < len(planets); j++ {
			p1, p2 := sortedPlanetPair(planets[i], planets[j])
			
			for _, aspect := range aspectTypes {
				for _, lang := range languages {
					fmt.Printf("Generating %s %s %s in %s...\n", p1, aspect, p2, lang)

					prompt := fmt.Sprintf(`Act as a highly experienced psychological astrologer. Please provide a detailed astrological analysis for the %s aspect between %s and %s.

Deeply analyze the interaction, blending, or conflict of energies between these two planets. Return your results strictly according to the following 7 sections:

Core Meaning: What is the essence of the energetic interaction between these two planets through this aspect? What is its main message?
In Reality: What typical behavioral patterns, psychological tendencies, emotional responses, or life circumstances does this aspect create in real life?
Strengths: What innate abilities, advantages, or special gifts does this interaction bring to the native?
Challenges: What internal conflicts, inhibitions, or karmic lessons must the native recognize and learn to overcome when these two energies are triggered simultaneously?
Relationships: Explain how this placement affects the native's interaction style, connections, and communication with others.
Growth Path: Provide practical advice for the native to evolve, maximize their potential, and balance their shortcomings.
Key Themes: A list of exactly 5 keywords representing the interaction.

Note: Explain this from an evolutionary/psychological astrology perspective. Avoid fatalistic or overly negative language. Keep the language in %s.

Return ONLY a valid JSON object matching this schema without any markdown formatting or code blocks:
{
  "core_meaning": "string",
  "real_life": "string",
  "strengths": "string",
  "challenges": "string",
  "relationships": "string",
  "growth_path": "string",
  "key_themes": ["string", "string", "string", "string", "string"]
}`, aspect, p1, p2, lang)

					resp, err := client.Models.GenerateContent(ctx, "gemini-flash-latest", genai.Text(prompt), &genai.GenerateContentConfig{
						Temperature: genai.Ptr[float32](0.7),
					})
					if err != nil {
						log.Printf("Error requesting %s %s %s (%s): %v", p1, aspect, p2, lang, err)
						continue
					}

					if len(resp.Candidates) == 0 || resp.Candidates[0].Content == nil {
						log.Printf("Empty response for %s %s %s (%s)", p1, aspect, p2, lang)
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
						log.Printf("Error parsing JSON schema content for %s %s %s (%s): %v\nRaw text: %s", p1, aspect, p2, lang, err, jsonText)
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
						"factor_type":    "aspect",
						"factor_value_1": p1,
						"factor_value_2": p2,
						"factor_value_3": aspect,
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
						log.Printf("Failed to insert %s %s %s (%s): %v", p1, aspect, p2, lang, err)
					} else {
						fmt.Printf("Successfully inserted %s %s %s in %s\n", p1, aspect, p2, lang)
					}

					time.Sleep(2 * time.Second)
				}
			}
		}
	}

	fmt.Println("Seeding complete!")
}
