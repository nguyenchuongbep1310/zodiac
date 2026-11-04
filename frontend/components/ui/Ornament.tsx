import { cn } from "@/lib/utils";

/** Decorative rule with a star in the middle. Hidden from assistive tech. */
export function Ornament({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn("flex items-center gap-3 text-[var(--am-edge)]", className)}>
      <span className="h-px flex-1 bg-current" />
      <span>✦</span>
      <span className="h-px flex-1 bg-current" />
    </div>
  );
}
