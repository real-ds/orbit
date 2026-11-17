"use client";

import { categories } from "@/data/dummy";
import { getCategoryColor } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
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
  const allCategories: (Category | "all")[] = ["all", ...categories];

  if (variant === "sidebar") {
    return (
      <nav className={cn("space-y-1", className)} aria-label="Categories">
        {allCategories.map((cat) => {
          const isActive = activeCategory === cat;
          const count = cat === "all" ? Object.values(counts).reduce((a, b) => a + b, 0) : counts[cat] || 0;
          const color = cat === "all" ? "bg-charcoal-700 text-cream-10 border-cream-0/10" : getCategoryColor(cat);

          return (
            <button
              key={cat}
              type="button"
              onClick={() => onCategoryChange(cat)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200",
                "font-medium text-sm",
                isActive
                  ? `${color} shadow-lg shadow-[${color.split(" ")[0].replace("bg-", "")}]/20`
                  : "text-cream-40 hover:text-cream-10 hover:bg-charcoal-800"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <Badge variant="category" className={cn(color, "pointer-events-none")} size="sm">
                {cat === "all" ? "All" : cat}
              </Badge>
              <span className="font-mono text-[10px] text-cream-45 ml-auto">{count}</span>
            </button>
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
          const count = cat === "all" ? Object.values(counts).reduce((a, b) => a + b, 0) : counts[cat] || 0;
          const color = cat === "all" ? "bg-charcoal-700 text-cream-10 border-cream-0/10" : getCategoryColor(cat);

          return (
            <button
              key={cat}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onCategoryChange(cat)}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200",
                "whitespace-nowrap",
                isActive ? `${color} shadow-md` : "text-cream-40 hover:text-cream-10 hover:bg-charcoal-800"
              )}
            >
              <span>{cat === "all" ? "All" : cat}</span>
              <span className="font-mono text-[10px] text-cream-45 bg-charcoal-900/50 px-1.5 py-0.5 rounded-full">
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
        const count = cat === "all" ? Object.values(counts).reduce((a, b) => a + b, 0) : counts[cat] || 0;
        const color = cat === "all" ? "bg-charcoal-700 text-cream-10 border-cream-0/10" : getCategoryColor(cat);

        return (
          <button
            key={cat}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onCategoryChange(cat)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
              "whitespace-nowrap",
              isActive ? `${color} shadow-md` : "text-cream-40 hover:text-cream-10 hover:bg-charcoal-800"
            )}
          >
            <span>{cat === "all" ? "All" : cat}</span>
            <span className="font-mono text-[10px] text-cream-45 bg-charcoal-900/50 px-2 py-0.5 rounded-full">
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}