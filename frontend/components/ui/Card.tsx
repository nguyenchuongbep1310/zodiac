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
        "rounded-[var(--am-radius)] border-2 border-[var(--am-edge)] bg-[var(--am-surface)]",
        "transition-[transform,box-shadow] duration-150 ease-out",
        glow && "shadow-[var(--am-shadow)]",
        hover && "motion-safe:hover:[transform:translate(-2px,-2px)] hover:shadow-[6px_6px_0_var(--am-edge)] cursor-pointer",
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
