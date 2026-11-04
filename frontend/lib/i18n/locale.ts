export const locales = ["en", "vi"] as const;
export type Locale = (typeof locales)[number];

// English is served without a prefix ("/learn"); other locales are prefixed
// ("/vi/learn"). proxy.ts rewrites unprefixed URLs to /en internally.
export const defaultLocale: Locale = "en";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** Path without its locale prefix: "/vi/learn" -> "/learn", "/vi" -> "/". */
export function stripLocale(pathname: string): string {
  for (const locale of locales) {
    if (pathname === `/${locale}`) return "/";
    if (pathname.startsWith(`/${locale}/`)) return pathname.slice(locale.length + 1);
  }
  return pathname || "/";
}

/**
 * Public URL path of `path` in `locale`. Accepts a hash or query suffix:
 * localePath("vi", "/#faq") -> "/vi#faq", localePath("en", "/learn") -> "/learn".
 */
export function localePath(locale: Locale, path: string): string {
  const match = path.match(/^([^?#]*)(.*)$/);
  const base = stripLocale(match?.[1] || "/");
  const suffix = match?.[2] ?? "";
  if (locale === defaultLocale) return `${base}${suffix}`;
  return `${base === "/" ? `/${locale}` : `/${locale}${base}`}${suffix}`;
}
