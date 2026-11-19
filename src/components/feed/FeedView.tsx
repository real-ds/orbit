"use client";

import Link from "next/link";
import { useCallback, useMemo, useState, type ReactNode } from "react";
import type { Article, Category } from "@/types";
import { ArticleGrid } from "./ArticleGrid";
import { FeedSidebar } from "./FeedSidebar";
import { FilterPanel } from "./FilterPanel";
import { Pagination } from "./Pagination";
import { Button } from "@/components/ui/button";
import {
  distinctOrganizations,
  distinctTagNames,
  filterArticles,
  paginate,
  sortArticles,
  type SortKey,
} from "@/lib/articles";
import { useSidebarCollapsed, useToggleSidebar } from "@/lib/sidebar-store";
import { CATEGORIES, categoryHref } from "@/data/taxonomy";

const PAGE_SIZE = 9;

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "relevance", label: "Relevance" },
];

export interface FeedViewProps {
  articles: Article[];
  /** Category taken from the current route. */
  activeCategory?: Category | "All";
  /** Tag taken from the current route. */
  activeTag?: string;
  /** Query taken from the current route (`?q=`). */
  initialQuery?: string;
  /** Rendered above the search field. */
  header?: ReactNode;
  /** Hides the category tab bar. */
  hideCategoryTabs?: boolean;
  emptyMessage?: string;
}

export function FeedView({
  articles,
  activeCategory = "All",
  activeTag,
  initialQuery = "",
  header,
  hideCategoryTabs = false,
  emptyMessage,
}: FeedViewProps) {
  const collapsed = useSidebarCollapsed();
  const toggleSidebar = useToggleSidebar();

  const [query, setQuery] = useState(initialQuery);
  const [developmentType, setDevelopmentType] = useState("");
  const [organization, setOrganization] = useState("");
  const [tag, setTag] = useState("");
  const [sort, setSort] = useState<SortKey>(initialQuery ? "relevance" : "newest");
  const [page, setPage] = useState(1);
  const [layout, setLayout] = useState<"grid" | "list">("grid");
  const [panelOpen, setPanelOpen] = useState(false);

  const organizationOptions = useMemo(() => distinctOrganizations(articles), [articles]);
  const tagOptions = useMemo(() => distinctTagNames(articles), [articles]);

  const filtered = useMemo(() => {
    // The route may already constrain by tag; the panel can narrow further.
    const routeTags = [activeTag, tag].filter((value): value is string => Boolean(value));

    const result = filterArticles(articles, {
      categories: activeCategory !== "All" ? [activeCategory] : undefined,
      developmentTypes: developmentType ? [developmentType] : undefined,
      organizations: organization ? [organization] : undefined,
      technologies: undefined,
      tags: routeTags.length > 0 ? routeTags : undefined,
      search: query,
    });

    return sortArticles(result, sort, query);
  }, [articles, activeCategory, activeTag, tag, developmentType, organization, query, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const visible = useMemo(
    () => paginate(filtered, safePage, PAGE_SIZE),
    [filtered, safePage],
  );

  /** Keep the query shareable without triggering a Next.js navigation. */
  const syncQueryToUrl = useCallback((value: string) => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    if (value) url.searchParams.set("q", value);
    else url.searchParams.delete("q");
    window.history.replaceState(null, "", url.toString());
  }, []);

  const handleQueryChange = useCallback(
    (value: string) => {
      setQuery(value);
      setPage(1);
      syncQueryToUrl(value);
    },
    [syncQueryToUrl],
  );

  const handleFilterChange = useCallback(
    (key: "developmentType" | "organization" | "tag", value: string) => {
      if (key === "developmentType") setDevelopmentType(value);
      if (key === "organization") setOrganization(value);
      if (key === "tag") setTag(value);
      setPage(1);
    },
    [],
  );

  const handleClear = useCallback(() => {
    setQuery("");
    setDevelopmentType("");
    setOrganization("");
    setTag("");
    setPage(1);
    syncQueryToUrl("");
  }, [syncQueryToUrl]);

  const hasActiveFilters =
    Boolean(query) || Boolean(developmentType) || Boolean(organization) || Boolean(tag);

  return (
    <div className={`dash${collapsed ? " collapsed" : ""}`}>
      <FeedSidebar
        articles={articles}
        activeCategory={activeCategory}
        activeTag={activeTag}
        collapsed={collapsed}
        onToggle={toggleSidebar}
      />

      <section className="feed">
        {header}

        <div className="search">
          <input
            id="feed-search"
            type="search"
            placeholder="Search articles, models, companies"
            value={query}
            aria-label="Search articles"
            onChange={(event) => handleQueryChange(event.target.value)}
          />
        </div>

        {!hideCategoryTabs && (
          <nav className="tabs" aria-label="Article categories">
            <Link href="/" aria-current={activeCategory === "All" && !activeTag ? "true" : undefined}>
              All
            </Link>
            {CATEGORIES.map((category) => (
              <Link
                key={category}
                href={categoryHref(category)}
                aria-current={activeCategory === category ? "true" : undefined}
              >
                {category}
              </Link>
            ))}
          </nav>
        )}

        <div className="tools">
          <span className="count">
            {filtered.length} {filtered.length === 1 ? "article" : "articles"}
          </span>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setPanelOpen((open) => !open)}
            aria-expanded={panelOpen}
            aria-controls="feed-filters"
          >
            Filter
          </Button>

          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={handleClear}>
              Clear filters
            </Button>
          )}

          <select
            className="ui-select ui-select--inline"
            aria-label="Sort articles"
            value={sort}
            onChange={(event) => {
              setSort(event.target.value as SortKey);
              setPage(1);
            }}
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <div className="seg" role="group" aria-label="Layout">
            <button
              type="button"
              onClick={() => setLayout("grid")}
              aria-pressed={layout === "grid"}
              aria-label="Grid view"
            >
              Grid
            </button>
            <button
              type="button"
              onClick={() => setLayout("list")}
              aria-pressed={layout === "list"}
              aria-label="List view"
            >
              List
            </button>
          </div>
        </div>

        <div id="feed-filters" className={`panel${panelOpen ? " is-open" : ""}`}>
          <FilterPanel
            developmentTypes={[...new Set(articles.map((article) => article.developmentType))]}
            organizations={organizationOptions}
            tags={tagOptions}
            developmentType={developmentType}
            organization={organization}
            tag={tag}
            onChange={handleFilterChange}
          />
        </div>

        <ArticleGrid
          articles={visible}
          layout={layout}
          emptyMessage={
            emptyMessage ??
            (hasActiveFilters ? "Try clearing a filter or searching for something else." : undefined)
          }
        />

        <Pagination
          page={safePage}
          totalPages={totalPages}
          onChange={(nextPage) => {
            setPage(nextPage);
            if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      </section>
    </div>
  );
}
