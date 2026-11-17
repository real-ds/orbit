"use client";

import { useParams } from "next/navigation";
import { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, Filter, Tag, Building2, Zap, Clock } from "lucide-react";
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

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  const category = slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, " ") as Category;

  const [filters, setFilters] = useState({
    search: "",
    categories: [category] as Category[],
    developmentTypes: [] as DevelopmentType[],
    organizations: [] as string[],
    technologies: [] as string[],
    dateFrom: null as string | null,
    dateTo: null as string | null,
    sort: "newest" as "newest" | "oldest" | "relevance",
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
      categories: [category],
      developmentTypes: [] as DevelopmentType[],
      organizations: [],
      technologies: [],
      dateFrom: null,
      dateTo: null,
      sort: "newest",
      page: 1,
      limit: 20,
    });
    setSelectedTags([]);
  }, [category]);

  const { data: articles, total, totalPages, facets } = useMemo(() => {
    return getArticlesPaginated(
      filters.page,
      filters.limit,
      {
        search: filters.search,
        categories: filters.categories,
        developmentTypes: filters.developmentTypes.length > 0 ? filters.developmentTypes : undefined,
        organizations: filters.organizations.length > 0 ? filters.organizations : undefined,
        technologies: filters.technologies.length > 0 ? filters.technologies : undefined,
      }
    );
  }, [filters.page, filters.limit, filters.search, filters.categories, filters.developmentTypes, filters.organizations, filters.technologies]);

  const topTags = useMemo(() => getTopTags(30), []);
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
              <div className="hidden sm:block w-72">
                <SearchBar
                  value={filters.search}
                  onChange={(v) => handleFiltersChange({ search: v })}
                  onSearch={handleSearch}
                  showFilters={true}
                  onFiltersClick={() => setShowFilters(!showFilters)}
                  filtersCount={filters.developmentTypes.length + filters.organizations.length + filters.technologies.length}
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
                    <Tag className="h-5 w-5 text-accent" />
                    <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-text-secondary">Category</span>
                  </div>
                  <Badge variant="outline" size="lg" className="text-text-primary border-border">
                    {category}
                  </Badge>
                  <p className="text-text-secondary text-sm mt-3">
                    {articles.length} articles in this category
                  </p>
                </div>

                <div className="bg-bg-elevated border border-border rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Tag className="h-5 w-5 text-accent" />
                    <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-text-secondary">Popular Tags</span>
                  </div>
                  <TagCloud
                    tags={topTags.filter(t => articles.some(a => a.tags.some(at => at.name === t.name)))}
                    selectedTags={selectedTags}
                    onTagToggle={handleTagToggle}
                    maxTags={15}
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
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="outline" size="lg" className="text-text-primary border-border">
                    {category}
                  </Badge>
                </div>
                <h1 className="font-display text-2xl sm:text-3xl text-text-primary mb-2">
                  {category}
                </h1>
                <p className="text-text-secondary text-sm">
                  {total} articles &mdash; Updated {latestRun?.completedAt ? formatRelativeTime(latestRun.completedAt) : "recently"}
                </p>
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
                  {(filters.developmentTypes.length + filters.organizations.length + filters.technologies.length) > 0 && (
                    <span className="ml-2 px-2 py-0.5 bg-accent text-white text-[10px] font-mono rounded-full">
                      {filters.developmentTypes.length + filters.organizations.length + filters.technologies.length}
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
                    hasActiveFilters={filters.developmentTypes.length > 0 || filters.organizations.length > 0 || filters.technologies.length > 0}
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