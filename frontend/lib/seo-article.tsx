import type { Metadata } from "next";
import { localePath, type Locale } from "@/lib/i18n/locale";
import { absoluteUrl, learnArticles, pageMetadata, siteName } from "@/lib/seo";

export function learnArticleMetadata(key: string, locale: Locale): Metadata {
  const article = learnArticles[key];
  return pageMetadata(locale, article.path, article.seo[locale], { type: "article" });
}

export function ArticleJsonLd({ articleKey, locale }: { articleKey: string; locale: Locale }) {
  const article = learnArticles[articleKey];
  const { title, description } = article.seo[locale];
  const url = absoluteUrl(localePath(locale, article.path));
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: title,
        description,
        url,
        inLanguage: locale,
        publisher: { "@type": "Organization", name: siteName, logo: absoluteUrl("/icon.svg") },
        mainEntityOfPage: url,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: siteName, item: absoluteUrl(localePath(locale, "/")) },
          { "@type": "ListItem", position: 2, name: locale === "vi" ? "Học Chiêm Tinh" : "Learn", item: absoluteUrl(localePath(locale, "/learn")) },
          { "@type": "ListItem", position: 3, name: title, item: url },
        ],
      },
    ],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
