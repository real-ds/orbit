"use client";

import { Tag } from "@/types";
import { cn } from "@/lib/utils";

interface TagCloudProps {
  tags: Tag[];
  selectedTags: string[];
  onTagToggle: (tagName: string) => void;
  maxTags?: number;
  variant?: "cloud" | "list" | "chips" | "bento";
  className?: string;
}

export function TagCloud({
  tags,
  selectedTags,
  onTagToggle,
  maxTags = 30,
  variant = "cloud",
  className = "",
}: TagCloudProps) {
  const displayTags = tags.slice(0, maxTags);

  if (variant === "list") {
    return (
      <div className={cn("space-y-2", className)}>
        {tags.slice(0, maxTags).map((tag) => {
          const isSelected = selectedTags.includes(tag.name);
          return (
            <label key={tag.id} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onTagToggle(tag.name)}
                className="w-4 h-4 rounded border-border bg-bg-raised text-accent focus:ring-accent focus:ring-1 transition-colors"
              />
              <span className={cn(
                "capitalize text-sm font-medium transition-colors",
                isSelected ? "text-accent" : "text-text-secondary"
              )}>
                {tag.name}
              </span>
            </label>
          );
        })}
      </div>
    );
  }

  if (variant === "chips") {
    return (
      <div className={cn("flex flex-wrap gap-2", className)}>
        {tags.slice(0, maxTags).map((tag) => {
          const isSelected = selectedTags.includes(tag.name);
          return (
            <button
              key={tag.id}
              type="button"
              onClick={() => onTagToggle(tag.name)}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors duration-200",
                "whitespace-nowrap",
                isSelected
                  ? "bg-accent text-white"
                  : "text-text-secondary hover:text-text-primary hover:bg-bg-raised border border-border"
              )}
            >
              <span>{tag.name}</span>
            </button>
          );
        })}
      </div>
    );
  }

  if (variant === "bento") {
    const displayTags = tags.slice(0, maxTags);
    return (
      <div className={cn("bento-grid", className)} role="list" aria-label="Trending tags">
        {displayTags.map((tag, index) => {
          const isSelected = selectedTags.includes(tag.name);
          // Asymmetrical bento: items at index 0, 3, 5, 8, 10, 13 span 2x2
          const isLarge = [0, 3, 5, 8, 10, 13].includes(index);

          const baseClasses = "bento-tag relative flex flex-col items-start justify-between p-3 rounded-xl cursor-pointer";
          const transitionClasses = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg hover:shadow-md hover:border-accent/50 transition-all duration-200 min-h-[88px] md:min-h-[100px] flex flex-col items-start justify-between";
          const selectedClasses = "bg-accent text-white border-2 border-accent shadow-[0_0_0_2px_rgba(22,134,91,0.3)]";
          const unselectedClasses = "bg-bg-elevated border border-border hover:border-accent/50 hover:shadow-sm";
          const sizeClasses = isLarge ? "md:col-span-2 md:row-span-2" : "";

          return (
            <button
              key={tag.id}
              type="button"
              role="listitem"
              onClick={() => onTagToggle(tag.name)}
              className={cn(
                "bento-tag relative flex flex-col items-start justify-between p-3 rounded-xl cursor-pointer",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
                "hover:shadow-md",
                "hover:border-accent/50",
                "transition-all duration-200",
                "min-h-[88px] md:min-h-[100px]",
                "flex flex-col items-start justify-between",
                isSelected
                  ? "bg-accent text-white border-2 border-accent shadow-[0_0_0_2px_rgba(22,134,91,0.3)]"
                  : "bg-bg-elevated border border-border hover:border-accent/50 hover:shadow-sm",
                isLarge && "md:col-span-2 md:row-span-2"
              )}
              aria-pressed={isSelected}
              aria-label={isSelected ? `Deselect ${tag.name}` : `Select ${tag.name}`}
            >
              <span className={cn(
                "font-medium text-[14px] leading-snug capitalize transition-colors truncate max-w-full",
                isSelected ? "text-white" : "text-text-primary"
              )}>
                {tag.name}
              </span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {tags.slice(0, maxTags).map((tag) => {
        const isSelected = selectedTags.includes(tag.name);
        return (
          <button
            key={tag.id}
            type="button"
            onClick={() => onTagToggle(tag.name)}
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors duration-200",
              "whitespace-nowrap",
              isSelected
                ? "bg-accent text-white"
                : "text-text-secondary hover:text-text-primary hover:bg-bg-raised border border-border"
            )}
          >
            <span>{tag.name}</span>
          </button>
        );
      })}
    </div>
  );
}