package main

import (
	"context"
	"fmt"
	"log"

	"github.com/jackc/pgx/v5"
)

func main() {
	ctx := context.Background()
	conn, err := pgx.Connect(ctx, "postgres://zodiac_user:zodiac_pass@localhost:5432/zodiac_db?sslmode=disable")
	if err != nil {
		log.Fatalf("Unable to connect to database: %v\n", err)
	}
	defer conn.Close(ctx)

	// Ensure factor_value_3 is lowercase for aspects
	_, _ = conn.Exec(ctx, "UPDATE placement_interpretations SET factor_value_3 = lower(factor_value_3) WHERE factor_type = 'aspect' AND factor_value_3 IS NOT NULL")

	// Copy 'vi' aspects/placements to 'en'
	q1 := `
		INSERT INTO placement_interpretations (
			language, factor_type, factor_value_1, factor_value_2, factor_value_3,
			core_meaning, real_life, strengths, challenges, relationships, growth_path, key_themes
		)
		SELECT 
			'en', factor_type, factor_value_1, factor_value_2, factor_value_3,
			core_meaning, real_life, strengths, challenges, relationships, growth_path, key_themes
		FROM placement_interpretations
		WHERE language = 'vi'
		ON CONFLICT (language, factor_type, factor_value_1, factor_value_2, factor_value_3) DO NOTHING;
	`
	t1, err := conn.Exec(ctx, q1)
	if err != nil {
		log.Fatalf("Sync vi->en failed: %v", err)
	}
	fmt.Printf("Synced VI -> EN! Rows inserted: %d\n", t1.RowsAffected())

	// Copy 'en' aspects/placements to 'vi'
	q2 := `
		INSERT INTO placement_interpretations (
			language, factor_type, factor_value_1, factor_value_2, factor_value_3,
			core_meaning, real_life, strengths, challenges, relationships, growth_path, key_themes
		)
		SELECT 
			'vi', factor_type, factor_value_1, factor_value_2, factor_value_3,
			core_meaning, real_life, strengths, challenges, relationships, growth_path, key_themes
		FROM placement_interpretations
		WHERE language = 'en'
		ON CONFLICT (language, factor_type, factor_value_1, factor_value_2, factor_value_3) DO NOTHING;
	`
	t2, err := conn.Exec(ctx, q2)
	if err != nil {
		log.Fatalf("Sync en->vi failed: %v", err)
	}
	fmt.Printf("Synced EN -> VI! Rows inserted: %d\n", t2.RowsAffected())
}
