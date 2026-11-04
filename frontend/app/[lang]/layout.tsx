import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Be_Vietnam_Pro } from "next/font/google";
import { notFound } from "next/navigation";
import "../globals.css";
import { QueryProvider } from "@/lib/providers/QueryProvider";
import { ToastProvider } from "@/components/ui/Toast";
import { ThemeProvider } from "@/components/theme-provider";
import { FloatingNavbar } from "@/components/landing/FloatingNavbar";
import { FooterEnhanced } from "@/components/landing/FooterEnhanced";
import { LocaleProvider } from "@/lib/hooks/useI18n";
import { isLocale, locales, type Locale } from "@/lib/i18n/locale";
import { ogLocale, siteDescriptionByLocale, siteKeywords, siteName, siteTitle, siteUrl } from "@/lib/seo";

const heading = Bricolage_Grotesque({
  subsets: ["latin", "latin-ext", "vietnamese"],
  variable: "--font-heading",
  display: "swap",
});

const body = Be_Vietnam_Pro({
  subsets: ["latin", "latin-ext", "vietnamese"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Lets the background paint under the iPhone notch/Dynamic Island and
  // home-indicator area instead of leaving a plain bar there; safe-area
  // insets in globals.css/components keep actual content clear of it.
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f5ff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f0c1f" },
  ],
};

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

// Pages set their own canonical/hreflang. A canonical on the root layout would
// be inherited by every route that doesn't, pointing all of them at the homepage.
export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : "en";
  const title = siteTitle[locale];
  const description = siteDescriptionByLocale[locale];

  return {
    metadataBase: new URL(siteUrl),
    applicationName: siteName,
    title: {
      template: `%s | ${siteName}`,
      default: title,
    },
    description,
    keywords: siteKeywords[locale],
    category: "lifestyle",
    icons: {
      icon: "/icon.svg",
      shortcut: "/icon.svg",
      apple: "/icon.svg",
    },
    openGraph: {
      title,
      description,
      type: "website",
      siteName,
      locale: ogLocale[locale],
      alternateLocale: locales.filter((l) => l !== locale).map((l) => ogLocale[l]),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    formatDetection: {
      telephone: false,
    },
  };
}

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  return (
    <html lang={lang} className={`${heading.variable} ${body.variable}`} suppressHydrationWarning>
      <body className="font-sans bg-[var(--bg-main)] text-[var(--text-main)] min-h-[100dvh]">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <LocaleProvider locale={lang}>
            <QueryProvider>
              <ToastProvider>
                <div className="relative z-10 flex flex-col min-h-[100dvh]">
                  <FloatingNavbar />
                  <div className="flex-1">{children}</div>
                  <FooterEnhanced />
                </div>
              </ToastProvider>
            </QueryProvider>
          </LocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
