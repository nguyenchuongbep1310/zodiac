import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "The Big Three: Sun, Moon, and Rising",
  description: "Learn what the Sun, Moon, and Rising signs represent in your birth chart.",
};

export default function SunMoonRisingPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-6 animate-fade-in">
      <Link 
        href="/learn"
        className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-violet-400 transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Learn
      </Link>

      <div className="space-y-8">
        <header className="space-y-4">
          <div className="text-xs font-semibold tracking-widest text-violet-400 uppercase">
            Birth Chart · Basics
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-800 dark:text-slate-100 leading-tight">
            The Big Three: Sun, Moon, and Rising Sign
          </h1>
          <p className="text-xl text-slate-500 dark:text-slate-400 font-light leading-relaxed">
            The foundational pillars of your astrological identity.
          </p>
        </header>

        <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-display prose-a:text-violet-500 hover:prose-a:text-violet-400">
          <div className="p-6 rounded-2xl bg-space-900/40 border border-space-700/50 my-8 shadow-glass">
            <h3 className="text-2xl font-bold text-amber-400 mb-4 flex items-center">
              <span className="text-3xl mr-3">☀️</span> The Sun: Your Core Identity
            </h3>
            <p className="text-slate-300">
              [Nội dung giải thích chi tiết về Mặt Trời sẽ được sinh ra từ LLM...]
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-space-900/40 border border-space-700/50 my-8 shadow-glass">
            <h3 className="text-2xl font-bold text-slate-200 mb-4 flex items-center">
              <span className="text-3xl mr-3">🌙</span> The Moon: Your Inner World
            </h3>
            <p className="text-slate-300">
              [Nội dung giải thích chi tiết về Mặt Trăng sẽ được sinh ra từ LLM...]
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-space-900/40 border border-space-700/50 my-8 shadow-glass">
            <h3 className="text-2xl font-bold text-rose-400 mb-4 flex items-center">
              <span className="text-3xl mr-3">✨</span> The Rising Sign (Ascendant): Your Mask
            </h3>
            <p className="text-slate-300">
              [Nội dung giải thích chi tiết về Cung Mọc sẽ được sinh ra từ LLM...]
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
