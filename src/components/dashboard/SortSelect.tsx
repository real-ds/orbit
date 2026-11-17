"use client";

import { Select } from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface SortSelectProps {
  value: "newest" | "oldest" | "relevance";
  onChange: (value: "newest" | "oldest" | "relevance") => void;
  className?: string;
}

const sortOptions = [
  { value: "newest" as const, label: "Newest first" },
  { value: "oldest" as const, label: "Oldest first" },
  { value: "relevance" as const, label: "Relevance" },
];

export function SortSelect({ value, onChange, className = "" }: SortSelectProps) {
  return (
    <Select
      value={value}
      onChange={(e) => onChange(e.target.value as "newest" | "oldest" | "relevance")}
      options={sortOptions}
      placeholder="Sort by..."
      className={cn("w-full sm:w-48", className)}
    />
  );
}