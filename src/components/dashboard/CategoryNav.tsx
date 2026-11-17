"use client";

import Link from "next/link";
import { CATEGORY_LIST } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Category } from "@/types";

interface CategoryNavProps {
  activeCategory: Category | "all";
  onCategoryChange: (category: Category | "all") => void;
  counts?: Record<Category, number>;
  variant?: "pills" | "chips" | "sidebar";
  className?: string;
}

export function CategoryNav({
  activeCategory,
  onCategoryChange,
  counts = {} as Record<Category, number>,
  variant = "pills",
  className = "",
}: CategoryNavProps) {
  const allCategories = ["all", ...CATEGORY_LIST.filter(c => c !== "All")];

  const getCount = (cat: typeof allCategories[number]): number => {
    if (cat === "all") {
      return Object.values(counts).reduce((a, b) => a + b, 0);
    }
    return counts[cat as Category] || 0;
  };

  const getDisplayName = (cat: typeof allCategories[number]): string => {
    return cat === "all" ? "All" : cat;
  };

  const getHref = (cat: typeof allCategories[number]): string => {
    if (cat === "all") return "/";
    return `/category/${cat.toLowerCase().replace(/\s+/g, '-').replace(/&/g, '').replace(/[^a-z0-9-]/g, '')}`;
  };

  if (variant === "sidebar") {
    return (
      <nav className={cn("space-y-1", className)} aria-label="Categories">
        <h3 className="font-semibold text-[13px] uppercase tracking-[0.1em] text-text-secondary mb-3">
          Categories
        </h3>
        {allCategories.map((cat) => {
          const isActive = activeCategory === cat;
          const count = getCount(cat);

          return (
            <Link
              key={cat}
              href={getHref(cat)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors duration-200",
                "font-medium text-[14px]",
                isActive
                  ? "bg-accent-subtle text-accent font-semibold"
                  : "text-text-secondary hover:text-text-primary hover:bg-bg-raised"
              )}
              aria-current={activeCategory === cat ? "page" : undefined}
            >
              <span className="flex-1 truncate">{getDisplayName(cat)}</span>
              <span className="font-sans text-[13px] text-text-muted ml-auto whitespace-nowrap">{count}</span>
            </Link>
          );
        })}
      </nav>
    );
  }

  if (variant === "chips") {
    return (
      <div className={cn("flex flex-wrap gap-2", className)} role="tablist" aria-label="Categories">
        {allCategories.map((cat) => {
          const isActive = activeCategory === cat;
          const count = getCount(cat);

          return (
            <button
              key={cat}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onCategoryChange(cat as Category | "all")}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors duration-200",
                "whitespace-nowrap",
                isActive
                  ? "bg-accent-subtle text-accent border border-accent/30"
                  : "text-text-secondary hover:text-text-primary hover:bg-bg-raised border border-border"
              )}
            >
              <span>{getDisplayName(cat)}</span>
              <span className="font-sans text-[10px] text-text-muted bg-bg-raised px-1.5 py-0.5 rounded-full">
                {count}
              </span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className={cn("flex flex-wrap gap-2 overflow-x-auto pb-2 -mb-2", className)} role="tablist" aria-label="Categories">
      {allCategories.map((cat) => {
        const isActive = activeCategory === cat;
        const count = getCount(cat);

        return (
          <button
            key={cat}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onCategoryChange(cat as Category | "all")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200",
              "whitespace-nowrap",
              isActive
                ? "bg-accent-subtle text-accent border border-accent/30"
                : "text-text-secondary hover:text-text-primary hover:bg-bg-raised border border-border"
            )}
          >
            <span>{getDisplayName(cat)}</span>
            <span className="font-sans text-[10px] text-text-muted bg-bg-raised px-2 py-0.5 rounded-full">
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}