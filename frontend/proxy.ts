import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, locales } from "@/lib/i18n/locale";

// English lives at unprefixed URLs ("/learn") while the app tree is app/[lang]/,
// so unprefixed requests are rewritten to /en internally. A literal /en prefix
// is redirected away so each page has exactly one English URL.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === `/${defaultLocale}` || pathname.startsWith(`/${defaultLocale}/`)) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(defaultLocale.length + 1) || "/";
    return NextResponse.redirect(url, 308);
  }

  const hasLocale = locales.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`));
  if (hasLocale) return;

  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: [
    // Everything except Next internals, the API proxy, root metadata files and
    // static assets (anything with a file extension).
    "/((?!_next|api|robots\\.txt|sitemap\\.xml|manifest\\.webmanifest|icon\\.svg|favicon\\.ico|.*\\.[a-zA-Z0-9]+$).*)",
  ],
};
