import type { Metadata } from "next";
import { HeroSection } from "@/components/landing/HeroSection";
import { ZodiacMarquee } from "@/components/landing/ZodiacMarquee";
import { BentoFeatures } from "@/components/landing/BentoFeatures";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { CapableSection } from "@/components/landing/CapableSection";
import { LearnSection } from "@/components/landing/LearnSection";
import { FaqAccordion } from "@/components/landing/FaqAccordion";
import { ReadYourSkyCTA } from "@/components/landing/ReadYourSkyCTA";
import { en, vi } from "@/lib/i18n/dictionaries";
import { isLocale, localePath, type Locale } from "@/lib/i18n/locale";
import { absoluteUrl, pageMetadata, siteDescriptionByLocale, siteName, siteTitle } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : "en";
  return pageMetadata(
    locale,
    "/",
    { title: siteTitle[locale], description: siteDescriptionByLocale[locale] },
    { absoluteTitle: true }
  );
}

const faqKeys = ["q1", "q2", "q3", "q4"] as const;

function buildJsonLd(locale: Locale) {
  const dict = locale === "vi" ? vi : en;
  const home = absoluteUrl(localePath(locale, "/"));
  return {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": absoluteUrl("/#organization"),
      name: siteName,
      url: absoluteUrl("/"),
      logo: absoluteUrl("/icon.svg"),
    },
    {
      "@type": "WebSite",
      "@id": absoluteUrl("/#website"),
      name: siteName,
      url: absoluteUrl("/"),
      inLanguage: ["en", "vi"],
      publisher: { "@id": absoluteUrl("/#organization") },
    },
    {
      "@type": "WebApplication",
      name: `${siteName} Birth Chart Calculator`,
      url: home,
      inLanguage: locale,
      description: siteDescriptionByLocale[locale],
      applicationCategory: "LifestyleApplication",
      operatingSystem: "Any",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
    {
      "@type": "FAQPage",
      inLanguage: locale,
      mainEntity: faqKeys.map((k) => ({
        "@type": "Question",
        name: dict[`home.faq.${k}`],
        acceptedAnswer: { "@type": "Answer", text: dict[`home.faq.a${k.slice(1)}`] },
      })),
    },
  ],
  };
}

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  const jsonLd = buildJsonLd(isLocale(lang) ? lang : "en");

  return (
    <main className="am-page relative selection:bg-[var(--am-primary)]/25">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HeroSection />
      <ZodiacMarquee />
      <BentoFeatures />
      <HowItWorks />
      <CapableSection />
      <LearnSection />
      <FaqAccordion />
      <ReadYourSkyCTA />
    </main>
  );
}
