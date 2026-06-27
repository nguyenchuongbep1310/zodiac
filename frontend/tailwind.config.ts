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
          950: "#04040f",
          900: "#0a0a1a",
          800: "#0f0f2a",
          700: "#151535",
          600: "#1e1e4a",
          500: "#2a2a5e",
        },
        violet: {
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
          700: "#6d28d9",
        },
        amber: {
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
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
        display: ["var(--font-cinzel)", "Georgia", "serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "space-gradient":
          "radial-gradient(ellipse at top, #1e1e4a 0%, #0a0a1a 60%, #04040f 100%)",
        "violet-gradient":
          "linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #7c3aed 100%)",
        "gold-gradient":
          "linear-gradient(135deg, #f59e0b 0%, #fbbf24 50%, #f59e0b 100%)",
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
