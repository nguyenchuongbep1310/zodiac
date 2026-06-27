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
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/zodiac/backend/internal/config"
	"github.com/zodiac/backend/internal/infrastructure/database"
)

var remainingPlanets = []string{
	"Venus", "Mars", "Jupiter", "Saturn", 
	"Uranus", "Neptune", "Pluto", "North Node", "Chiron",
}

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

type GeminiRequest struct {
	SystemInstruction struct {
		Parts []struct {
			Text string `json:"text"`
		} `json:"parts"`
	} `json:"system_instruction"`
	Contents []struct {
		Parts []struct {
			Text string `json:"text"`
		} `json:"parts"`
	} `json:"contents"`
	GenerationConfig struct {
		ResponseMimeType string      `json:"responseMimeType"`
		ResponseSchema   interface{} `json:"responseSchema"`
	} `json:"generationConfig"`
}

type GeminiResponse struct {
	Candidates []struct {
		Content struct {
			Parts []struct {
				Text string `json:"text"`
			} `json:"parts"`
		} `json:"content"`
	} `json:"candidates"`
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

	httpClient := &http.Client{Timeout: 60 * time.Second}
	url := "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=" + apiKey

	responseSchema := map[string]interface{}{
		"type": "OBJECT",
		"properties": map[string]interface{}{
			"core_meaning":   map[string]string{"type": "STRING"},
			"real_life":      map[string]string{"type": "STRING"},
			"strengths":      map[string]string{"type": "STRING"},
			"challenges":     map[string]string{"type": "STRING"},
			"relationships":  map[string]string{"type": "STRING"},
			"growth_path":    map[string]string{"type": "STRING"},
			"key_themes": map[string]interface{}{
				"type": "ARRAY",
				"items": map[string]string{"type": "STRING"},
			},
		},
		"required": []string{"core_meaning", "real_life", "strengths", "challenges", "relationships", "growth_path", "key_themes"},
	}

	for _, planet := range remainingPlanets {
		for _, sign := range signs {
			for _, lang := range languages {
				fmt.Printf("Generating %s in %s (%s)...\n", planet, sign, lang)

				prompt := fmt.Sprintf("Act as a Senior Psychological Astrologer. Provide a highly personalized, empathetic, and psychologically deep interpretation for someone with %s in %s. Increase depth, avoid encyclopedia styles, and focus on real-life behaviors. Language: %s. Return exactly the JSON format requested.", planet, sign, lang)

				reqBody := GeminiRequest{}
				reqBody.SystemInstruction.Parts = []struct{ Text string `json:"text"` }{{Text: "You are a master psychological astrologer."}}
				reqBody.Contents = []struct {
					Parts []struct {
						Text string `json:"text"`
					} `json:"parts"`
				}{{Parts: []struct{ Text string `json:"text"` }{{Text: prompt}}}}
				reqBody.GenerationConfig.ResponseMimeType = "application/json"
				reqBody.GenerationConfig.ResponseSchema = responseSchema

				reqBytes, _ := json.Marshal(reqBody)
				req, _ := http.NewRequest("POST", url, bytes.NewBuffer(reqBytes))
				req.Header.Set("Content-Type", "application/json")

				resp, err := httpClient.Do(req)
				if err != nil {
					log.Printf("Error requesting %s %s %s: %v", planet, sign, lang, err)
					continue
				}

				bodyBytes, _ := io.ReadAll(resp.Body)
				resp.Body.Close()

				if resp.StatusCode != 200 {
					log.Printf("API Error %s %s %s: %s", planet, sign, lang, string(bodyBytes))
					time.Sleep(5 * time.Second) // wait before retry
					continue
				}

				var geminiResp GeminiResponse
				if err := json.Unmarshal(bodyBytes, &geminiResp); err != nil || len(geminiResp.Candidates) == 0 {
					log.Printf("Error unmarshalling response for %s %s %s: %v", planet, sign, lang, err)
					continue
				}

				var genContent GeneratedContent
				if err := json.Unmarshal([]byte(geminiResp.Candidates[0].Content.Parts[0].Text), &genContent); err != nil {
					log.Printf("Error parsing JSON schema content for %s %s %s: %v", planet, sign, lang, err)
					continue
				}

				id := uuid.New()
				
				var keyThemes string
				var quotedThemes []string
				for _, t := range genContent.KeyThemes {
					quotedThemes = append(quotedThemes, `"`+t+`"`)
				}
				keyThemes = `{` + strings.Join(quotedThemes, ",") + `}`

				record := map[string]interface{}{
					"id":             id,
					"language":       lang,
					"factor_type":    "planet_in_sign",
					"factor_value_1": planet,
					"factor_value_2": sign,
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
					log.Printf("Failed to insert %s %s %s: %v", planet, sign, lang, err)
				} else {
					fmt.Printf("Successfully inserted %s %s in %s\n", planet, sign, lang)
				}

				// Sleep to respect the free tier rate limit of 15 requests per minute
				time.Sleep(4 * time.Second)
			}
		}
	}

	fmt.Println("Seeding complete!")
}
