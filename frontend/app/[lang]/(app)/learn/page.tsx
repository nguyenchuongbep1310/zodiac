import type { Metadata } from "next";
import { isLocale, type Locale } from "@/lib/i18n/locale";
import { pageMetadata, pageSeo } from "@/lib/seo";
import { LearnPageContent } from "./LearnPageContent";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : "en";
  return pageMetadata(locale, "/learn", pageSeo["/learn"][locale]);
}

export default function LearnPage() {
  return <LearnPageContent />;
}
