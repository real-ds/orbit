"use client";

import { Tag } from "@/types";
import { getTagTypeColor } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TagCloudProps {
  tags: Tag[];
  selectedTags: string[];
  onTagToggle: (tagName: string) => void;
  maxTags?: number;
  showCounts?: boolean;
  variant?: "cloud" | "list" | "chips";
  className?: string;
}

export function TagCloud({
  tags,
  selectedTags,
  onTagToggle,
  maxTags = 30,
  showCounts = true,
  variant = "cloud",
  className = "",
}: TagCloudProps) {
  const displayTags = tags.slice(0, maxTags);

  if (variant === "list") {
    return (
      <div className={cn("space-y-2", className)}>
        {displayTags.map((tag) => {
          const isSelected = selectedTags.includes(tag.name);
          const count = tag.count || 0;
          const color = getTagTypeColor(tag.type);

          return (
            <label key={tag.id} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onTagToggle(tag.name)}
                className="w-4 h-4 rounded border-cream-0/20 bg-charcoal-800 text-royal-500 focus:ring-royal-500 focus:ring-1 transition-colors"
              />
              <Badge variant="tag" className={cn(color, "pointer-events-none flex-1 justify-between")} size="sm">
                <span className="capitalize">{tag.name}</span>
                {showCounts && (
                  <span className="font-mono text-[10px] text-cream-45 bg-charcoal-900/50 px-1.5 py-0.5 rounded-full">
                    {count}
                  </span>
                )}
                <span className="text-[10px] text-cream-45 uppercase">{tag.type}</span>
              </Badge>
            </label>
          );
        })}
      </div>
    );
  }

  if (variant === "chips") {
    return (
      <div className={cn("flex flex-wrap gap-2", className)}>
        {displayTags.map((tag) => {
          const isSelected = selectedTags.includes(tag.name);
          const color = getTagTypeColor(tag.type);

          return (
            <button
              key={tag.id}
              type="button"
              onClick={() => onTagToggle(tag.name)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200",
                "whitespace-nowrap",
                isSelected ? `${color} shadow-md` : `text-cream-40 hover:text-cream-10 hover:bg-charcoal-800 ${color.replace("text-", "border-").replace("bg-", "bg-")}`
              )}
            >
              <span className="capitalize">{tag.name}</span>
              {showCounts && tag.count && (
                <span className="font-mono text-[10px] text-cream-45 bg-charcoal-900/50 px-1.5 py-0.5 rounded-full">
                  {tag.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {displayTags.map((tag) => {
        const isSelected = selectedTags.includes(tag.name);
        const count = tag.count || 0;
        const color = getTagTypeColor(tag.type);
        const fontSize = Math.min(14 + Math.log10(count + 1) * 4, 24);

        return (
          <button
            key={tag.id}
            type="button"
            onClick={() => onTagToggle(tag.name)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-200",
              "whitespace-nowrap",
              isSelected
                ? `${color} shadow-md ring-2 ring-offset-2 ring-offset-charcoal-900`
                : `text-cream-40 hover:text-cream-10 hover:bg-charcoal-800 border border-cream-0/10`
            )}
            style={{ fontSize: `${fontSize}px` }}
          >
            <span className="capitalize">{tag.name}</span>
            {showCounts && count > 0 && (
              <span className="font-mono text-[10px] text-cream-45 bg-charcoal-900/50 px-1.5 py-0.5 rounded-full">
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}