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
        "rounded-2xl border border-space-600/50 bg-space-800/60 backdrop-blur-sm",
        "transition-all duration-300",
        glow && "shadow-glow",
        hover && "hover:border-violet-500/30 hover:shadow-glow hover:-translate-y-0.5 cursor-pointer",
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
    <div className={cn("px-6 py-5 border-b border-space-600/50", className)} {...props}>
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
      className={cn("px-6 py-4 border-t border-space-600/50", className)}
      {...props}
    >
      {children}
    </div>
  );
}
