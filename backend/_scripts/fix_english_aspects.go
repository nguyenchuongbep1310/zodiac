package main

import (
	"context"
	"fmt"
	"log"
	"sort"
	"strings"

	"github.com/jackc/pgx/v5"
)

type AspectDataEn struct {
	P1         string
	P2         string
	Aspect     string
	Core       string
	RealLife   string
	Strengths  string
	Challenges string
}

func sortedPair(p1, p2 string) (string, string) {
	pair := []string{p1, p2}
	sort.Strings(pair)
	return pair[0], pair[1]
}

func main() {
	ctx := context.Background()
	conn, err := pgx.Connect(ctx, "postgres://zodiac_user:zodiac_pass@localhost:5432/zodiac_db?sslmode=disable")
	if err != nil {
		log.Fatalf("Unable to connect to database: %v\n", err)
	}
	defer conn.Close(ctx)

	// 1. Full English descriptions for key aspects
	aspectsData := []AspectDataEn{
		{
			P1: "Sun", P2: "Moon", Aspect: "conjunction",
			Core:       "A powerful blending of identity (Sun) and emotions (Moon). You operate as a unified force from the inside out.",
			RealLife:   "You naturally act on intuition and emotion. You are deeply authentic, though at times subjective in your self-awareness.",
			Strengths:  "High integrity, easy concentration of energy toward singular goals, and profound self-understanding.",
			Challenges: "Difficulty separating logic from feelings. You can get absorbed in your subjective inner world.",
		},
		{
			P1: "Sun", P2: "Moon", Aspect: "sextile",
			Core:       "A harmonious balance between self-expression and inner emotional needs.",
			RealLife:   "Life flows with minimal inner conflict. You easily attract support from others thanks to your pleasant disposition.",
			Strengths:  "Great emotional communication, balanced relationships, and strong intuitive support for practical goals.",
			Challenges: "Ease can lead to complacency if you do not actively challenge yourself.",
		},
		{
			P1: "Sun", P2: "Moon", Aspect: "square",
			Core:       "An internal tug-of-war between conscious desires (Sun) and emotional security needs (Moon).",
			RealLife:   "You frequently feel conflicted between what you want to do and what you feel you need to do.",
			Strengths:  "Immense drive for self-growth and personal achievement. Resilience in overcoming obstacles.",
			Challenges: "Inner tension and difficulty finding quiet peace within yourself.",
		},
		{
			P1: "Sun", P2: "Moon", Aspect: "trine",
			Core:       "Natural harmony, luck, and emotional stability. Balanced masculine and feminine energies.",
			RealLife:   "You project an innate sense of calm and confidence, rarely having to fight fiercely for basic needs.",
			Strengths:  "Natural charisma, inner peace, self-healing capability, and effortless rapport with others.",
			Challenges: "Risk of becoming overly comfortable or relying too heavily on natural good fortune.",
		},
		{
			P1: "Sun", P2: "Moon", Aspect: "opposition",
			Core:       "A fundamental polarity between self-assertion and emotional receptivity, often projected onto relationships.",
			RealLife:   "Life is a series of experiences requiring compromise between personal desires and partner needs.",
			Strengths:  "Multi-dimensional perspective, deep psychological insight into others when mature.",
			Challenges: "Internal tug-of-war, mood swings, and projecting unresolved inner conflicts onto partners.",
		},
		{
			P1: "Sun", P2: "Uranus", Aspect: "trine",
			Core:       "Spontaneous flow of innovation, originality, and progressive self-expression.",
			RealLife:   "You easily express your unique individuality without causing friction. You love exploring the new and unusual.",
			Strengths:  "Brilliant original insights, adaptability to change, intuitive grasp of futuristic ideas.",
			Challenges: "Tendency to lose interest once initial excitement fades, needing conscious discipline.",
		},
		{
			P1: "Sun", P2: "Uranus", Aspect: "conjunction",
			Core:       "A rebellious, brilliant, and highly independent core self.",
			RealLife:   "You break conventions naturally, act unpredictably, and constantly seek innovation and freedom.",
			Strengths:  "Breakthrough creativity, sharp intuition, courage to stand out from the crowd.",
			Challenges: "Impatient with routine, prone to sudden impulsive changes, resistant to authority.",
		},
		{
			P1: "Sun", P2: "Uranus", Aspect: "sextile",
			Core:       "Opportunities for personal growth through innovation and positive surprises.",
			RealLife:   "You regularly generate fresh ideas and seamlessly adopt new tech and unique social circles.",
			Strengths:  "Open-minded intellect, magnetic unconventional charm, forward-thinking perspective.",
			Challenges: "Occasional restlessness or reluctance to commit to repetitive routines.",
		},
		{
			P1: "Sun", P2: "Uranus", Aspect: "square",
			Core:       "Tension between the ego's desire for stability and Uranus's urge for sudden disruption.",
			RealLife:   "You experience sudden life shifts and strongly resist any form of restriction or forced conformity.",
			Strengths:  "Powerful drive to break outdated paradigms, fierce reformative energy.",
			Challenges: "Erratic temperament, rebellious impulsivity, and difficulty maintaining steady routines.",
		},
		{
			P1: "Sun", P2: "Uranus", Aspect: "opposition",
			Core:       "Polarity between personal identity and chaotic, unpredictable external forces.",
			RealLife:   "Relationships start or end abruptly. You constantly fight to defend your personal independence.",
			Strengths:  "Capacity for sudden self-awakening, objective and non-judgmental perspective.",
			Challenges: "Internal instability and pushing others away whenever you feel constrained.",
		},
	}

	insertStmt := `
		INSERT INTO placement_interpretations (
			language, factor_type, factor_value_1, factor_value_2, factor_value_3,
			core_meaning, real_life, strengths, challenges, relationships, growth_path, key_themes
		) VALUES (
			'en', 'aspect', $1::text, $2::text, $3::text, $4::text, $5::text, $6::text, $7::text, '', '', ARRAY[$1::text, $2::text, $3::text]
		) ON CONFLICT (language, factor_type, factor_value_1, factor_value_2, factor_value_3)
		DO UPDATE SET
			core_meaning = EXCLUDED.core_meaning,
			real_life = EXCLUDED.real_life,
			strengths = EXCLUDED.strengths,
			challenges = EXCLUDED.challenges,
			updated_at = CURRENT_TIMESTAMP;
	`

	count := 0
	for _, a := range aspectsData {
		v1, v2 := sortedPair(a.P1, a.P2)
		tag, err := conn.Exec(ctx, insertStmt,
			v1, v2, strings.ToLower(a.Aspect),
			a.Core, a.RealLife, a.Strengths, a.Challenges,
		)
		if err != nil {
			log.Printf("Failed to insert %s-%s %s: %v", v1, v2, a.Aspect, err)
		} else {
			count += int(tag.RowsAffected())
		}
	}

	// 2. Clean up any Vietnamese text copied over to English in placement_interpretations
	// Replace Vietnamese text in English entries with clean English text
	cleanStmt := `
		UPDATE placement_interpretations
		SET core_meaning = CASE WHEN core_meaning ~ '[àáảãạăắằẳẵặâấầẩẫậèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵđ]' THEN 'Dynamic interaction between planetary principles.' ELSE core_meaning END,
		    real_life = CASE WHEN real_life ~ '[àáảãạăắằẳẵặâấầẩẫậèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵđ]' OR real_life = '' THEN 'In practical daily life, this aspect influences how you manage personal energy and relationships.' ELSE real_life END,
		    strengths = CASE WHEN strengths ~ '[àáảãạăắằẳẵặâấầẩẫậèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵđ]' OR strengths = '' THEN 'Grants unique resilience, self-awareness, and opportunities for personal growth.' ELSE strengths END,
		    challenges = CASE WHEN challenges ~ '[àáảãạăắằẳẵặâấầẩẫặèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵđ]' OR challenges = '' THEN 'Requires conscious effort and emotional balance to navigate effectively.' ELSE challenges END
		WHERE language = 'en';
	`
	tagClean, err := conn.Exec(ctx, cleanStmt)
	if err != nil {
		log.Printf("Failed to clean Vietnamese text in English entries: %v", err)
	} else {
		fmt.Printf("Cleaned Vietnamese text for English entries! Rows updated: %d\n", tagClean.RowsAffected())
	}

	fmt.Printf("Successfully updated English aspect interpretations! Total key aspects updated: %d\n", count)
}
