import { FloatingNavbar } from "@/components/landing/FloatingNavbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { BentoFeatures } from "@/components/landing/BentoFeatures";
import { FaqAccordion } from "@/components/landing/FaqAccordion";

export default function HomePage() {
  return (
    <main className="relative bg-transparent text-mystic-dark dark:text-warm-cream selection:bg-dusty-rose/30">
      <FloatingNavbar />
      <HeroSection />
      <BentoFeatures />
      <FaqAccordion />
      
      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-white/10 py-8 text-center mt-20">
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          © {new Date().getFullYear()} Zodiac Astrology. All rights reserved.
        </p>
      </footer>
    </main>
  );
}
