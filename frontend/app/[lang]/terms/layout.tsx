import type { Metadata } from "next";
import { isLocale, type Locale } from "@/lib/i18n/locale";
import { pageMetadata, pageSeo } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : "en";
  return pageMetadata(locale, "/terms", pageSeo["/terms"][locale]);
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
