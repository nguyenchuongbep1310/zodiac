import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    // Mirrors the "@/*" path alias in tsconfig.json so component tests can import app code.
    alias: { "@": fileURLToPath(new URL(".", import.meta.url)) },
  },
  test: { exclude: ["node_modules", ".next", "e2e"] },
});
