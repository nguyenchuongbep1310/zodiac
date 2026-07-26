import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { forwardRef, ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "gold";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  isLoading?: boolean;
  fullWidth?: boolean;
}

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-violet-600 hover:bg-violet-500 text-white border border-violet-500/50 shadow-glass dark:shadow-glow hover:shadow-glass dark:hover:shadow-glow-lg",
  secondary:
    "bg-black/5 dark:bg-space-700 hover:bg-black/10 dark:hover:bg-space-600 text-slate-800 dark:text-slate-200 border border-black/10 dark:border-space-500/50",
  ghost:
    "bg-transparent hover:bg-black/5 dark:hover:bg-space-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-transparent hover:border-black/10 dark:hover:border-space-500/50",
  danger:
    "bg-rose-500/10 dark:bg-rose-500/20 hover:bg-rose-500/20 dark:hover:bg-rose-500/30 text-rose-600 dark:text-rose-400 border border-rose-500/30",
  gold:
    "bg-amber-500/10 dark:bg-amber-500/20 hover:bg-amber-500/20 dark:hover:bg-amber-500/30 text-amber-600 dark:text-amber-400 border border-amber-500/30 shadow-glow-amber",
};

const sizeStyles: Record<Size, string> = {
  sm: "px-3 py-1.5 text-xs rounded-lg",
  md: "px-4 py-2.5 text-sm rounded-xl",
  lg: "px-6 py-3 text-base rounded-xl",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      fullWidth = false,
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-medium",
          "transition-all duration-200 ease-out",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/70 focus-visible:ring-offset-2 focus-visible:ring-offset-space-900",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
          "active:scale-[0.98] hover:scale-[1.02]",
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && "w-full",
          className
        )}
        {...props}
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
