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

	rows, err := conn.Query(ctx, "SELECT language, factor_type, factor_value_1, factor_value_2, factor_value_3, count(*) FROM placement_interpretations WHERE factor_type='aspect' GROUP BY 1,2,3,4,lower(factor_value_3) HAVING count(*) > 1")
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()

	for rows.Next() {
		var l, ft, v1, v2, v3 string
		var count int
		rows.Scan(&l, &ft, &v1, &v2, &v3, &count)
		fmt.Printf("Conflict on: %s %s %s %s %s (count: %d)\n", l, ft, v1, v2, v3, count)
	}
}
