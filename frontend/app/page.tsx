import { FloatingNavbar } from "@/components/landing/FloatingNavbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { BentoFeatures } from "@/components/landing/BentoFeatures";
import { CapableSection } from "@/components/landing/CapableSection";
import { LearnSection } from "@/components/landing/LearnSection";
import { FaqAccordion } from "@/components/landing/FaqAccordion";
import { ReadYourSkyCTA } from "@/components/landing/ReadYourSkyCTA";
import { FooterEnhanced } from "@/components/landing/FooterEnhanced";

export default function HomePage() {
  return (
    <main className="relative bg-transparent text-mystic-dark dark:text-warm-cream selection:bg-dusty-rose/30">
      <FloatingNavbar />
      <HeroSection />
      <BentoFeatures />
      <CapableSection />
      <LearnSection />
      <FaqAccordion />
      <ReadYourSkyCTA />
      <FooterEnhanced />
    </main>
  );
}
