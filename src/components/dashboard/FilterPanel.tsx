"use client";

import { useState } from "react";
import { Category, DevelopmentType } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { CATEGORY_LIST, DEVELOPMENT_TYPES } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface FilterPanelProps {
  filters: {
    search: string;
    categories: Category[];
    developmentTypes: DevelopmentType[];
    organizations: string[];
    technologies: string[];
    dateFrom: string | null;
    dateTo: string | null;
  };
  onFiltersChange: (filters: Partial<FilterPanelProps["filters"]>) => void;
  facets: {
    categories: { name: Category; count: number }[];
    developmentTypes: { name: DevelopmentType; count: number }[];
    organizations: { name: string; count: number }[];
    technologies: { name: string; count: number }[];
  };
  hasActiveFilters: boolean;
  onClearAll: () => void;
  className?: string;
}

export function FilterPanel({
  filters,
  onFiltersChange,
  facets,
  hasActiveFilters,
  onClearAll,
  className = "",
}: FilterPanelProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    categories: true,
    developmentTypes: true,
    organizations: false,
    technologies: false,
    dates: false,
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleCategoryToggle = (category: Category) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter((c) => c !== category)
      : [...filters.categories, category];
    onFiltersChange({ categories: newCategories });
  };

  const handleDevTypeToggle = (devType: DevelopmentType) => {
    const newDevTypes = filters.developmentTypes.includes(devType)
      ? filters.developmentTypes.filter((d) => d !== devType)
      : [...filters.developmentTypes, devType];
    onFiltersChange({ developmentTypes: newDevTypes });
  };

  const handleOrganizationToggle = (org: string) => {
    const newOrgs = filters.organizations.includes(org)
      ? filters.organizations.filter((o) => o !== org)
      : [...filters.organizations, org];
    onFiltersChange({ organizations: newOrgs });
  };

  const handleTechnologyToggle = (tech: string) => {
    const newTechs = filters.technologies.includes(tech)
      ? filters.technologies.filter((t) => t !== tech)
      : [...filters.technologies, tech];
    onFiltersChange({ technologies: newTechs });
  };

  const renderActiveChips = () => {
    const chips: React.ReactNode[] = [];

    filters.categories.forEach((cat) => {
      chips.push(
        <Badge key={`cat-${cat}`} variant="outline" className={cn("cursor-pointer")} onClick={() => handleCategoryToggle(cat)}>
          {cat} <span className="ml-1">✕</span>
        </Badge>
      );
    });

    filters.developmentTypes.forEach((dt) => {
      chips.push(
        <Badge key={`dt-${dt}`} variant="outline" className={cn("cursor-pointer")} onClick={() => handleDevTypeToggle(dt)}>
          {dt.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())} <span className="ml-1">✕</span>
        </Badge>
      );
    });

    filters.organizations.forEach((org) => {
      chips.push(
        <Badge key={`org-${org}`} variant="outline" className={cn("cursor-pointer")} onClick={() => handleOrganizationToggle(org)}>
          {org} <span className="ml-1">✕</span>
        </Badge>
      );
    });

    filters.technologies.forEach((tech) => {
      chips.push(
        <Badge key={`tech-${tech}`} variant="outline" className={cn("cursor-pointer")} onClick={() => handleTechnologyToggle(tech)}>
          {tech} <span className="ml-1">✕</span>
        </Badge>
      );
    });

    if (filters.dateFrom) {
      chips.push(
        <Badge key="date-from" variant="outline" className={cn("cursor-pointer")} onClick={() => onFiltersChange({ dateFrom: null })}>
          From: {filters.dateFrom} <span className="ml-1">✕</span>
        </Badge>
      );
    }

    if (filters.dateTo) {
      chips.push(
        <Badge key="date-to" variant="outline" className={cn("cursor-pointer")} onClick={() => onFiltersChange({ dateTo: null })}>
          To: {filters.dateTo} <span className="ml-1">✕</span>
        </Badge>
      );
    }

    return chips;
  };

  return (
    <aside className={cn("lg:w-[255px] flex-shrink-0", className)}>
      <div className="sticky top-[88px] space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-[13px] uppercase tracking-[0.15em] text-text-secondary">Filters</h2>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={onClearAll} className="text-text-secondary hover:text-text-primary">
              Clear all
            </Button>
          )}
        </div>

        {hasActiveFilters && (
          <div className="flex flex-wrap gap-1.5">
            {renderActiveChips()}
          </div>
        )}

        <Input
          placeholder="Search articles..."
          value={filters.search}
          onChange={(e) => onFiltersChange({ search: e.target.value })}
          className="mb-2"
        />

        <FilterSection
          title="Categories"
          open={openSections.categories}
          onToggle={() => toggleSection("categories")}
          count={facets.categories.reduce((sum, c) => sum + c.count, 0)}
        >
          <div className="space-y-2">
            {facets.categories.map(({ name, count }) => (
              <label key={name} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.categories.includes(name)}
                  onChange={() => handleCategoryToggle(name)}
                  className="w-4 h-4 rounded border-border bg-bg-raised text-accent focus:ring-accent focus:ring-1 transition-colors"
                />
                <div className="flex-1 flex items-center justify-between">
                  <span className="text-text-primary group-hover:text-accent transition-colors text-sm">{name}</span>
                  <span className="font-sans text-[10px] text-text-muted group-hover:text-text-secondary">{count}</span>
                </div>
              </label>
            ))}
          </div>
        </FilterSection>

        <FilterSection
          title="Development Types"
          open={openSections.developmentTypes}
          onToggle={() => toggleSection("developmentTypes")}
          count={facets.developmentTypes.reduce((sum, d) => sum + d.count, 0)}
        >
          <div className="space-y-2">
            {facets.developmentTypes.map(({ name, count }) => (
              <label key={name} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.developmentTypes.includes(name)}
                  onChange={() => handleDevTypeToggle(name)}
                  className="w-4 h-4 rounded border-border bg-bg-raised text-accent focus:ring-accent focus:ring-1 transition-colors"
                />
                <div className="flex-1 flex items-center justify-between">
                  <span className="text-text-primary group-hover:text-accent transition-colors text-sm capitalize">
                    {name.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())}
                  </span>
                  <span className="font-sans text-[10px] text-text-muted group-hover:text-text-secondary">{count}</span>
                </div>
              </label>
            ))}
          </div>
        </FilterSection>

        <FilterSection
          title="Organizations"
          open={openSections.organizations}
          onToggle={() => toggleSection("organizations")}
          count={facets.organizations.reduce((sum, o) => sum + o.count, 0)}
        >
          <div className="space-y-2">
            {facets.organizations.slice(0, 15).map(({ name, count }) => (
              <label key={name} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.organizations.includes(name)}
                  onChange={() => handleOrganizationToggle(name)}
                  className="w-4 h-4 rounded border-border bg-bg-raised text-accent focus:ring-accent focus:ring-1 transition-colors"
                />
                <span className="text-text-primary group-hover:text-accent transition-colors text-sm">{name}</span>
                <span className="font-sans text-[10px] text-text-muted ml-auto">{count}</span>
              </label>
            ))}
            {facets.organizations.length > 15 && (
              <Button variant="ghost" size="sm" className="w-full justify-start text-text-secondary hover:text-text-primary px-0">
                Show {facets.organizations.length - 15} more
              </Button>
            )}
          </div>
        </FilterSection>

        <FilterSection
          title="Technologies"
          open={openSections.technologies}
          onToggle={() => toggleSection("technologies")}
          count={facets.technologies.reduce((sum, t) => sum + t.count, 0)}
        >
          <div className="space-y-2">
            {facets.technologies.slice(0, 15).map(({ name, count }) => (
              <label key={name} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.technologies.includes(name)}
                  onChange={() => handleTechnologyToggle(name)}
                  className="w-4 h-4 rounded border-border bg-bg-raised text-accent focus:ring-accent focus:ring-1 transition-colors"
                />
                <span className="text-text-primary group-hover:text-accent transition-colors text-sm">{name}</span>
                <span className="font-sans text-[10px] text-text-muted ml-auto">{count}</span>
              </label>
            ))}
            {facets.technologies.length > 15 && (
              <Button variant="ghost" size="sm" className="w-full justify-start text-text-secondary hover:text-text-primary px-0">
                Show {facets.technologies.length - 15} more
              </Button>
            )}
          </div>
        </FilterSection>

        <FilterSection
          title="Date Range"
          open={openSections.dates}
          onToggle={() => toggleSection("dates")}
        >
          <div className="grid gap-3">
            <Input
              type="date"
              label="From"
              value={filters.dateFrom || ""}
              onChange={(e) => onFiltersChange({ dateFrom: e.target.value || null })}
            />
            <Input
              type="date"
              label="To"
              value={filters.dateTo || ""}
              onChange={(e) => onFiltersChange({ dateTo: e.target.value || null })}
            />
          </div>
        </FilterSection>
      </div>
    </aside>
  );
}

interface FilterSectionProps {
  title: string;
  open: boolean;
  onToggle: () => void;
  count?: number;
  children: React.ReactNode;
}

function FilterSection({ title, open, onToggle, count, children }: FilterSectionProps) {
  return (
    <div className="bg-bg-elevated border border-border rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-3 p-3 text-left transition-colors hover:bg-bg-raised"
      >
        <div className="flex items-center gap-2">
          <span className="font-semibold text-[11px] uppercase tracking-[0.15em] text-text-secondary">{title}</span>
          {count !== undefined && (
            <span className="font-sans text-[10px] text-text-muted bg-bg-raised px-2 py-0.5 rounded">{count}</span>
          )}
        </div>
        <span className="text-text-muted">{open ? "▲" : "▼"}</span>
      </button>
      {open && <div className="px-3 pb-3 border-t border-border">{children}</div>}
    </div>
  );
}