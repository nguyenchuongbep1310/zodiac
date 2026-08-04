import { FloatingNavbar } from "@/components/landing/FloatingNavbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { BentoFeatures } from "@/components/landing/BentoFeatures";
import { LearnSection } from "@/components/landing/LearnSection";
import { FaqAccordion } from "@/components/landing/FaqAccordion";
import { BrandLogo } from "@/components/ui/BrandLogo";

export default function HomePage() {
  return (
    <main className="relative bg-transparent text-mystic-dark dark:text-warm-cream selection:bg-dusty-rose/30">
      <FloatingNavbar />
      <HeroSection />
      <BentoFeatures />
      <LearnSection />
      <FaqAccordion />
      
      {/* Premium Footer */}
      <footer className="relative bg-[#F7F3ED] dark:bg-[#14110F] border-t border-[#E8DDD0]/50 dark:border-white/5 py-16 px-6 transition-colors overflow-hidden">
        {/* Decorative line */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-[#B5A499]/50 to-transparent" />
        
        <div className="max-w-6xl mx-auto flex flex-col items-center gap-6">
          {/* Logo mark */}
          <BrandLogo size="md" />
          
          <div className="flex items-center gap-6 text-sm text-[#947E70] dark:text-[#A8988C]">
            <a href="#features" className="hover:text-[#5C4033] dark:hover:text-[#E8DDD3] transition-colors">Features</a>
            <span className="opacity-30">•</span>
            <a href="#astrology" className="hover:text-[#5C4033] dark:hover:text-[#E8DDD3] transition-colors">Astrology</a>
            <span className="opacity-30">•</span>
            <a href="#faq" className="hover:text-[#5C4033] dark:hover:text-[#E8DDD3] transition-colors">FAQ</a>
          </div>

          <p className="text-[#A8988C] dark:text-[#7A6E65] text-sm">
            © {new Date().getFullYear()} AstroMind Astrology. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
