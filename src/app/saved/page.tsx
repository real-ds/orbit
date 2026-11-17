"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Zap, Bookmark, BookmarkCheck, Clock, Building2, ArrowLeft, Filter, X } from "lucide-react";
import { Article } from "@/types";
import { ArticleGrid } from "@/components/dashboard/ArticleGrid";
import { SearchBar } from "@/components/dashboard/SearchBar";
import { TagCloud } from "@/components/dashboard/TagCloud";
import { Pagination } from "@/components/dashboard/Pagination";
import { SortSelect } from "@/components/dashboard/SortSelect";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { dummyArticles, getArticlesPaginated, getTopTags } from "@/data/dummy";
import { formatRelativeTime, getCategoryColor, getDevelopmentTypeColor, formatDevelopmentType, getTagTypeColor } from "@/lib/utils";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "ai-tracker-saved-articles";

export default function SavedPage() {
  const [savedArticleIds, setSavedArticleIds] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState({
    search: "",
    sort: "newest" as "newest" | "oldest" | "relevance",
    page: 1,
    limit: 20,
  });
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setSavedArticleIds(new Set(JSON.parse(stored)));
      } catch {
        setSavedArticleIds(new Set());
      }
    }
  }, []);

  const savedArticles = dummyArticles.filter((a) => savedArticleIds.has(a.id));

  const handleSaveToggle = (articleId: string, saved: boolean) => {
    const newSaved = new Set(savedArticleIds);
    if (saved) {
      newSaved.add(articleId);
    } else {
      newSaved.delete(articleId);
    }
    setSavedArticleIds(newSaved);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(newSaved)));
  };

  const handleSearch = (value: string) => {
    setFilters((prev) => ({ ...prev, search: value, page: 1 }));
  };

  const handleTagToggle = (tagName: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagName) ? prev.filter((t) => t !== tagName) : [...prev, tagName]
    );
  };

  const { data: articles, total, totalPages } = getArticlesPaginated(
    filters.page,
    filters.limit,
    {
      search: filters.search,
    }
  );

  const filteredArticles = articles.filter((a) => savedArticleIds.has(a.id));

  const topTags = getTopTags(30);

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
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:block w-72">
                <SearchBar
                  value={filters.search}
                  onChange={(v) => setFilters((prev) => ({ ...prev, search: v }))}
                  onSearch={handleSearch}
                  placeholder="Search saved articles..."
                  showFilters={false}
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
                <div className="bg-charcoal-800/50 border border-cream-0/10 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <BookmarkCheck className="h-5 w-5 text-royal-400" />
                    <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-cream-20">Saved Articles</span>
                  </div>
                  <p className="font-display text-3xl text-cream-10 mb-1">{savedArticleIds.size}</p>
                  <p className="text-cream-40 text-sm">articles in your library</p>
                </div>

                <div className="bg-charcoal-800/50 border border-cream-0/10 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Filter className="h-5 w-5 text-royal-400" />
                    <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-cream-20">Popular Tags</span>
                  </div>
                  <TagCloud
                    tags={topTags.filter(t => savedArticles.some(a => a.tags.some(at => at.name === t.name)))}
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
                <Link href="/" className="inline-flex items-center gap-2 text-cream-40 hover:text-royal-400 transition-colors mb-4">
                  <ArrowLeft className="h-5 w-5" />
                  Back to Dashboard
                </Link>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-royal-500/20 flex items-center justify-center">
                    <BookmarkCheck className="h-5 w-5 text-royal-400" />
                  </div>
                  <div>
                    <h1 className="font-display text-2xl sm:text-3xl text-cream-10">Saved Articles</h1>
                    <p className="text-cream-40 text-sm">{savedArticleIds.size} articles saved locally</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <SortSelect value={filters.sort} onChange={(v) => setFilters((prev) => ({ ...prev, sort: v }))} />
              </div>

              {filteredArticles.length === 0 ? (
                <div className="text-center py-16">
                  <div className="mx-auto w-24 h-24 rounded-full bg-charcoal-800 flex items-center justify-center mb-4">
                    <Bookmark className="h-12 w-12 text-cream-30" />
                  </div>
                  <h2 className="font-display text-xl text-cream-10 mb-2">No saved articles yet</h2>
                  <p className="text-cream-40 mb-6">
                    Browse the dashboard and click the bookmark icon on any article to save it here.
                  </p>
                  <Link href="/" className="inline-flex items-center gap-2 bg-royal-600 text-white px-6 py-3 rounded-xl hover:bg-royal-500 transition-colors">
                    <Zap className="h-5 w-5" />
                    Explore Articles
                  </Link>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <p className="font-mono text-[11px] text-cream-40">
                      Showing <span className="text-cream-10">{filteredArticles.length}</span> of <span className="text-cream-10">{savedArticleIds.size}</span> saved articles
                    </p>
                  </div>

                  <ArticleGrid
                    articles={filteredArticles}
                    onSaveToggle={handleSaveToggle}
                    savedArticles={savedArticleIds}
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
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-cream-0/10 bg-charcoal-900/80 backdrop-blur-sm">
        <div className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-cream-40 text-sm text-center">
            AI Intelligence Tracker &copy; {new Date().getFullYear()} &mdash; Automated AI news aggregation
          </p>
        </div>
      </footer>
    </div>
  );
}