import { cn } from "@/lib/utils";
import { forwardRef, InputHTMLAttributes, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, icon, className, type, id, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={id}
            className="text-sm font-semibold text-[var(--am-ink)]"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--am-muted)]">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={id}
            type={inputType}
            className={cn(
              "w-full rounded-2xl border bg-[var(--am-field)]",
              "px-4 py-2.5 text-sm text-[var(--am-ink)] placeholder:text-[var(--am-muted)]/70",
              "transition-all duration-200 outline-none",
              "focus:ring-4 focus:ring-[var(--am-primary)]/15 focus:border-[var(--am-primary)]",
              error
                ? "border-rose-500/50 focus:ring-rose-500/30"
                : "border-[var(--am-line)]",
              icon && "pl-10",
              isPassword && "pr-10",
              className
            )}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--am-muted)] hover:text-[var(--am-ink)] transition-colors"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          )}
        </div>
        {error && <p className="text-xs text-rose-400">{error}</p>}
        {hint && !error && <p className="text-xs text-[var(--am-muted)]">{hint}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
