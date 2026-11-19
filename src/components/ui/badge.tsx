import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** `solid` = filled accent, `outline` = hairline border. */
  variant?: "solid" | "outline";
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "outline", children, ...props }, ref) => (
    <span ref={ref} className={cn("ui-badge", `ui-badge--${variant}`, className)} {...props}>
      {children}
    </span>
  ),
);

Badge.displayName = "Badge";
