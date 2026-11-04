import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

// Global Constraint: --am-sunset is decoration and large text only (3.95-4.10:1 on paper,
// under AA for body text). Text colour classes must use --am-primary (oxblood, 7.4:1) instead.
function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (name === "node_modules" || name === ".next" || name === "__tests__") return [];
    return statSync(path).isDirectory() ? sourceFiles(path) : path.endsWith(".tsx") ? [path] : [];
  });
}

describe("colour constraints", () => {
  it("no component sets text colour to --am-sunset", () => {
    const root = join(__dirname, "../..");
    const offenders = [...sourceFiles(join(root, "app")), ...sourceFiles(join(root, "components"))].filter((f) =>
      readFileSync(f, "utf8").includes("text-[var(--am-sunset)]"),
    );
    expect(offenders.map((f) => f.replace(root, ""))).toEqual([]);
  });
});
