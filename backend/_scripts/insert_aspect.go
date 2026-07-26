package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
)

type AspectData struct {
	CoreMeaning   string `json:"core_meaning"`
	InReality     string `json:"in_reality"`
	Strengths     string `json:"strengths"`
	Challenges    string `json:"challenges"`
}

func main() {
	jsonData := `{
		"core_meaning": "The Sun-Venus conjunction represents a seamless blending of the core identity (Sun) with the principles of love, beauty, values, and relationship (Venus). The essence of this energetic interaction is an inherent desire for harmony, aesthetics, and connection. The main message of this aspect is that the self is most fully realized and expressed through love, creativity, and the pursuit of what is deeply valued.",
		"in_reality": "In daily life, this aspect creates a personality that is generally charming, diplomatic, and deeply attuned to aesthetics and interpersonal harmony. The native often possesses a naturally pleasing demeanor, seeking to smooth over conflicts and create a beautiful environment. They may have a strong inclination toward art, fashion, or music. Their sense of self is closely intertwined with their personal relationships and how well they are liked or appreciated by others.",
		"strengths": "Innate advantages include immense personal charm, grace, and a natural ability to attract others. They often possess artistic talents or a highly refined sense of taste. This placement brings a gift for diplomacy and peacemaking, as they inherently understand how to connect with others and foster goodwill. They possess a deep capacity for love and an effortless ability to make others feel valued and comfortable in their presence.",
		"challenges": "Internal conflicts often arise from an over-reliance on external validation and a fear of being disliked. The native may compromise their own authentic truth or avoid necessary conflict just to maintain a superficial sense of peace. A significant lesson is learning to separate one's inherent self-worth from the approval or romantic attention of others. They must guard against vanity, laziness, or becoming overly dependent on the comforts of a relationship to feel complete."
	}`

	var data AspectData
	if err := json.Unmarshal([]byte(jsonData), &data); err != nil {
		log.Fatal(err)
	}

	ctx := context.Background()
	conn, err := pgx.Connect(ctx, "postgres://zodiac_user:zodiac_pass@localhost:5432/zodiac_db?sslmode=disable")
	if err != nil {
		log.Fatalf("Unable to connect to database: %v\n", err)
	}
	defer conn.Close(ctx)

	insertStmt := `
		INSERT INTO placement_interpretations (
			id, language, factor_type, factor_value_1, factor_value_2, factor_value_3,
			core_meaning, real_life, strengths, challenges, relationships, growth_path
		) VALUES (
			$1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12
		) ON CONFLICT (language, factor_type, factor_value_1, factor_value_2, factor_value_3)
		DO UPDATE SET
			core_meaning = EXCLUDED.core_meaning,
			real_life = EXCLUDED.real_life,
			strengths = EXCLUDED.strengths,
			challenges = EXCLUDED.challenges,
			relationships = EXCLUDED.relationships,
			growth_path = EXCLUDED.growth_path,
			updated_at = CURRENT_TIMESTAMP;
	`

	id := uuid.New()
	_, err = conn.Exec(ctx, insertStmt,
		id, "en", "aspect", "Sun", "Venus", "Conjunction",
		data.CoreMeaning, data.InReality, data.Strengths, data.Challenges, "", "",
	)
	if err != nil {
		log.Fatalf("Insert failed: %v", err)
	}

	fmt.Println("Successfully inserted Sun-Venus Conjunction data!")
}
