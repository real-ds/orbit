import { forwardRef, type SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "children"> {
  label?: string;
  options: SelectOption[];
  /** Label for the empty option. Omit to make the empty option unavailable. */
  allLabel?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, options, allLabel, id, ...props }, ref) => {
    const selectId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <label className="ui-field" htmlFor={selectId}>
        {label && <span className="ui-field__label">{label}</span>}
        <select
          ref={ref}
          id={selectId}
          className={cn("ui-field__control ui-select", className)}
          {...props}
        >
          {allLabel && <option value="">{allLabel}</option>}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    );
  },
);

Select.displayName = "Select";
