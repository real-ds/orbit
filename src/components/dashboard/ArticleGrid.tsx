"use client";

import { Article } from "@/types";
import { ArticleCard } from "./ArticleCard";
import { cn } from "@/lib/utils";

interface ArticleGridProps {
  articles: Article[];
  onSaveToggle?: (articleId: string, saved: boolean) => void;
  savedArticles?: Set<string>;
  emptyMessage?: string;
  className?: string;
}

export function ArticleGrid({
  articles,
  onSaveToggle,
  savedArticles = new Set(),
  emptyMessage = "No articles found matching your criteria.",
  className = "",
}: ArticleGridProps) {
  if (articles.length === 0) {
    return (
      <div className={cn("py-16 text-center", className)}>
        <div className="mx-auto w-16 h-16 rounded-full bg-bg-raised flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p className="font-display text-xl text-text-primary mb-1">No articles found</p>
        <p className="text-text-secondary text-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <ul className={cn(
      "glue-grid blog-posts-grid__cards",
      "gap-6",
      className
    )} role="list">
      {articles.map((article) => (
        <li key={article.id} className="glue-grid__col glue-grid__col--span-4-lg glue-grid__col--span-12-md glue-grid__col--span-4-sm">
          <ArticleCard
            article={article}
            onSaveToggle={onSaveToggle}
            initiallySaved={savedArticles.has(article.id)}
          />
        </li>
      ))}
    </ul>
  );
}