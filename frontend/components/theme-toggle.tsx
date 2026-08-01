"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="w-10 h-10" />; // Placeholder to prevent layout shift
  }

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="relative flex items-center justify-center p-2.5 rounded-full bg-[#F3EDE4] dark:bg-[#27211C] border border-[#E3D8CB] dark:border-white/10 hover:bg-[#EDE5D8] dark:hover:bg-[#332B24] transition-all duration-300 w-10 h-10 text-[#5C4033] dark:text-[#E8DDD3] shadow-sm hover:shadow-md"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className="h-4.5 w-4.5" />
      ) : (
        <Moon className="h-4.5 w-4.5" />
      )}
    </button>
  );
}
