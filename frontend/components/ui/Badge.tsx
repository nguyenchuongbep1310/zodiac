import { cn } from "@/lib/utils";

type BadgeVariant = "violet" | "amber" | "emerald" | "rose" | "slate";

interface BadgeProps {
  variant?: BadgeVariant;
  className?: string;
  children: React.ReactNode;
}

const variantStyles: Record<BadgeVariant, string> = {
  violet: "bg-[var(--am-lilac)] text-[var(--am-ink)] border-[var(--am-edge)]",
  amber:  "bg-[var(--am-gold)] text-[#1c1410] border-[var(--am-edge)]",
  emerald:"bg-[var(--am-mint)] text-[var(--am-ink)] border-[var(--am-edge)]",
  rose:   "bg-[var(--am-peach)] text-[var(--am-ink)] border-[var(--am-edge)]",
  slate:  "bg-[var(--am-field)] text-[var(--am-muted)] border-[var(--am-line)]",
};

export function Badge({ variant = "slate", className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        "mono-label inline-flex items-center gap-1 rounded-[var(--am-radius)] border px-2 py-0.5 !text-[10px]",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
