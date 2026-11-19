"use client";

import Link from "next/link";
import type { Article, Category } from "@/types";
import { CollectionActivity } from "@/components/sidebar/CollectionActivity";
import { countByCategory, countByTag } from "@/lib/articles";
import { categoryHref, categorySlug, tagHref } from "@/data/taxonomy";
import { CATEGORIES } from "@/data/taxonomy";

const MAX_TAGS = 14;

export interface FeedSidebarProps {
  articles: Article[];
  activeCategory?: Category | "All";
  activeTag?: string;
  collapsed: boolean;
  onToggle: () => void;
}

export function FeedSidebar({
  articles,
  activeCategory = "All",
  activeTag,
  collapsed,
  onToggle,
}: FeedSidebarProps) {
  const categoryCounts = countByCategory(articles);
  const tagCounts = countByTag(articles);

  const topTags = [...tagCounts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, MAX_TAGS);

  const total = articles.length;

  return (
    <aside className="side" aria-label="Categories and tags">
      <button
        type="button"
        className="tog"
        onClick={onToggle}
        aria-expanded={!collapsed}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <svg width="20" height="14" viewBox="0 0 20 14" aria-hidden="true">
          <path d="M0 1h20M0 7h20M0 13h20" stroke="currentColor" strokeWidth="2" fill="none" />
        </svg>
      </button>

      <div className="sidebody">
        <h3>Feed</h3>
        <Link
          className="si"
          href="/"
          aria-current={activeCategory === "All" && !activeTag ? "page" : undefined}
        >
          <span>All articles</span>
          <span className="n">{total}</span>
        </Link>

        {activeCategory !== "All" && (
          <Link className="si" href={categoryHref(activeCategory)} aria-current="page">
            <span>{activeCategory}</span>
            <span className="n">{categoryCounts.get(activeCategory) ?? 0}</span>
          </Link>
        )}

        {activeTag && (
          <Link className="si" href={tagHref(activeTag)} aria-current="page">
            <span>{activeTag}</span>
            <span className="n">{tagCounts.get(activeTag) ?? 0}</span>
          </Link>
        )}

        <h3>Categories</h3>
        {CATEGORIES.map((category) => {
          const count = categoryCounts.get(category) ?? 0;
          if (count === 0) return null;

          return (
            <Link
              key={category}
              className="si"
              href={`/category/${categorySlug(category)}`}
              aria-current={activeCategory === category ? "page" : undefined}
            >
              <span>{category}</span>
              <span className="n">{count}</span>
            </Link>
          );
        })}

        <h3>Tags</h3>
        {topTags.map(([tag, count]) => (
          <Link
            key={tag}
            className="si"
            href={tagHref(tag)}
            aria-current={activeTag === tag ? "page" : undefined}
          >
            <span>{tag}</span>
            <span className="n">{count}</span>
          </Link>
        ))}

        <CollectionActivity />
      </div>
    </aside>
  );
}
