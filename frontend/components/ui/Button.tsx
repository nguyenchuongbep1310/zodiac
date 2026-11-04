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
    "bg-[var(--am-primary)] text-[var(--am-primary-ink)] border-2 border-[var(--am-edge)] shadow-[var(--am-shadow)] hover:brightness-110",
  secondary:
    "bg-[var(--am-surface)] text-[var(--am-ink)] border-2 border-[var(--am-edge)] shadow-[var(--am-shadow-sm)] hover:bg-[var(--am-field)]",
  ghost:
    "bg-transparent text-[var(--am-muted)] hover:text-[var(--am-ink)] border-2 border-transparent hover:border-[var(--am-edge)]",
  danger:
    "bg-[var(--am-peach)] text-[var(--am-ink)] border-2 border-[var(--am-sunset)] shadow-[var(--am-shadow-sm)] hover:brightness-105",
  gold:
    "bg-[var(--am-gold)] text-[#1c1410] border-2 border-[var(--am-edge)] shadow-[var(--am-shadow)] hover:brightness-105",
};

const sizeStyles: Record<Size, string> = {
  sm: "px-3 py-1.5 text-xs rounded-[var(--am-radius)]",
  md: "px-4 py-2.5 text-sm rounded-[var(--am-radius)]",
  lg: "px-6 py-3 text-base rounded-[var(--am-radius)]",
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
          "inline-flex items-center justify-center gap-2 font-semibold",
          "transition-colors duration-100",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
          // Pressing sinks the button into its own shadow.
          "active:[transform:translate(3px,3px)] active:shadow-[1px_1px_0_var(--am-edge)]",
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
