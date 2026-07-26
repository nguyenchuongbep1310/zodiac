package main

import (
	"log"
	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
)

func main() {
	db, err := sqlx.Connect("postgres", "postgres://postgres:postgres@localhost:5432/zodiac?sslmode=disable")
	if err != nil {
		log.Fatalln(err)
	}
	defer db.Close()

	q := `INSERT INTO placement_interpretations (
		language, factor_type, factor_value_1, factor_value_2, factor_value_3,
		core_meaning, real_life, strengths, challenges, relationships, growth_path, key_themes
	)
	SELECT 
		language, factor_type, factor_value_1, factor_value_2, factor_value_3,
		content, '', '', '', '', '', keywords
	FROM interpretation_templates
	ON CONFLICT DO NOTHING;`

	_, err = db.Exec(q)
	if err != nil {
		log.Fatalln("Error:", err)
	}
	log.Println("Migration successful")
}
