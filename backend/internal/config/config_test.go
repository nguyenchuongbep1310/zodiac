package config

import (
	"os"
	"path/filepath"
	"strings"
	"testing"
)

func writeCfg(t *testing.T, body string) string {
	t.Helper()
	dir := t.TempDir()
	if err := os.WriteFile(filepath.Join(dir, "config.yaml"), []byte(body), 0o600); err != nil {
		t.Fatal(err)
	}
	return dir
}

const base = `
app: {environment: %ENV%}
database: {dsn: "postgres://u:p@h/db"}
jwt: {secret: "%SECRET%"}
`

func cfgText(env, secret string) string {
	return strings.NewReplacer("%ENV%", env, "%SECRET%", secret).Replace(base)
}

func TestLoad_SecurityDefaultsAndEnvOverride(t *testing.T) {
	dir := writeCfg(t, cfgText("development", "change-me-to-a-32-char-secret-key!!"))
	t.Setenv("ZODIAC_SECURITY_ALLOWED_ORIGINS", "https://a.example,https://b.example")
	cfg, err := Load(dir)
	if err != nil {
		t.Fatal(err)
	}
	if got := cfg.Security.AllowedOrigins; len(got) != 2 || got[0] != "https://a.example" || got[1] != "https://b.example" {
		t.Fatalf("allowed origins = %v", got)
	}
	if cfg.Security.MaxBodyBytes != 64*1024 || cfg.Security.CalculateRateLimitPerMinute != 10 {
		t.Fatalf("unexpected defaults: %+v", cfg.Security)
	}
}

func TestLoad_RejectsPlaceholderSecretOutsideDevelopment(t *testing.T) {
	dir := writeCfg(t, cfgText("production", "change-me-to-a-32-char-secret-key!!"))
	if _, err := Load(dir); err == nil {
		t.Fatal("expected placeholder JWT secret to be rejected in production")
	}
}

func TestLoad_RejectsWildcardOriginInProduction(t *testing.T) {
	dir := writeCfg(t, cfgText("production", "a-real-secret-that-is-long-enough-1234"))
	t.Setenv("ZODIAC_SECURITY_ALLOWED_ORIGINS", "*")
	if _, err := Load(dir); err == nil {
		t.Fatal("expected wildcard CORS origin to be rejected in production")
	}
}
