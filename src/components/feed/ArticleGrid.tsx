"use client";

import type { Article } from "@/types";
import { ArticleCard } from "./ArticleCard";

export interface ArticleGridProps {
  articles: Article[];
  layout?: "grid" | "list";
  emptyMessage?: string;
}

export function ArticleGrid({
  articles,
  layout = "grid",
  emptyMessage = "No articles match these filters.",
}: ArticleGridProps) {
  if (articles.length === 0) {
    return (
      <div className="empty">
        <p className="empty__title">Nothing here yet</p>
        <p className="empty__hint">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={`grid ${layout}`}>
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
}
