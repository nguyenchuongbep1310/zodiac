import type { Metadata } from "next";
import { isLocale, type Locale } from "@/lib/i18n/locale";
import { pageMetadata, pageSeo } from "@/lib/seo";
import { SynastryClient } from "./_components/SynastryClient";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : "en";
  return pageMetadata(locale, "/synastry", pageSeo["/synastry"][locale]);
}

export default function SynastryPage() {
  return <SynastryClient />;
}
