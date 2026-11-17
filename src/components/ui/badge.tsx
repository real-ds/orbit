"use client";

import { forwardRef, HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "outline" | "dot";
  color?: string;
  size?: "sm" | "md" | "lg";
  dotColor?: string;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", color, size = "md", dotColor, children, ...props }, ref) => {
    const baseStyles = "inline-flex items-center font-medium transition-colors";

    const variants = {
      default: "bg-bg-raised text-text-primary border border-border",
      outline: "bg-transparent text-text-primary border border-border",
      dot: "bg-transparent text-text-primary border-none px-0",
    };

    const sizes = {
      sm: "px-2 py-0.5 text-[10px] rounded gap-1",
      md: "px-2.5 py-1 text-[11px] rounded-lg gap-1.5",
      lg: "px-3 py-1.5 text-[12px] rounded-xl gap-2",
    };

    const customStyle = color ? { backgroundColor: `${color}20`, borderColor: `${color}40`, color: color } : {};

    return (
      <span
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        style={customStyle}
        {...props}
      >
        {variant === "dot" && dotColor && (
          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: dotColor }} />
        )}
        {children}
      </span>
    );
  }
);

Badge.displayName = "Badge";