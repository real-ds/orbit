"use client";

import Link from "next/link";
import { ArticleGrid } from "@/components/feed/ArticleGrid";
import { useSavedArticles } from "@/lib/saved-store";
import { dummyArticles } from "@/data/dummy";

export default function SavedPage() {
  const { ids, ready } = useSavedArticles();
  const savedArticles = dummyArticles.filter((article) => ids.includes(article.id));

  if (!ready) {
    return <div className="loading">Loading saved articles…</div>;
  }

  if (savedArticles.length === 0) {
    return (
      <div className="saved-empty">
        <h1>No saved articles</h1>
        <p>Use the <strong>Save</strong> button on any article to keep it here. Saved articles stay in this browser only.</p>
        <Link className="btn" href="/">
          Browse the latest
        </Link>
      </div>
    );
  }

  return (
    <>
      <ArticleGrid
        articles={savedArticles}
        emptyMessage="Saved articles will appear here."
      />
    </>
  );
}
