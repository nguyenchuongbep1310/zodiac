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

	// find all rows with capitalized Conjunction, etc.
	rows, _ := conn.Query(ctx, "SELECT id, factor_value_1, factor_value_2, factor_value_3 FROM placement_interpretations WHERE language='vi' AND factor_value_3 IN ('Conjunction', 'Opposition', 'Trine', 'Square', 'Sextile')")
	for rows.Next() {
		var id, v1, v2, v3 string
		rows.Scan(&id, &v1, &v2, &v3)
		
		// Check if the lowercase version exists
		var exists bool
		conn.QueryRow(ctx, "SELECT EXISTS(SELECT 1 FROM placement_interpretations WHERE language='vi' AND factor_type='aspect' AND factor_value_1=$1 AND factor_value_2=$2 AND factor_value_3=lower($3))", v1, v2, v3).Scan(&exists)
		if exists {
			fmt.Printf("CONFLICT DETECTED for %s - %s - %s\n", v1, v2, v3)
			// Delete the conflicting lowercase mock record
			conn.Exec(ctx, "DELETE FROM placement_interpretations WHERE language='vi' AND factor_type='aspect' AND factor_value_1=$1 AND factor_value_2=$2 AND factor_value_3=lower($3)", v1, v2, v3)
		}
	}
	rows.Close()

	tag, err := conn.Exec(ctx, "UPDATE placement_interpretations SET factor_value_3 = lower(factor_value_3) WHERE factor_type = 'aspect' AND factor_value_3 IN ('Conjunction', 'Opposition', 'Trine', 'Square', 'Sextile')")
	if err != nil {
		log.Fatalf("Update failed: %v", err)
	}
	fmt.Printf("Updated aspect cases! Rows affected: %d\n", tag.RowsAffected())
}
