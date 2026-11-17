"use client";

import { forwardRef, ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg" | "icon";
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, disabled, children, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal-900 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
      primary: "bg-royal-600 text-white hover:bg-royal-500 active:bg-royal-700 focus-visible:ring-royal-500",
      secondary: "bg-charcoal-700 text-cream-10 hover:bg-charcoal-600 active:bg-charcoal-800 focus-visible:ring-charcoal-500",
      outline: "border border-cream-0/20 bg-transparent text-cream-10 hover:bg-cream-0/5 active:bg-cream-0/10 focus-visible:ring-cream-0/20",
      ghost: "bg-transparent text-cream-10 hover:bg-cream-0/5 active:bg-cream-0/10 focus-visible:ring-cream-0/20",
      danger: "bg-red-600 text-white hover:bg-red-500 active:bg-red-700 focus-visible:ring-red-500",
    };

    const sizes = {
      sm: "h-8 px-3 text-[12px] rounded-lg gap-1.5",
      md: "h-10 px-4 text-[13px] rounded-xl gap-2",
      lg: "h-12 px-6 text-[14px] rounded-xl gap-2",
      icon: "h-10 w-10 rounded-xl",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";