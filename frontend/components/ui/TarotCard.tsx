import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface TarotCardProps {
  numeral: string;
  title: string;
  /** Degrees of tilt. Applied from the md breakpoint up, never under reduced motion. */
  tilt?: number;
  className?: string;
  children: ReactNode;
}

/** A card framed like a tarot card: double border, numeral on top, title strip below. */
export function TarotCard({ numeral, title, tilt = 0, className, children }: TarotCardProps) {
  return (
    <div
      data-tarot
      className={cn(
        "ink-border hard-shadow relative bg-[var(--am-surface)] p-1.5",
        "motion-safe:md:[transform:rotate(var(--tilt))]",
        className
      )}
      style={tilt ? ({ "--tilt": `${tilt}deg` } as CSSProperties) : undefined}
    >
      <div className="flex h-full flex-col border border-[var(--am-edge)]">
        <div className="mono-label border-b border-[var(--am-edge)] py-1 text-center text-[var(--am-muted)]">
          {numeral}
        </div>
        <div className="flex-1 p-4">{children}</div>
        <div className="mono-label bg-[var(--am-ink)] py-2 text-center text-[var(--am-bg)]">{title}</div>
      </div>
    </div>
  );
}
