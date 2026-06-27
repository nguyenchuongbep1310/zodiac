import type { Metadata } from "next";
import { Inter, Cinzel } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/lib/providers/QueryProvider";
import { AuthProvider } from "@/lib/providers/AuthProvider";
import { ToastProvider } from "@/components/ui/Toast";
import { StarfieldBackground } from "@/components/layout/StarfieldBackground";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  display: "swap",
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Zodiac",
    default: "Zodiac — Natal Chart & Astrology Platform",
  },
  description:
    "Calculate and explore your natal chart. Discover planetary positions, house cusps, and aspects with Zodiac — a modern astrology platform.",
  keywords: ["astrology", "natal chart", "birth chart", "planets", "horoscope", "zodiac"],
  openGraph: {
    title: "Zodiac — Natal Chart & Astrology Platform",
    description: "Calculate and explore your natal chart with Zodiac.",
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
    <html lang="en" className={`${inter.variable} ${cinzel.variable}`}>
      <body className="font-sans">
        <StarfieldBackground />
        <QueryProvider>
          <AuthProvider>
            <ToastProvider>
              <div className="relative z-10">{children}</div>
            </ToastProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
