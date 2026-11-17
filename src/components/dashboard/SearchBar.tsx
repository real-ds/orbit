"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { Search, X, Filter, SlidersHorizontal } from "lucide-react";
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
        isFocused && "ring-2 ring-royal-500/50",
        className
      )}
    >
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-cream-40 transition-colors group-focus-within:text-royal-400" />
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
            "w-full pl-12 pr-12 py-3.5 sm:py-4",
            "bg-charcoal-800 border border-cream-0/10 rounded-xl",
            "text-cream-10 placeholder:text-cream-40",
            "focus:outline-none focus:border-royal-500 focus:ring-1 focus:ring-royal-500",
            "transition-all duration-200",
            "text-[15px] sm:text-[16px]",
            value && "pr-28"
          )}
          autoComplete="off"
          aria-label="Search articles"
        />
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-lg text-cream-40 hover:text-cream-10 hover:bg-cream-0/10 transition-colors"
            aria-label="Clear search"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {showFilters && (
        <Button
          variant="outline"
          size="md"
          className="mt-3 w-full sm:w-auto"
          onClick={onFiltersClick}
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
          {filtersCount > 0 && (
            <span className="ml-2 px-2 py-0.5 bg-royal-600 text-white text-[10px] font-mono rounded-full">
              {filtersCount}
            </span>
          )}
        </Button>
      )}
    </div>
  );
}