/** WCAG relative luminance of a `#rrggbb` colour. */
function luminance(hex: string): number {
  const m = /^#([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) throw new Error(`expected #rrggbb, got "${hex}"`);
  const [r, g, b] = [0, 2, 4].map((i) => {
    const c = parseInt(m[1].slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG contrast ratio between two `#rrggbb` colours (1 to 21). */
export function contrastRatio(fg: string, bg: string): number {
  const [hi, lo] = [luminance(fg), luminance(bg)].sort((a, b) => b - a);
  return (hi + 0.05) / (lo + 0.05);
}

/**
 * Plain `--am-*: value;` declarations for a theme. Light comes from the `:root`
 * block that defines `--am-bg`, dark from the `.dark` block that defines it.
 */
export function readTokens(css: string, theme: "light" | "dark"): Record<string, string> {
  const selector = theme === "light" ? ":root" : "\\.dark";
  const blocks = [...css.matchAll(new RegExp(`(?:^|\\n)\\s*${selector}\\s*\\{([^}]*)\\}`, "g"))];
  const block = blocks.find((m) => m[1].includes("--am-bg"));
  if (!block) throw new Error(`no ${theme} block defines --am-bg`);
  const tokens: Record<string, string> = {};
  for (const [, name, value] of block[1].matchAll(/(--am-[\w-]+)\s*:\s*([^;]+);/g)) {
    tokens[name] = value.trim();
  }
  return tokens;
}
