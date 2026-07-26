"use client";

import { motion, Variants } from "framer-motion";
import { Star, Map, Compass, BookOpen, Orbit, Sparkles } from "lucide-react";

export function BentoFeatures() {
  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 60, damping: 15 } },
  };

  return (
    <section id="features" className="py-24 px-6 relative">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl text-mystic-dark dark:text-warm-cream mb-4">
            A New Lens on <span className="italic text-dusty-rose">Reality</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Our platform combines cutting-edge astronomical algorithms with deep astrological wisdom to provide you with insights that resonate.
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[250px]"
        >
          {/* Large Card 1 */}
          <motion.div
            variants={item}
            className="md:col-span-2 lg:col-span-2 row-span-2 bg-teal-muted rounded-3xl p-8 flex flex-col relative overflow-hidden group shadow-lg"
          >
            <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:scale-110 group-hover:opacity-30 transition-all duration-700">
              <Orbit className="w-48 h-48 text-warm-cream" />
            </div>
            <div className="relative z-10 flex-1 flex flex-col justify-end">
              <div className="bg-white/10 backdrop-blur-md w-12 h-12 rounded-2xl flex items-center justify-center mb-6 border border-white/20">
                <Compass className="text-warm-cream w-6 h-6" />
              </div>
              <h3 className="font-display text-3xl text-warm-cream mb-3">Precision Astrology</h3>
              <p className="text-warm-cream/80 text-lg leading-relaxed max-w-md">
                We use the Swiss Ephemeris to calculate planetary positions with micro-degree accuracy, ensuring your natal chart is fundamentally sound.
              </p>
            </div>
          </motion.div>

          {/* Medium Card 1 */}
          <motion.div
            variants={item}
            className="md:col-span-1 lg:col-span-2 bg-dusty-rose rounded-3xl p-8 flex flex-col justify-between shadow-lg group"
          >
            <div className="bg-white/10 backdrop-blur-md w-10 h-10 rounded-xl flex items-center justify-center border border-white/20">
              <BookOpen className="text-warm-cream w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display text-2xl text-warm-cream mb-2">Deep Interpretations</h3>
              <p className="text-warm-cream/90 text-sm">
                Generated insights that go beyond generic horoscopes, diving deep into psychological astrology and soul evolution.
              </p>
            </div>
          </motion.div>

          {/* Small Card 1 */}
          <motion.div
            variants={item}
            className="md:col-span-1 lg:col-span-1 bg-taupe rounded-3xl p-6 flex flex-col justify-between shadow-lg"
          >
            <Star className="text-warm-cream w-6 h-6 mb-4" />
            <div>
              <h3 className="font-display text-xl text-warm-cream mb-2">Beautiful UX</h3>
              <p className="text-warm-cream/80 text-sm">Fluid animations and editorial design principles.</p>
            </div>
          </motion.div>

          {/* Small Card 2 */}
          <motion.div
            variants={item}
            className="md:col-span-1 lg:col-span-1 bg-mystic-dark border border-white/10 rounded-3xl p-6 flex flex-col justify-between shadow-lg"
          >
            <Map className="text-dusty-rose w-6 h-6 mb-4" />
            <div>
              <h3 className="font-display text-xl text-warm-cream mb-2">Cosmic Map</h3>
              <p className="text-slate-400 text-sm">Explore interactive aspects and houses.</p>
            </div>
          </motion.div>

          {/* Long Card */}
          <motion.div
            variants={item}
            className="md:col-span-3 lg:col-span-4 bg-warm-cream dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between shadow-lg relative overflow-hidden"
          >
            <div className="relative z-10 max-w-xl mb-6 md:mb-0">
              <h3 className="font-display text-2xl md:text-3xl text-mystic-dark dark:text-warm-cream mb-3">
                Ready to explore the universe within?
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                Create unlimited profiles for friends and family and explore the dynamic energies between celestial bodies.
              </p>
            </div>
            <Sparkles className="w-32 h-32 text-dusty-rose/20 absolute -right-4 -top-4 pointer-events-none" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
