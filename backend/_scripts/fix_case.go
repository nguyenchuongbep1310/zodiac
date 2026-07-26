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

	// Delete mock records
	res, err := conn.Exec(ctx, "DELETE FROM placement_interpretations WHERE language = 'vi' AND factor_type = 'aspect' AND core_meaning LIKE 'Sự tương tác giữa %'")
	if err != nil {
		log.Fatalf("Delete failed: %v", err)
	}
	fmt.Printf("Deleted mock records! Rows affected: %d\n", res.RowsAffected())

	// Update aspects to lowercase
	tag, err := conn.Exec(ctx, "UPDATE placement_interpretations SET factor_value_3 = lower(factor_value_3) WHERE factor_type = 'aspect'")
	if err != nil {
		log.Fatalf("Update failed: %v", err)
	}
	fmt.Printf("Updated aspect cases! Rows affected: %d\n", tag.RowsAffected())
}
