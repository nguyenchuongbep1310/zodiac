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

	_, err = db.Exec("UPDATE schema_migrations SET version = 6, dirty = false")
	if err != nil {
		log.Fatalln("Error fixing schema:", err)
	}
	log.Println("Schema version forced to 6 successfully")
}
