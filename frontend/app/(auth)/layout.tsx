import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | Zodiac",
    default: "Zodiac",
  },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16">
      {/* Decorative glowing orbs */}
      <div className="pointer-events-none fixed top-1/4 left-1/4 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/10 blur-3xl" />
      <div className="pointer-events-none fixed bottom-1/4 right-1/4 h-72 w-72 translate-x-1/2 translate-y-1/2 rounded-full bg-amber-500/8 blur-3xl" />

      <div className="w-full max-w-md animate-slide-up">
        {/* Brand mark */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-purple-800 shadow-glow-lg">
            <span className="text-2xl">✦</span>
          </div>
          <div className="text-center">
            <h1 className="font-display text-2xl font-bold text-gradient tracking-widest">
              ZODIAC
            </h1>
            <p className="text-xs text-slate-500 mt-1 tracking-wider uppercase">
              Astrology Platform
            </p>
          </div>
        </div>

        {/* Auth card */}
        <div className="rounded-3xl border border-space-600/50 bg-space-900/80 backdrop-blur-md shadow-glass p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
