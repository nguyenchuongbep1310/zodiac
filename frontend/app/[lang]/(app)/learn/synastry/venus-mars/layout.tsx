import type { Metadata } from "next";
import { isLocale } from "@/lib/i18n/locale";
import { ArticleJsonLd, learnArticleMetadata } from "@/lib/seo-article";

const KEY = "venus-mars";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return learnArticleMetadata(KEY, isLocale(lang) ? lang : "en");
}

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  return (
    <>
      <ArticleJsonLd articleKey={KEY} locale={isLocale(lang) ? lang : "en"} />
      {children}
    </>
  );
}
