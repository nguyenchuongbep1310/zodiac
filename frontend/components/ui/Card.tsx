import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  glow?: boolean;
  hover?: boolean;
}

export function Card({ glow, hover, className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-[1.75rem] border border-[var(--am-line)] bg-[var(--am-surface)]",
        "transition-all duration-300 ease-out",
        glow && "shadow-[0_24px_60px_-24px_rgba(76,52,200,0.35)]",
        hover && "hover:shadow-lg hover:-translate-y-1 cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("px-6 py-5 border-b border-[var(--am-line)]", className)} {...props}>
      {children}
    </div>
  );
}

export function CardContent({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("px-6 py-5", className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("px-6 py-4 border-t border-[var(--am-line)]", className)}
      {...props}
    >
      {children}
    </div>
  );
}
