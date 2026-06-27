import { cn } from "@/lib/utils";

type BadgeVariant = "violet" | "amber" | "emerald" | "rose" | "slate";

interface BadgeProps {
  variant?: BadgeVariant;
  className?: string;
  children: React.ReactNode;
}

const variantStyles: Record<BadgeVariant, string> = {
  violet: "bg-violet-500/20 text-violet-300 border-violet-500/30",
  amber:  "bg-amber-500/20 text-amber-300 border-amber-500/30",
  emerald:"bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  rose:   "bg-rose-500/20 text-rose-300 border-rose-500/30",
  slate:  "bg-slate-500/20 text-slate-300 border-slate-500/30",
};

export function Badge({ variant = "slate", className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
