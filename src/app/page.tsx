"use client";

import { useState, useCallback, useMemo } from "react";
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
import { formatRelativeTime, getCategoryHref } from "@/lib/utils";
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
    <div className="min-h-screen bg-bg">
      <main className="mx-auto w-full max-w-[1600px] px-4 pb-12 sm:px-6 lg:px-8">
        <div className="pt-8 lg:pt-10">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            <aside className="lg:w-[255px] flex-shrink-0 hidden lg:block">
              <div className="sticky top-[88px] space-y-6 max-h-[calc(100vh-160px)] overflow-y-auto no-scrollbar">
                {/* Latest Collection - clean editorial style */}
                <div className="space-y-4">
                  <h2 className="font-semibold text-[13px] uppercase tracking-[0.1em] text-text-secondary mb-4">
                    LATEST COLLECTION
                  </h2>
                  <dl className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <dt className="text-text-secondary">Status</dt>
                      <dd className={cn(
                        "font-sans text-sm px-2 py-0.5 rounded",
                        latestRun?.status === "completed"
                          ? "text-accent bg-accent-subtle"
                          : "text-text-secondary bg-bg-raised"
                      )}>
                        {latestRun?.status ?? "Unknown"}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-text-secondary">Articles Added</dt>
                      <dd className="font-sans text-text-primary">{latestRun?.articlesInserted || 0}</dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-text-secondary">Duplicates Skipped</dt>
                      <dd className="font-sans text-text-primary">{latestRun?.articlesDuplicated || 0}</dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-text-secondary">Sources Processed</dt>
                      <dd className="font-sans text-text-primary">
                        {latestRun?.sourcesProcessed || 0}/{latestRun?.sourcesProcessed ? latestRun.sourcesProcessed + (latestRun.sourcesFailed || 0) : 0}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-text-secondary">Last Run</dt>
                      <dd className="font-sans text-text-primary">
                        {latestRun?.completedAt ? formatRelativeTime(latestRun.completedAt) : "Never"}
                      </dd>
                    </div>
                  </dl>
                </div>

                {/* Category Navigation - clean sidebar */}
                <CategoryNav
                  activeCategory={activeCategory}
                  onCategoryChange={handleCategoryChange}
                  counts={categoryCounts.reduce((acc, { category, count }) => ({ ...acc, [category]: count }), {} as Record<Category, number>)}
                  variant="sidebar"
                />

                {/* Trending Tags */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-[13px] uppercase tracking-[0.1em] text-text-secondary mb-3">
                    TRENDING TAGS
                  </h3>
                  <TagCloud
                    tags={topTags.filter(t => articles.some(a => a.tags.some(at => at.name === t.name)))}
                    selectedTags={selectedTags}
                    onTagToggle={handleTagToggle}
                    maxTags={16}
                    variant="bento"
                  />
                </div>
              </div>
            </aside>

            <div className="flex-1 min-w-0">
              <header className="mb-8">
                <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl text-text-primary mb-1.5">
                  Latest AI Developments
                </h1>
                <p className="text-text-secondary text-sm lg:text-base">
                  Track the latest AI research, model releases, and industry news
                </p>

                <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <SortSelect value={filters.sort} onChange={(v) => handleFiltersChange({ sort: v })} />
                </div>

                {hasActiveFilters && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {filters.categories.map((cat) => (
                      <span key={`cat-${cat}`} className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium bg-accent-subtle text-accent border border-accent/30 rounded-lg">
                        {cat} <span className="ml-1 hover:text-text-primary cursor-pointer" onClick={() => handleFiltersChange({ categories: filters.categories.filter((c) => c !== cat) })}>✕</span>
                      </span>
                    ))}
                    {filters.developmentTypes.map((dt) => (
                      <span key={`dt-${dt}`} className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium bg-accent-subtle text-accent border border-accent/30 rounded-lg">
                        {dt.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())} <span className="ml-1 hover:text-text-primary cursor-pointer" onClick={() => handleFiltersChange({ developmentTypes: filters.developmentTypes.filter((d) => d !== dt) })}>✕</span>
                      </span>
                    ))}
                    {filters.organizations.map((org) => (
                      <span key={`org-${org}`} className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium bg-accent-subtle text-accent border border-accent/30 rounded-lg">
                        {org} <span className="ml-1 hover:text-text-primary cursor-pointer" onClick={() => handleFiltersChange({ organizations: filters.organizations.filter((o) => o !== org) })}>✕</span>
                      </span>
                    ))}
                    {filters.technologies.map((tech) => (
                      <span key={`tech-${tech}`} className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium bg-accent-subtle text-accent border border-accent/30 rounded-lg">
                        {tech} <span className="ml-1 hover:text-text-primary cursor-pointer" onClick={() => handleFiltersChange({ technologies: filters.technologies.filter((t) => t !== tech) })}>✕</span>
                      </span>
                    ))}
                    {filters.dateFrom && (
                      <span key="date-from" className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium bg-accent-subtle text-accent border border-accent/30 rounded-lg">
                        From: {filters.dateFrom} <span className="ml-1 hover:text-text-primary cursor-pointer" onClick={() => handleFiltersChange({ dateFrom: null })}>✕</span>
                      </span>
                    )}
                    {filters.dateTo && (
                      <span key="date-to" className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium bg-accent-subtle text-accent border border-accent/30 rounded-lg">
                        To: {filters.dateTo} <span className="ml-1 hover:text-text-primary cursor-pointer" onClick={() => handleFiltersChange({ dateTo: null })}>✕</span>
                      </span>
                    )}
                  </div>
                )}

              </header>

              <div className="flex items-center justify-between mb-6">
                <p className="font-sans text-[11px] text-text-secondary">
                  Showing <span className="text-text-primary">{articles.length}</span> of <span className="text-text-primary">{total}</span> articles
                </p>
              </div>

              <ArticleGrid
                articles={articles}
                onSaveToggle={(id, saved) => console.log("Save toggle:", id, saved)}
              />

              {totalPages > 1 && (
                <div className="mt-10">
                  <Pagination
                    currentPage={filters.page}
                    totalPages={totalPages}
                    onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
                  />
                </div>
              )}

              {articles.length === 0 && !filters.search && !hasActiveFilters && (
                <div className="text-center py-16">
                  <div className="mx-auto w-24 h-24 rounded-full bg-bg-raised flex items-center justify-center mb-4">
                    <svg className="w-12 h-12 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h2 className="font-display text-xl text-text-primary mb-2">No articles yet</h2>
                  <p className="text-text-secondary mb-6">The collection worker hasn't run yet. Check back soon!</p>
                  <button className="px-4 py-2 bg-accent text-white rounded-xl hover:bg-accent-hover transition-colors" onClick={() => handleFiltersChange({ page: 1 })}>
                    Refresh
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-border bg-bg/80 backdrop-blur-sm mt-auto">
        <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-text-secondary text-sm">
              AI Intelligence Tracker &copy; {new Date().getFullYear()} &mdash; Automated AI news aggregation
            </p>
            <div className="flex items-center gap-4 text-sm text-text-secondary">
              <span>Updated {latestRun?.completedAt ? formatRelativeTime(latestRun.completedAt) : "recently"}</span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-accent" />
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