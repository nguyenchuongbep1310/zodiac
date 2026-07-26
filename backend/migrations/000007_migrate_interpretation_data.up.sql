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
