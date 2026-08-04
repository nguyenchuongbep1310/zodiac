package main

import (
	"fmt"
	"os"
	"regexp"
	"strings"
)

// Helper to escape single quotes for SQL
func escapeSQL(s string) string {
	return strings.ReplaceAll(s, "'", "''")
}

func main() {
	out, err := os.Create("seed_complete_production.sql")
	if err != nil {
		panic(err)
	}
	defer out.Close()

	out.WriteString("-- COMPLETE PRODUCTION SEED FILE FOR PLACEMENT_INTERPRETATIONS\n\n")

	// 1. Sync any existing data from interpretation_templates
	out.WriteString(`-- Step 1: Copy existing interpretation_templates data
INSERT INTO placement_interpretations (
    language, factor_type, factor_value_1, factor_value_2, factor_value_3,
    core_meaning, real_life, strengths, challenges, relationships, growth_path, key_themes
)
SELECT 
    t.language, t.factor_type, t.factor_value_1, t.factor_value_2, t.factor_value_3,
    t.content, '', '', '', '', '', t.keywords
FROM interpretation_templates t
WHERE NOT EXISTS (
    SELECT 1 FROM placement_interpretations p
    WHERE p.language = t.language
      AND p.factor_type = t.factor_type
      AND p.factor_value_1 = t.factor_value_1
      AND p.factor_value_2 = t.factor_value_2
      AND (
          p.factor_value_3 = t.factor_value_3 
          OR (p.factor_value_3 IS NULL AND t.factor_value_3 IS NULL)
      )
);

`)

	// 2. Read house data from the 4 house files
	houseFiles := []string{
		"backend/_scripts/insert_houses.go",
		"backend/_scripts/insert_houses_456.go",
		"backend/_scripts/insert_houses_789.go",
		"backend/_scripts/insert_houses_101112.go",
	}

	tupleRegex := regexp.MustCompile(`\('([^']*)',\s*'([^']*)',\s*'([^']*)',\s*'([^']*)',\s*'([^']*)',\s*'([^']*)',\s*'([^']*)',\s*'([^']*)'\)`)

	out.WriteString("-- Step 2: Insert House-in-Sign Interpretations\n")
	for _, file := range houseFiles {
		content, err := os.ReadFile(file)
		if err != nil {
			fmt.Printf("Warning: failed to read %s: %v\n", file, err)
			continue
		}

		matches := tupleRegex.FindAllStringSubmatch(string(content), -1)
		for _, m := range matches {
			houseName := m[1] // e.g. "House 1"
			houseNum := strings.TrimPrefix(houseName, "House ")
			sign := m[2]
			core := escapeSQL(m[3])
			realLife := escapeSQL(m[4])
			str := escapeSQL(m[5])
			chal := escapeSQL(m[6])
			rel := escapeSQL(m[7])
			growth := escapeSQL(m[8])

			// English entry
			sqlEN := fmt.Sprintf(
				"INSERT INTO placement_interpretations (language, factor_type, factor_value_1, factor_value_2, factor_value_3, core_meaning, real_life, strengths, challenges, relationships, growth_path, key_themes) VALUES ('en', 'house_in_sign', '%s', '%s', '', '%s', '%s', '%s', '%s', '%s', '%s', ARRAY['%s', '%s']) ON CONFLICT (language, factor_type, factor_value_1, factor_value_2, factor_value_3) DO NOTHING;\n",
				houseNum, sign, core, realLife, str, chal, rel, growth, houseName, sign,
			)
			out.WriteString(sqlEN)
		}
	}

	// 3. Read generated aspect full seed
	aspectSql, err := os.ReadFile("seed_aspects_full.sql")
	if err == nil {
		out.WriteString("\n-- Step 3: Insert All Aspect Combinations\n")
		out.Write(aspectSql)
	}

	fmt.Println("Successfully generated seed_complete_production.sql")
}
