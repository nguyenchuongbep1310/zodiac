import { HeroSection } from "@/components/landing/HeroSection";
import { BentoFeatures } from "@/components/landing/BentoFeatures";
import { CapableSection } from "@/components/landing/CapableSection";
import { LearnSection } from "@/components/landing/LearnSection";
import { FaqAccordion } from "@/components/landing/FaqAccordion";
import { ReadYourSkyCTA } from "@/components/landing/ReadYourSkyCTA";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "AstroMind",
  url: "https://astromind.app",
  logo: "https://astromind.app/icon.svg",
  description:
    "Calculate and explore your natal chart. Discover planetary positions, house cusps, and aspects with AstroMind — a modern AI astrology platform.",
};

export default function HomePage() {
  return (
    <main className="relative bg-transparent text-mystic-dark dark:text-warm-cream selection:bg-dusty-rose/30">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HeroSection />
      <BentoFeatures />
      <CapableSection />
      <LearnSection />
      <FaqAccordion />
      <ReadYourSkyCTA />
    </main>
  );
}
