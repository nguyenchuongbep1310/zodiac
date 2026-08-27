import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/lib/providers/QueryProvider";
import { ToastProvider } from "@/components/ui/Toast";
import { ThemeProvider } from "@/components/theme-provider";
import { FloatingNavbar } from "@/components/landing/FloatingNavbar";
import { FooterEnhanced } from "@/components/landing/FooterEnhanced";
import { HtmlLangSync } from "@/components/html-lang-sync";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://astromind.app";
const title = "AstroMind — Natal Chart & AI Astrology Platform";
const description =
  "Calculate and explore your natal chart. Discover planetary positions, house cusps, and aspects with AstroMind — a modern AI astrology platform.";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Lets the background paint under the iPhone notch/Dynamic Island and
  // home-indicator area instead of leaving a plain bar there; safe-area
  // insets in globals.css/components keep actual content clear of it.
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FDFDFD" },
    { media: "(prefers-color-scheme: dark)", color: "#2a2426" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    template: "%s | AstroMind",
    default: title,
  },
  description,
  keywords: ["astrology", "natal chart", "birth chart", "planets", "horoscope", "zodiac", "astromind"],
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title,
    description,
    type: "website",
    url: siteUrl,
    siteName: "AstroMind",
    locale: "en_US",
    images: [
      {
        url: "/icon.svg",
        width: 512,
        height: 512,
        alt: "AstroMind",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/icon.svg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`} suppressHydrationWarning>
      <body className="font-sans bg-[var(--bg-main)] text-[var(--text-main)] min-h-[100dvh]">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {/* Editorial glowing orb background */}
          <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-violet-900/15 dark:bg-violet-900/20 blur-[120px] mix-blend-screen" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-amber-900/10 dark:bg-amber-900/15 blur-[120px] mix-blend-screen" />
          </div>
          <HtmlLangSync />
          <QueryProvider>
            <ToastProvider>
              <div className="relative z-10 flex flex-col min-h-[100dvh]">
                <FloatingNavbar />
                <div className="flex-1">{children}</div>
                <FooterEnhanced />
              </div>
            </ToastProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
