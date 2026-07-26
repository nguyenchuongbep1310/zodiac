package main

import (
	"log"
	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
)

func main() {
	db, err := sqlx.Connect("postgres", "postgres://zodiac_user:zodiac_pass@localhost:5432/zodiac_db?sslmode=disable")
	if err != nil {
		log.Fatalln(err)
	}
	defer db.Close()

	var count int
	err = db.Get(&count, "SELECT count(*) FROM placement_interpretations")
	if err != nil {
		log.Fatalln(err)
	}
	log.Printf("placement_interpretations count: %d", count)

	var old_count int
	err = db.Get(&old_count, "SELECT count(*) FROM interpretation_templates")
	if err != nil {
		log.Fatalln(err)
	}
	log.Printf("interpretation_templates count: %d", old_count)
}
