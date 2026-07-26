import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Page Not Found" };

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center animate-fade-in">
        <div className="text-7xl mb-6 font-display font-bold text-gradient opacity-30">404</div>
        <div className="text-4xl mb-4">✦</div>
        <h1 className="text-2xl font-bold text-slate-200 mb-2">Page not found</h1>
        <p className="text-slate-400 mb-8 max-w-sm mx-auto">
          This celestial body has drifted out of our reach. Let the stars guide you back.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl bg-violet-600 hover:bg-violet-500 px-6 py-3 text-sm font-medium text-white transition-colors shadow-glow"
        >
          Return to home
        </Link>
      </div>
    </div>
  );
}
