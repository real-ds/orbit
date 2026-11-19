import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** `solid` = filled accent, `ghost` = transparent, `outline` = hairline border. */
  variant?: "solid" | "ghost" | "outline";
  size?: "sm" | "md";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "solid", size = "md", type = "button", children, ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn("ui-button", `ui-button--${variant}`, `ui-button--${size}`, className)}
      {...props}
    >
      {children}
    </button>
  ),
);

Button.displayName = "Button";
