"use client";

import { useState } from "react";
import { X, ChevronDown, ChevronUp, Filter, SlidersHorizontal } from "lucide-react";
import { Category, DevelopmentType } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { categories, developmentTypes } from "@/data/dummy";
import { getCategoryColor, getDevelopmentTypeColor, formatDevelopmentType } from "@/lib/utils";
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

  const renderFilterChips = () => {
    const chips: React.ReactNode[] = [];

    filters.categories.forEach((cat) => {
      chips.push(
        <Badge key={`cat-${cat}`} variant="category" className={cn(getCategoryColor(cat), "cursor-pointer")} onClick={() => handleCategoryToggle(cat)}>
          {cat} <X className="h-3 w-3 ml-1" />
        </Badge>
      );
    });

    filters.developmentTypes.forEach((dt) => {
      chips.push(
        <Badge key={`dt-${dt}`} variant="development" className={cn(getDevelopmentTypeColor(dt), "cursor-pointer")} onClick={() => handleDevTypeToggle(dt)}>
          {formatDevelopmentType(dt)} <X className="h-3 w-3 ml-1" />
        </Badge>
      );
    });

    filters.organizations.forEach((org) => {
      chips.push(
        <Badge key={`org-${org}`} variant="tag" className={cn("cursor-pointer")} onClick={() => handleOrganizationToggle(org)}>
          {org} <X className="h-3 w-3 ml-1" />
        </Badge>
      );
    });

    filters.technologies.forEach((tech) => {
      chips.push(
        <Badge key={`tech-${tech}`} variant="tag" className={cn("cursor-pointer")} onClick={() => handleTechnologyToggle(tech)}>
          {tech} <X className="h-3 w-3 ml-1" />
        </Badge>
      );
    });

    if (filters.dateFrom) {
      chips.push(
        <Badge key="date-from" variant="tag" className={cn("cursor-pointer")} onClick={() => onFiltersChange({ dateFrom: null })}>
          From: {filters.dateFrom} <X className="h-3 w-3 ml-1" />
        </Badge>
      );
    }

    if (filters.dateTo) {
      chips.push(
        <Badge key="date-to" variant="tag" className={cn("cursor-pointer")} onClick={() => onFiltersChange({ dateTo: null })}>
          To: {filters.dateTo} <X className="h-3 w-3 ml-1" />
        </Badge>
      );
    }

    return chips;
  };

  return (
    <aside className={cn("lg:w-72 flex-shrink-0", className)}>
      <div className="sticky top-24 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-mono text-[11px] uppercase tracking-[0.15em] text-cream-30 flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </h2>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={onClearAll} className="text-cream-40 hover:text-royal-400">
              <X className="h-3.5 w-3.5 mr-1" />
              Clear all
            </Button>
          )}
        </div>

        {hasActiveFilters && (
          <div className="flex flex-wrap gap-1.5">
            {renderFilterChips()}
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
          icon={Filter}
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
                  className="w-4 h-4 rounded border-cream-0/20 bg-charcoal-800 text-royal-500 focus:ring-royal-500 focus:ring-1 transition-colors"
                />
                <div className="flex-1 flex items-center justify-between">
                  <Badge variant="category" className={cn(getCategoryColor(name), "pointer-events-none")} size="sm">
                    {name}
                  </Badge>
                  <span className="font-mono text-[10px] text-cream-45 group-hover:text-cream-30">{count}</span>
                </div>
              </label>
            ))}
          </div>
        </FilterSection>

        <FilterSection
          title="Development Types"
          icon={Zap}
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
                  className="w-4 h-4 rounded border-cream-0/20 bg-charcoal-800 text-royal-500 focus:ring-royal-500 focus:ring-1 transition-colors"
                />
                <div className="flex-1 flex items-center justify-between">
                  <Badge variant="development" className={cn(getDevelopmentTypeColor(name), "pointer-events-none")} size="sm">
                    {formatDevelopmentType(name)}
                  </Badge>
                  <span className="font-mono text-[10px] text-cream-45 group-hover:text-cream-30">{count}</span>
                </div>
              </label>
            ))}
          </div>
        </FilterSection>

        <FilterSection
          title="Organizations"
          icon={Building2}
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
                  className="w-4 h-4 rounded border-cream-0/20 bg-charcoal-800 text-royal-500 focus:ring-royal-500 focus:ring-1 transition-colors"
                />
                <span className="text-cream-10 group-hover:text-royal-400 transition-colors text-sm">{name}</span>
                <span className="font-mono text-[10px] text-cream-45 ml-auto">{count}</span>
              </label>
            ))}
            {facets.organizations.length > 15 && (
              <Button variant="ghost" size="sm" className="w-full justify-start text-cream-40 hover:text-royal-400 px-0">
                Show {facets.organizations.length - 15} more
              </Button>
            )}
          </div>
        </FilterSection>

        <FilterSection
          title="Technologies"
          icon={Tag}
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
                  className="w-4 h-4 rounded border-cream-0/20 bg-charcoal-800 text-royal-500 focus:ring-royal-500 focus:ring-1 transition-colors"
                />
                <span className="text-cream-10 group-hover:text-royal-400 transition-colors text-sm">{name}</span>
                <span className="font-mono text-[10px] text-cream-45 ml-auto">{count}</span>
              </label>
            ))}
            {facets.technologies.length > 15 && (
              <Button variant="ghost" size="sm" className="w-full justify-start text-cream-40 hover:text-royal-400 px-0">
                Show {facets.technologies.length - 15} more
              </Button>
            )}
          </div>
        </FilterSection>

        <FilterSection
          title="Date Range"
          icon={Clock}
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

import { Zap, Building2, Tag, Clock, LucideIcon } from "lucide-react";

interface FilterSectionProps {
  title: string;
  icon: LucideIcon;
  open: boolean;
  onToggle: () => void;
  count?: number;
  children: React.ReactNode;
}

function FilterSection({ title, icon: Icon, open, onToggle, count, children }: FilterSectionProps) {
  return (
    <div className="bg-charcoal-800/50 border border-cream-0/10 rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-3 p-4 text-left transition-colors hover:bg-charcoal-800"
      >
        <div className="flex items-center gap-2">
          <span className="text-cream-40"><Icon className="h-5 w-5" /></span>
          <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-cream-20">{title}</span>
          {count !== undefined && (
            <span className="font-mono text-[10px] text-cream-45 bg-charcoal-700 px-2 py-0.5 rounded">{count}</span>
          )}
        </div>
        {open ? <ChevronUp className="h-4 w-4 text-cream-40" /> : <ChevronDown className="h-4 w-4 text-cream-40" />}
      </button>
      {open && <div className="px-4 pb-4 border-t border-cream-0/10">{children}</div>}
    </div>
  );
}