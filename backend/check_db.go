package main

import (
	"fmt"
	"log"
	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
)

type Row struct {
	ID           string `db:"id"`
	Language     string `db:"language"`
	FactorType   string `db:"factor_type"`
	FactorValue1 string `db:"factor_value_1"`
	FactorValue2 string `db:"factor_value_2"`
	FactorValue3 string `db:"factor_value_3"`
}

func main() {
	db, err := sqlx.Connect("postgres", "postgres://zodiac_user:zodiac_pass@localhost:5432/zodiac_db?sslmode=disable")
	if err != nil {
		log.Fatalln(err)
	}
	defer db.Close()

	var rows []Row
	err = db.Select(&rows, "SELECT id, language, factor_type, factor_value_1, factor_value_2, COALESCE(factor_value_3, 'NULL_VAL') as factor_value_3 FROM placement_interpretations WHERE factor_type = 'house_in_sign' LIMIT 10")
	if err != nil {
		log.Fatalln(err)
	}
	fmt.Printf("Found %d house_in_sign rows:\n", len(rows))
	for _, r := range rows {
		fmt.Printf("Lang: %q, Type: %q, V1: %q, V2: %q, V3: %q\n", r.Language, r.FactorType, r.FactorValue1, r.FactorValue2, r.FactorValue3)
	}
}
