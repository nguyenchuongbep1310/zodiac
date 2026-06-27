-- Revert auto-generated interpretations

DELETE FROM interpretation_templates WHERE factor_value_1 = 'Sun';
DELETE FROM interpretation_templates WHERE factor_value_1 = 'Moon';
DELETE FROM interpretation_templates WHERE factor_value_1 = 'Mercury';
DELETE FROM interpretation_templates WHERE factor_value_1 = 'Venus';
DELETE FROM interpretation_templates WHERE factor_value_1 = 'Mars';
DELETE FROM interpretation_templates WHERE factor_value_1 = 'Jupiter';
DELETE FROM interpretation_templates WHERE factor_value_1 = 'Saturn';
DELETE FROM interpretation_templates WHERE factor_value_1 = 'Uranus';
DELETE FROM interpretation_templates WHERE factor_value_1 = 'Neptune';
DELETE FROM interpretation_templates WHERE factor_value_1 = 'Pluto';
DELETE FROM interpretation_templates WHERE factor_value_1 = 'North Node';
DELETE FROM interpretation_templates WHERE factor_value_1 = 'Chiron';
