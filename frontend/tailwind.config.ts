import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        space: {
          950: "var(--color-space-950)",
          900: "var(--color-space-900)",
          800: "var(--color-space-800)",
          700: "var(--color-space-700)",
          600: "var(--color-space-600)",
          500: "var(--color-space-500)",
        },
        violet: {
          300: "var(--color-violet-300)",
          400: "var(--color-violet-400)",
          500: "var(--color-violet-500)",
          600: "var(--color-violet-600)",
          700: "var(--color-violet-700)",
        },
        amber: {
          300: "var(--color-amber-300)",
          400: "var(--color-amber-400)",
          500: "var(--color-amber-500)",
          600: "var(--color-amber-600)",
        },
        slate: {
          200: "var(--color-slate-200)",
          300: "var(--color-slate-300)",
          400: "var(--color-slate-400)",
          500: "var(--color-slate-500)",
        },
        rose: {
          400: "#fb7185",
          500: "#f43f5e",
        },
        emerald: {
          400: "#34d399",
          500: "#10b981",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-playfair)", "Georgia", "serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "space-gradient": "var(--bg-grad)",
        "violet-gradient":
          "linear-gradient(135deg, var(--color-violet-500) 0%, var(--color-violet-400) 50%, var(--color-violet-500) 100%)",
        "gold-gradient":
          "linear-gradient(135deg, var(--color-amber-500) 0%, var(--color-amber-400) 50%, var(--color-amber-500) 100%)",
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
        "slide-in-right": "slideInRight 0.3s ease-out",
        "spin-slow": "spin 20s linear infinite",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        twinkle: "twinkle 3s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(124, 58, 237, 0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(124, 58, 237, 0.6)" },
        },
        twinkle: {
          "0%, 100%": { opacity: "0.2", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.2)" },
        },
      },
      boxShadow: {
        glow: "0 0 30px rgba(124, 58, 237, 0.25)",
        "glow-amber": "0 0 30px rgba(245, 158, 11, 0.25)",
        "glow-lg": "0 0 60px rgba(124, 58, 237, 0.35)",
        glass: "0 8px 32px rgba(0, 0, 0, 0.4)",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};

export default config;
