import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, hint, id, ...props }, ref) => {
    const inputId = id ?? props.name;

    return (
      <div className="ui-field">
        {label && (
          <label className="ui-field__label" htmlFor={inputId}>
            {label}
          </label>
        )}
        <input ref={ref} id={inputId} className={cn("ui-field__control", className)} {...props} />
        {hint && <p className="ui-field__hint">{hint}</p>}
      </div>
    );
  },
);

Input.displayName = "Input";
