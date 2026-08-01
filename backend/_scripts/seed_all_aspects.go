package main

import (
	"context"
	"fmt"
	"log"
	"sort"
	"strings"

	"github.com/jackc/pgx/v5"
)

var planets = []string{
	"Sun", "Moon", "Mercury", "Venus", "Mars", "Jupiter", "Saturn",
	"Uranus", "Neptune", "Pluto", "North Node", "South Node", "Chiron", "Lilith",
}

var aspectTypes = []string{
	"conjunction", "semi-sextile", "semi-square", "sextile",
	"square", "trine", "quincunx", "opposition",
}

func sortedPair(p1, p2 string) (string, string) {
	pair := []string{p1, p2}
	sort.Strings(pair)
	return pair[0], pair[1]
}

func getAspectMeaning(p1, p2, aspect, lang string) (core, real, str, chal string) {
	aspectTitle := strings.Title(aspect)
	if lang == "en" {
		core = fmt.Sprintf("The %s aspect between %s and %s represents a dynamic interplay between %s principles and %s energies.", aspectTitle, p1, p2, p1, p2)
		real = fmt.Sprintf("In daily life, this aspect manifests as an ongoing dialogue between your %s drive and your %s expression.", p1, p2)
		str = fmt.Sprintf("Grants high adaptability, psychological depth, and unique insights when balancing %s with %s.", p1, p2)
		chal = fmt.Sprintf("Requires conscious effort to integrate conflicting urges between %s and %s without over-indexing on one.", p1, p2)
	} else {
		core = fmt.Sprintf("Góc chiếu %s giữa %s và %s thể hiện sự tương tác năng lượng giữa hai hành tinh %s và %s.", aspectTitle, p1, p2, p1, p2)
		real = fmt.Sprintf("Trong cuộc sống hàng ngày, góc chiếu này tạo ra sự kết nối trực tiếp giữa năng lượng %s và biểu hiện của %s.", p1, p2)
		str = fmt.Sprintf("Khả năng thích ứng cao, thấu hiểu tâm lý và phát huy sức mạnh tổng hợp từ %s và %s.", p1, p2)
		chal = fmt.Sprintf("Cần học cách cân bằng và hòa hợp nhu cầu của %s và %s để tránh xung đột nội tâm.", p1, p2)
	}
	return
}

func main() {
	ctx := context.Background()
	conn, err := pgx.Connect(ctx, "postgres://zodiac_user:zodiac_pass@localhost:5432/zodiac_db?sslmode=disable")
	if err != nil {
		log.Fatalf("Unable to connect to database: %v\n", err)
	}
	defer conn.Close(ctx)

	insertStmt := `
		INSERT INTO placement_interpretations (
			language, factor_type, factor_value_1, factor_value_2, factor_value_3,
			core_meaning, real_life, strengths, challenges, relationships, growth_path, key_themes
		) VALUES (
			$1, 'aspect', $2, $3, $4, $5, $6, $7, $8, '', '', ARRAY[$9, $10, $11]
		) ON CONFLICT (language, factor_type, factor_value_1, factor_value_2, factor_value_3) DO NOTHING;
	`

	insertedCount := 0
	for i := 0; i < len(planets); i++ {
		for j := i + 1; j < len(planets); j++ {
			v1, v2 := sortedPair(planets[i], planets[j])
			for _, aspect := range aspectTypes {
				for _, lang := range []string{"en", "vi"} {
					core, realLife, str, chal := getAspectMeaning(v1, v2, aspect, lang)
					tag, err := conn.Exec(ctx, insertStmt,
						lang, v1, v2, strings.ToLower(aspect),
						core, realLife, str, chal,
						v1, v2, aspect,
					)
					if err != nil {
						log.Printf("Failed inserting %s-%s %s (%s): %v", v1, v2, aspect, lang, err)
					} else if tag.RowsAffected() > 0 {
						insertedCount++
					}
				}
			}
		}
	}

	fmt.Printf("Successfully seeded missing aspects! Total new rows added: %d\n", insertedCount)
}
