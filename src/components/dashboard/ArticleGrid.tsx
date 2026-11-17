"use client";

"use client";

import { Article } from "@/types";
import { ArticleCard } from "./ArticleCard";
import { cn } from "@/lib/utils";

interface ArticleGridProps {
  articles: Article[];
  variant?: "default" | "compact" | "featured";
  onSaveToggle?: (articleId: string, saved: boolean) => void;
  savedArticles?: Set<string>;
  emptyMessage?: string;
  className?: string;
}

export function ArticleGrid({
  articles,
  variant = "default",
  onSaveToggle,
  savedArticles = new Set(),
  emptyMessage = "No articles found matching your criteria.",
  className = "",
}: ArticleGridProps) {
  if (articles.length === 0) {
    return (
      <div className={cn("py-16 text-center", className)}>
        <div className="mx-auto w-16 h-16 rounded-full bg-charcoal-800 flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-cream-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p className="font-display text-xl text-cream-10 mb-1">No articles found</p>
        <p className="text-cream-40 text-sm">{emptyMessage}</p>
      </div>
    );
  }

  if (variant === "featured") {
    const [featured, ...rest] = articles;
    return (
      <div className={className}>
        {featured && <ArticleCard article={featured} variant="featured" onSaveToggle={onSaveToggle} initiallySaved={savedArticles.has(featured.id)} />}
        {rest.length > 0 && (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {rest.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                variant="default"
                onSaveToggle={onSaveToggle}
                initiallySaved={savedArticles.has(article.id)}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div className={cn("space-y-3", className)}>
        {articles.map((article) => (
          <ArticleCard
            key={article.id}
            article={article}
            variant="compact"
            onSaveToggle={onSaveToggle}
            initiallySaved={savedArticles.has(article.id)}
          />
        ))}
      </div>
    );
  }

  return (
    <div className={cn("grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4", className)}>
      {articles.map((article) => (
        <ArticleCard
          key={article.id}
          article={article}
          variant="default"
          onSaveToggle={onSaveToggle}
          initiallySaved={savedArticles.has(article.id)}
        />
      ))}
</div>
    );
  }