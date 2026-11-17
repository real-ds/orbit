"use client";

import { useState, useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Filter, Zap, Clock, X, Tag } from "lucide-react";
import { Article, Category, DevelopmentType } from "@/types";
import { ArticleGrid } from "@/components/dashboard/ArticleGrid";
import { FilterPanel } from "@/components/dashboard/FilterPanel";
import { SearchBar } from "@/components/dashboard/SearchBar";
import { CategoryNav } from "@/components/dashboard/CategoryNav";
import { TagCloud } from "@/components/dashboard/TagCloud";
import { Pagination } from "@/components/dashboard/Pagination";
import { SortSelect } from "@/components/dashboard/SortSelect";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { dummyArticles, getArticlesPaginated, categories, developmentTypes, tags, collectionRuns, getCategoryCounts, getTopTags } from "@/data/dummy";
import { formatRelativeTime, formatDevelopmentType, getCategoryHref } from "@/lib/utils";
import { cn } from "@/lib/utils";

export default function SearchPageClient() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [filters, setFilters] = useState({
    search: initialQuery,
    categories: [] as Category[],
    developmentTypes: [] as DevelopmentType[],
    organizations: [] as string[],
    technologies: [] as string[],
    dateFrom: null as string | null,
    dateTo: null as string | null,
    sort: "relevance" as "newest" | "oldest" | "relevance",
    page: 1,
    limit: 20,
  });

  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const handleFiltersChange = useCallback((newFilters: Partial<typeof filters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  }, []);

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
      sort: "relevance",
      page: 1,
      limit: 20,
    });
    setSelectedTags([]);
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

  const topTags = useMemo(() => getTopTags(30), []);
  const categoryCounts = useMemo(() => getCategoryCounts(), []);
  const latestRun = collectionRuns[0];

  return (
    <div className="min-h-screen bg-bg">
      <header className="border-b border-border bg-bg/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2" aria-label="AI Intelligence Tracker Home">
                <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <span className="font-display text-xl text-text-primary">AI Intelligence Tracker</span>
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:block w-96">
                <SearchBar
                  value={filters.search}
                  onChange={(v) => handleFiltersChange({ search: v })}
                  onSearch={handleSearch}
                  showFilters={true}
                  onFiltersClick={() => setShowFilters(!showFilters)}
                  filtersCount={filters.categories.length + filters.developmentTypes.length + filters.organizations.length + filters.technologies.length}
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1400px] px-4 pb-12 sm:px-6 lg:px-8">
        <div className="pt-6 lg:pt-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <aside className="lg:w-64 flex-shrink-0 hidden lg:block">
              <div className="sticky top-24 space-y-6">
                <div className="bg-bg-elevated border border-border rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Zap className="h-5 w-5 text-accent" />
                    <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-text-secondary">Search Results</span>
                  </div>
                  {filters.search && (
                    <p className="text-text-secondary text-sm mb-4">
                      Showing <span className="text-text-primary">{total}</span> results for &ldquo;{filters.search}&rdquo;
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {filters.categories.map((cat) => (
                      <Badge key={`cat-${cat}`} variant="outline" className={cn("cursor-pointer")} onClick={() => handleFiltersChange({ categories: filters.categories.filter((c) => c !== cat) })}>
                        {cat} <X className="h-3 w-3 ml-1" />
                      </Badge>
                    ))}
                    {filters.developmentTypes.map((dt) => (
                      <Badge key={`dt-${dt}`} variant="outline" className={cn("cursor-pointer")} onClick={() => handleFiltersChange({ developmentTypes: filters.developmentTypes.filter((d) => d !== dt) })}>
                        {formatDevelopmentType(dt)} <X className="h-3 w-3 ml-1" />
                      </Badge>
                    ))}
                    {filters.organizations.map((org) => (
                      <Badge key={`org-${org}`} variant="outline" className={cn("cursor-pointer")} onClick={() => handleFiltersChange({ organizations: filters.organizations.filter((o) => o !== org) })}>
                        {org} <X className="h-3 w-3 ml-1" />
                      </Badge>
                    ))}
                    {filters.technologies.map((tech) => (
                      <Badge key={`tech-${tech}`} variant="outline" className={cn("cursor-pointer")} onClick={() => handleFiltersChange({ technologies: filters.technologies.filter((t) => t !== tech) })}>
                        {tech} <X className="h-3 w-3 ml-1" />
                      </Badge>
                    ))}
                  </div>
                </div>

                <CategoryNav
                  activeCategory="all"
                  onCategoryChange={() => {}}
                  counts={categoryCounts.reduce((acc, { category, count }) => ({ ...acc, [category]: count }), {} as Record<Category, number>)}
                  variant="sidebar"
                />

                <div className="bg-bg-elevated border border-border rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Tag className="h-5 w-5 text-accent" />
                    <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-text-secondary">Top Tags</span>
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
                <Link href="/" className="inline-flex items-center gap-2 text-text-secondary hover:text-accent transition-colors mb-4">
                  <ArrowLeft className="h-5 w-5" />
                  Back to Dashboard
                </Link>
                <h1 className="font-display text-2xl sm:text-3xl text-text-primary mb-2">
                  Search
                </h1>
                {filters.search && (
                  <p className="text-text-secondary text-sm mb-4">
                    <span className="text-text-primary">{total}</span> results for &ldquo;{filters.search}&rdquo;
                  </p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <SortSelect value={filters.sort} onChange={(v) => handleFiltersChange({ sort: v })} />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                  {(filters.categories.length + filters.developmentTypes.length + filters.organizations.length + filters.technologies.length) > 0 && (
                    <span className="ml-2 px-2 py-0.5 bg-accent text-white text-[10px] font-mono rounded-full">
                      {filters.categories.length + filters.developmentTypes.length + filters.organizations.length + filters.technologies.length}
                    </span>
                  )}
                </Button>
              </div>

              {showFilters && (
                <div className="mb-6">
                  <FilterPanel
                    filters={filters}
                    onFiltersChange={handleFiltersChange}
                    facets={facets}
                    hasActiveFilters={filters.categories.length > 0 || filters.developmentTypes.length > 0 || filters.organizations.length > 0 || filters.technologies.length > 0}
                    onClearAll={handleClearAll}
                  />
                </div>
              )}

              <div className="flex items-center justify-between mb-4">
                <p className="font-mono text-[11px] text-text-secondary">
                  Showing <span className="text-text-primary">{articles.length}</span> of <span className="text-text-primary">{total}</span> articles
                </p>
              </div>

              <ArticleGrid
                articles={articles}
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

              {articles.length === 0 && (
                <div className="text-center py-16">
                  <div className="mx-auto w-24 h-24 rounded-full bg-bg-raised flex items-center justify-center mb-4">
                    <Zap className="h-12 w-12 text-text-muted" />
                  </div>
                  <h2 className="font-display text-xl text-text-primary mb-2">No results found</h2>
                  <p className="text-text-secondary mb-6">
                    Try adjusting your search terms or filters.
                  </p>
                  <Button variant="outline" onClick={handleClearAll}>
                    Clear all filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-border bg-bg/80 backdrop-blur-sm">
        <div className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-text-secondary text-sm text-center">
            AI Intelligence Tracker &copy; {new Date().getFullYear()} &mdash; Automated AI news aggregation
          </p>
        </div>
      </footer>
    </div>
  );
}