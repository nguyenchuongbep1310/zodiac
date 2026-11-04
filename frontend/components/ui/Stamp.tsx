import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** A round rubber-stamp: dashed ink edge, mono caps, tilted a little. */
export function Stamp({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "stamp mono-label inline-grid h-16 w-16 -rotate-[8deg] place-items-center rounded-full",
        "border-2 border-dashed border-[var(--am-edge)] text-center leading-tight text-[var(--am-ink)]",
        className
      )}
    >
      {children}
    </span>
  );
}
