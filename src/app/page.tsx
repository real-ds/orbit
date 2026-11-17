"use client";

import { useState, useCallback, useMemo } from "react";
import { Filter, ChevronDown, Zap, Building2, Tag, Clock, ArrowRight, Loader2 } from "lucide-react";
import { Article, Category, DevelopmentType } from "@/types";
import { ArticleGrid } from "@/components/dashboard/ArticleGrid";
import { FilterPanel } from "@/components/dashboard/FilterPanel";
import { SearchBar } from "@/components/dashboard/SearchBar";
import { CategoryNav } from "@/components/dashboard/CategoryNav";
import { TagCloud } from "@/components/dashboard/TagCloud";
import { Pagination } from "@/components/dashboard/Pagination";
import { SortSelect } from "@/components/dashboard/SortSelect";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { dummyArticles, getArticlesPaginated, categories, developmentTypes, tags, collectionRuns, getCategoryCounts, getTopTags } from "@/data/dummy";
import { formatRelativeTime, getCategoryColor, getDevelopmentTypeColor, formatDevelopmentType, getTagTypeColor } from "@/lib/utils";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const [filters, setFilters] = useState({
    search: "",
    categories: [] as Category[],
    developmentTypes: [] as DevelopmentType[],
    organizations: [] as string[],
    technologies: [] as string[],
    dateFrom: null as string | null,
    dateTo: null as string | null,
    sort: "newest" as "newest" | "oldest" | "relevance",
    page: 1,
    limit: 20,
  });

  const [activeCategory, setActiveCategory] = useState<Category | "all">("all");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const hasActiveFilters = useMemo((): boolean => {
    return Boolean(
      filters.search ||
      filters.categories.length > 0 ||
      filters.developmentTypes.length > 0 ||
      filters.organizations.length > 0 ||
      filters.technologies.length > 0 ||
      filters.dateFrom ||
      filters.dateTo
    );
  }, [filters]);

  const activeFilterCount = useMemo(() => {
    return (
      filters.categories.length +
      filters.developmentTypes.length +
      filters.organizations.length +
      filters.technologies.length +
      (filters.dateFrom ? 1 : 0) +
      (filters.dateTo ? 1 : 0)
    );
  }, [filters]);

  const handleFiltersChange = useCallback((newFilters: Partial<typeof filters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  }, []);

  const handleCategoryChange = useCallback((category: Category | "all") => {
    setActiveCategory(category);
    if (category === "all") {
      handleFiltersChange({ categories: [] });
    } else {
      handleFiltersChange({ categories: [category] });
    }
  }, [handleFiltersChange]);

  const handleTagToggle = useCallback((tagName: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagName) ? prev.filter((t) => t !== tagName) : [...prev, tagName]
    );
  }, []);

  const handleSearch = useCallback((value: string) => {
    handleFiltersChange({ search: value, page: 1 });
  }, [handleFiltersChange]);

  const handleClearAll = useCallback(() => {
    setFilters({
      search: "",
      categories: [],
      developmentTypes: [],
      organizations: [],
      technologies: [],
      dateFrom: null,
      dateTo: null,
      sort: "newest",
      page: 1,
      limit: 20,
    });
    setSelectedTags([]);
    setActiveCategory("all");
  }, []);

  const { data: articles, total, totalPages, facets } = useMemo(() => {
    return getArticlesPaginated(
      filters.page,
      filters.limit,
      {
        search: filters.search,
        categories: filters.categories.length > 0 ? filters.categories : undefined,
        developmentTypes: filters.developmentTypes.length > 0 ? filters.developmentTypes : undefined,
        organizations: filters.organizations.length > 0 ? filters.organizations : undefined,
        technologies: filters.technologies.length > 0 ? filters.technologies : undefined,
      }
    );
  }, [filters.page, filters.limit, filters.search, filters.categories, filters.developmentTypes, filters.organizations, filters.technologies]);

  const categoryCounts = useMemo(() => getCategoryCounts(), []);
  const topTags = useMemo(() => getTopTags(30), []);

  const latestRun = collectionRuns[0];

  return (
    <div className="min-h-screen bg-charcoal-900">
      <header className="border-b border-cream-0/10 bg-charcoal-900/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2" aria-label="AI Intelligence Tracker Home">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-royal-500 to-purple-600 flex items-center justify-center">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <span className="font-display text-xl text-cream-10">AI Intelligence Tracker</span>
              </Link>
              <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
                <Link href="/" className="px-3 py-2 rounded-lg text-sm font-medium text-cream-40 hover:text-cream-10 hover:bg-charcoal-800 transition-colors">Dashboard</Link>
                <Link href="/saved" className="px-3 py-2 rounded-lg text-sm font-medium text-cream-40 hover:text-cream-10 hover:bg-charcoal-800 transition-colors">Saved</Link>
                <Link href="/about" className="px-3 py-2 rounded-lg text-sm font-medium text-cream-40 hover:text-cream-10 hover:bg-charcoal-800 transition-colors">About</Link>
              </nav>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileFiltersOpen(true)} aria-label="Open filters">
                <Filter className="h-5 w-5" />
              </Button>
              <div className="hidden sm:block w-72">
                <SearchBar
                  value={filters.search}
                  onChange={(v) => handleFiltersChange({ search: v })}
                  onSearch={handleSearch}
                  showFilters={true}
                  onFiltersClick={() => setShowFilters(!showFilters)}
                  filtersCount={activeFilterCount}
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden bg-charcoal-900/95 backdrop-blur-sm" onClick={() => setMobileFiltersOpen(false)}>
          <div className="max-w-sm mx-auto h-full overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl text-cream-10">Filters</h2>
              <Button variant="ghost" size="icon" onClick={() => setMobileFiltersOpen(false)}>
                <X className="h-6 w-6" />
              </Button>
            </div>
            <FilterPanel
              filters={filters}
              onFiltersChange={handleFiltersChange}
              facets={facets}
              hasActiveFilters={hasActiveFilters}
              onClearAll={handleClearAll}
            />
          </div>
        </div>
      )}

      <main className="mx-auto w-full max-w-[1400px] px-4 pb-12 sm:px-6 lg:px-8">
        <div className="pt-6 lg:pt-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <aside className="lg:w-64 flex-shrink-0 hidden lg:block">
              <div className="sticky top-24 space-y-6">
                <div className="bg-charcoal-800/50 border border-cream-0/10 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Zap className="h-5 w-5 text-royal-400" />
                    <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-cream-20">Latest Collection</span>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-cream-40">Status</span>
                      <Badge variant="outline" size="sm" className={latestRun?.status === "completed" ? "text-green-400 border-green-500/30" : "text-yellow-400 border-yellow-500/30"}>
                        {latestRun?.status ?? "Unknown"}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-cream-40">Articles Added</span>
                      <span className="font-mono text-cream-10">{latestRun?.articlesInserted || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-cream-40">Duplicates Skipped</span>
                      <span className="font-mono text-cream-10">{latestRun?.articlesDuplicated || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-cream-40">Sources Processed</span>
                      <span className="font-mono text-cream-10">{latestRun?.sourcesProcessed || 0}/{latestRun?.sourcesProcessed ? latestRun.sourcesProcessed + (latestRun.sourcesFailed || 0) : 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-cream-40">Completed</span>
                      <span className="font-mono text-cream-10">{latestRun?.completedAt ? formatRelativeTime(latestRun.completedAt) : "Never"}</span>
                    </div>
                  </div>
                </div>

                <CategoryNav
                  activeCategory={activeCategory}
                  onCategoryChange={handleCategoryChange}
                  counts={categoryCounts.reduce((acc, { category, count }) => ({ ...acc, [category]: count }), {} as Record<Category, number>)}
                  variant="sidebar"
                />

                <div className="bg-charcoal-800/50 border border-cream-0/10 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Tag className="h-5 w-5 text-royal-400" />
                    <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-cream-20">Trending Tags</span>
                  </div>
                  <TagCloud
                    tags={topTags}
                    selectedTags={selectedTags}
                    onTagToggle={handleTagToggle}
                    maxTags={20}
                    variant="list"
                  />
                </div>
              </div>
            </aside>

            <div className="flex-1 min-w-0">
              <div className="mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                  <div>
                    <h1 className="font-display text-2xl sm:text-3xl text-cream-10">Latest AI Developments</h1>
                    <p className="text-cream-40 text-sm mt-1">Track the latest AI research, model releases, and industry news</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <SortSelect value={filters.sort} onChange={(v) => handleFiltersChange({ sort: v })} />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowFilters(!showFilters)}
                      className="hidden sm:inline-flex"
                    >
                      <Filter className="h-4 w-4 mr-2" />
                      Filters
                      {activeFilterCount > 0 && (
                        <span className="ml-2 px-2 py-0.5 bg-royal-600 text-white text-[10px] font-mono rounded-full">
                          {activeFilterCount}
                        </span>
                      )}
                    </Button>
                  </div>
                </div>

                {showFilters && (
                  <div className="lg:hidden mb-6">
                    <FilterPanel
                      filters={filters}
                      onFiltersChange={handleFiltersChange}
                      facets={facets}
                      hasActiveFilters={hasActiveFilters}
                      onClearAll={handleClearAll}
                    />
                  </div>
                )}

                <CategoryNav
                  activeCategory={activeCategory}
                  onCategoryChange={handleCategoryChange}
                  counts={categoryCounts.reduce((acc, { category, count }) => ({ ...acc, [category]: count }), {} as Record<Category, number>)}
                  variant="chips"
                  className="overflow-x-auto pb-2 -mb-2"
                />
              </div>

              {hasActiveFilters && (
                <div className="mb-6 flex flex-wrap gap-2">
                  {filters.categories.map((cat) => (
                    <Badge key={`cat-${cat}`} variant="category" className={cn(getCategoryColor(cat), "cursor-pointer")} onClick={() => handleFiltersChange({ categories: filters.categories.filter((c) => c !== cat) })}>
                      {cat} <X className="h-3 w-3 ml-1" />
                    </Badge>
                  ))}
                  {filters.developmentTypes.map((dt) => (
                    <Badge key={`dt-${dt}`} variant="development" className={cn(getDevelopmentTypeColor(dt), "cursor-pointer")} onClick={() => handleFiltersChange({ developmentTypes: filters.developmentTypes.filter((d) => d !== dt) })}>
                      {formatDevelopmentType(dt)} <X className="h-3 w-3 ml-1" />
                    </Badge>
                  ))}
                  {filters.organizations.map((org) => (
                    <Badge key={`org-${org}`} variant="tag" className={cn("cursor-pointer")} onClick={() => handleFiltersChange({ organizations: filters.organizations.filter((o) => o !== org) })}>
                      {org} <X className="h-3 w-3 ml-1" />
                    </Badge>
                  ))}
                  {filters.technologies.map((tech) => (
                    <Badge key={`tech-${tech}`} variant="tag" className={cn("cursor-pointer")} onClick={() => handleFiltersChange({ technologies: filters.technologies.filter((t) => t !== tech) })}>
                      {tech} <X className="h-3 w-3 ml-1" />
                    </Badge>
                  ))}
                  {filters.dateFrom && (
                    <Badge key="date-from" variant="tag" className={cn("cursor-pointer")} onClick={() => handleFiltersChange({ dateFrom: null })}>
                      From: {filters.dateFrom} <X className="h-3 w-3 ml-1" />
                    </Badge>
                  )}
                  {filters.dateTo && (
                    <Badge key="date-to" variant="tag" className={cn("cursor-pointer")} onClick={() => handleFiltersChange({ dateTo: null })}>
                      To: {filters.dateTo} <X className="h-3 w-3 ml-1" />
                    </Badge>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between mb-4">
                <p className="font-mono text-[11px] text-cream-40">
                  Showing <span className="text-cream-10">{articles.length}</span> of <span className="text-cream-10">{total}</span> articles
                </p>
                {filters.sort !== "newest" && (
                  <Button variant="ghost" size="sm" onClick={() => handleFiltersChange({ sort: "newest" })}>
                    <ArrowRight className="h-3.5 w-3.5 mr-1" />
                    Sort by newest
                  </Button>
                )}
              </div>

              <ArticleGrid
                articles={articles}
                variant="default"
                onSaveToggle={(id, saved) => console.log("Save toggle:", id, saved)}
              />

              {totalPages > 1 && (
                <div className="mt-8">
                  <Pagination
                    currentPage={filters.page}
                    totalPages={totalPages}
                    onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
                  />
                </div>
              )}

              {articles.length === 0 && !filters.search && !hasActiveFilters && (
                <div className="text-center py-16">
                  <div className="mx-auto w-24 h-24 rounded-full bg-charcoal-800 flex items-center justify-center mb-4">
                    <Zap className="h-12 w-12 text-cream-30" />
                  </div>
                  <h2 className="font-display text-xl text-cream-10 mb-2">No articles yet</h2>
                  <p className="text-cream-40 mb-6">The collection worker hasn't run yet. Check back soon!</p>
                  <Button variant="primary" onClick={() => handleFiltersChange({ page: 1 })}>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Refresh
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-cream-0/10 bg-charcoal-900/80 backdrop-blur-sm">
        <div className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-cream-40 text-sm">
              AI Intelligence Tracker &copy; {new Date().getFullYear()} &mdash; Automated AI news aggregation
            </p>
            <div className="flex items-center gap-4 text-sm text-cream-40">
              <span>Updated {latestRun?.completedAt ? formatRelativeTime(latestRun.completedAt) : "recently"}</span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                Live
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

import Link from "next/link";
import { X } from "lucide-react";