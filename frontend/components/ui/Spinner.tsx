import { cn } from "@/lib/utils";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = { sm: "h-4 w-4", md: "h-8 w-8", lg: "h-12 w-12" };

export function Spinner({ size = "md", className }: SpinnerProps) {
  return (
    <div
      className={cn(
        "animate-spin rounded-full border-2 border-space-600 border-t-violet-500",
        sizeMap[size],
        className
      )}
      role="status"
      aria-label="Loading"
    />
  );
}

export function PageLoader() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-space-gradient">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <Spinner size="lg" />
          <div className="absolute inset-0 flex items-center justify-center text-2xl">
            ✦
          </div>
        </div>
        <p className="text-sm text-slate-400 animate-pulse">Loading…</p>
      </div>
    </div>
  );
}
