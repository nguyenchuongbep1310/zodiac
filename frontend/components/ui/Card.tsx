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
        "rounded-3xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 backdrop-blur-md",
        "transition-all duration-300 ease-out",
        glow && "shadow-glass dark:shadow-glow",
        hover && "hover:border-black/20 dark:hover:border-white/20 hover:bg-black/10 dark:hover:bg-white/10 hover:shadow-glass dark:hover:shadow-glow hover:-translate-y-1 hover:scale-[1.01] cursor-pointer",
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
    <div className={cn("px-6 py-5 border-b border-black/5 dark:border-white/5", className)} {...props}>
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
      className={cn("px-6 py-4 border-t border-white/5", className)}
      {...props}
    >
      {children}
    </div>
  );
}
