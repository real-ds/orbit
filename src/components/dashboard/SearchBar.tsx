"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (value: string) => void;
  placeholder?: string;
  showFilters?: boolean;
  onFiltersClick?: () => void;
  filtersCount?: number;
  className?: string;
}

export function SearchBar({
  value,
  onChange,
  onSearch,
  placeholder = "Search articles, technologies, companies...",
  showFilters = true,
  onFiltersClick,
  filtersCount = 0,
  className = "",
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onSearch(value);
    }
    if (e.key === "Escape") {
      inputRef.current?.blur();
      setIsFocused(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleClear = () => {
    onChange("");
    inputRef.current?.focus();
  };

  return (
    <div
      className={cn(
        "relative w-full transition-all duration-200",
        isFocused && "ring-2 ring-accent/30",
        className
      )}
    >
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={cn(
            "w-full pl-4 pr-12 py-3 sm:py-3.5",
            "bg-bg-raised border border-border rounded-xl",
            "text-text-primary placeholder:text-text-muted",
            "focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent",
            "transition-all duration-200",
            "text-[14px] sm:text-[15px]",
            value && "pr-28"
          )}
          autoComplete="off"
          aria-label="Search articles"
        />
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-raised transition-colors"
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      {showFilters && (
        <Button
          variant="outline"
          size="sm"
          className="mt-2 w-full sm:w-auto"
          onClick={onFiltersClick}
        >
          Filters
          {filtersCount > 0 && (
            <span className="ml-2 px-2 py-0.5 bg-accent text-white text-[10px] font-mono rounded-full">
              {filtersCount}
            </span>
          )}
        </Button>
      )}
    </div>
  );
}