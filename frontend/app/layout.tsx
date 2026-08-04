import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/lib/providers/QueryProvider";
import { ToastProvider } from "@/components/ui/Toast";
import { ThemeProvider } from "@/components/theme-provider";

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

export const metadata: Metadata = {
  title: {
    template: "%s | AstroMind",
    default: "AstroMind — Natal Chart & AI Astrology Platform",
  },
  description:
    "Calculate and explore your natal chart. Discover planetary positions, house cusps, and aspects with AstroMind — a modern AI astrology platform.",
  keywords: ["astrology", "natal chart", "birth chart", "planets", "horoscope", "zodiac", "astromind"],
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    title: "AstroMind — Natal Chart & AI Astrology Platform",
    description: "Calculate and explore your natal chart with AstroMind.",
    type: "website",
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
      <body className="font-sans bg-[var(--bg-main)] text-[var(--text-main)] min-h-screen">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {/* Editorial glowing orb background */}
          <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-violet-900/15 dark:bg-violet-900/20 blur-[120px] mix-blend-screen" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-amber-900/10 dark:bg-amber-900/15 blur-[120px] mix-blend-screen" />
          </div>
          <QueryProvider>
            <ToastProvider>
              <div className="relative z-10">{children}</div>
            </ToastProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
