"use client";

import Image from "next/image";
import Link from "next/link";
import { Bookmark, ExternalLink, Clock, Tag, Building2, Zap } from "lucide-react";
import { useState } from "react";
import { Article } from "@/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatRelativeTime, truncate, getCategoryColor, getDevelopmentTypeColor, formatDevelopmentType, getTagTypeColor, cn } from "@/lib/utils";

interface ArticleCardProps {
  article: Article;
  variant?: "default" | "compact" | "featured";
  onSaveToggle?: (articleId: string, saved: boolean) => void;
  initiallySaved?: boolean;
}

export function ArticleCard({ article, variant = "default", onSaveToggle, initiallySaved = false }: ArticleCardProps) {
  const [saved, setSaved] = useState(initiallySaved);

  const handleSaveToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newSaved = !saved;
    setSaved(newSaved);
    onSaveToggle?.(article.id, newSaved);
  };

  const categoryColor = getCategoryColor(article.category);
  const devTypeColor = getDevelopmentTypeColor(article.developmentType);

  if (variant === "compact") {
    return (
      <Link href={`/article/${article.urlHash}`} className="block">
        <Card variant="outlined" padding="sm" hover className="h-full">
          <div className="flex gap-3">
            {article.media && (
              <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-charcoal-700">
                <Image
                  src={article.media.url}
                  alt={article.media.altText}
                  fill
                  sizes="80px"
                  className="object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
            )}
            <div className="flex-1 min-w-0 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <Badge variant="category" className={categoryColor} size="sm">
                    {article.category}
                  </Badge>
                  <Badge variant="development" className={devTypeColor} size="sm">
                    {formatDevelopmentType(article.developmentType)}
                  </Badge>
                </div>
                <h3 className="font-display text-cream-10 text-base leading-snug line-clamp-2 transition-colors hover:text-royal-400">
                  {article.headline}
                </h3>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-cream-45 mt-2">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatRelativeTime(article.publishedAt)}
                </span>
                <span className="flex items-center gap-1">
                  <Building2 className="h-3 w-3" />
                  {article.source.name}
                </span>
              </div>
            </div>
          </div>
        </Card>
      </Link>
    );
  }

  if (variant === "featured") {
    return (
      <article className="group">
        <Link href={`/article/${article.urlHash}`} className="block">
          {article.media && (
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden mb-4 bg-charcoal-800">
              <Image
                src={article.media.url}
                alt={article.media.altText}
                fill
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2">
                <Badge variant="category" className={categoryColor}>
                  {article.category}
                </Badge>
                <Badge variant="development" className={devTypeColor}>
                  {formatDevelopmentType(article.developmentType)}
                </Badge>
              </div>
            </div>
          )}
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <Badge variant="category" className={categoryColor}>
              {article.category}
            </Badge>
            <Badge variant="development" className={devTypeColor}>
              {formatDevelopmentType(article.developmentType)}
            </Badge>
            {article.subcategory && (
              <Badge variant="tag" className="bg-charcoal-700 text-cream-40 border-cream-0/10">
                {article.subcategory}
              </Badge>
            )}
          </div>
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl leading-tight text-cream-10 mb-3 group-hover:text-royal-400 transition-colors">
            {article.headline}
          </h2>
          <p className="text-cream-30 text-base leading-relaxed mb-4 line-clamp-3">
            {article.summary}
          </p>
          {article.keyTakeaways.length > 0 && (
            <div className="mb-4 space-y-1.5">
              {article.keyTakeaways.slice(0, 3).map((takeaway, i) => (
                <div key={i} className="flex items-start gap-2 text-cream-40 text-sm">
                  <Zap className="h-3.5 w-3.5 text-royal-400 flex-shrink-0 mt-0.5" />
                  <span>{takeaway}</span>
                </div>
              ))}
            </div>
          )}
        </Link>
        <CardFooter className="bg-transparent border-t border-cream-0/10 px-0">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 text-[11px] text-cream-45">
              <Clock className="h-3 w-3" />
              <time dateTime={article.publishedAt}>{formatRelativeTime(article.publishedAt)}</time>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-cream-45">
              <Building2 className="h-3 w-3" />
              <span>{article.source.name}</span>
            </div>
            <div className="flex-1" />
            <Button variant="ghost" size="sm" onClick={handleSaveToggle} aria-label={saved ? "Remove from saved" : "Save article"}>
              <Bookmark className={cn("h-4 w-4", saved && "fill-royal-500 text-royal-500")} />
            </Button>
            <Link href={article.canonicalUrl} target="_blank" rel="noopener noreferrer" aria-label="Read original article">
              <Button variant="ghost" size="icon" className="text-cream-40 hover:text-royal-400">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardFooter>
      </article>
    );
  }

  return (
    <article className="group">
      <Link href={`/article/${article.urlHash}`} className="block h-full">
        <Card variant="default" padding="md" hover className="h-full flex flex-col">
          {article.media && (
            <div className="relative aspect-video w-full rounded-xl overflow-hidden mb-4 bg-charcoal-700 -mx-5 -mt-5 mb-0">
              <Image
                src={article.media.url}
                alt={article.media.altText}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
                <Badge variant="category" className={categoryColor} size="sm">
                  {article.category}
                </Badge>
                <Badge variant="development" className={devTypeColor} size="sm">
                  {formatDevelopmentType(article.developmentType)}
                </Badge>
              </div>
            </div>
          )}

          <div className="flex-1 flex flex-col">
            <div className="flex items-center gap-2 mb-2.5 flex-wrap">
              {article.media ? null : (
                <>
                  <Badge variant="category" className={categoryColor} size="sm">
                    {article.category}
                  </Badge>
                  <Badge variant="development" className={devTypeColor} size="sm">
                    {formatDevelopmentType(article.developmentType)}
                  </Badge>
                </>
              )}
              {article.subcategory && (
                <Badge variant="tag" className="bg-charcoal-700 text-cream-40 border-cream-0/10" size="sm">
                  {article.subcategory}
                </Badge>
              )}
            </div>

            <h3 className="font-display text-xl leading-snug text-cream-10 mb-3 line-clamp-2 group-hover:text-royal-400 transition-colors">
              {article.headline}
            </h3>

            <p className="text-cream-40 text-sm leading-relaxed mb-4 flex-1 line-clamp-3">
              {truncate(article.summary, 200)}
            </p>

            {article.keyTakeaways.length > 0 && (
              <div className="mb-4 space-y-1.5 border-t border-cream-0/10 pt-3">
                <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-cream-45 mb-2">Key takeaways</p>
                {article.keyTakeaways.slice(0, 2).map((takeaway, i) => (
                  <div key={i} className="flex items-start gap-2 text-cream-40 text-sm">
                    <Zap className="h-3.5 w-3.5 text-royal-400 flex-shrink-0 mt-0.5" />
                    <span className="line-clamp-1">{takeaway}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-wrap gap-1.5 mt-auto pt-3 border-t border-cream-0/10">
              {article.technologies.slice(0, 4).map((tech) => (
                <Badge key={tech} variant="tag" className={getTagTypeColor("technology")} size="sm">
                  {tech}
                </Badge>
              ))}
              {article.technologies.length > 4 && (
                <Badge variant="outline" size="sm" className="text-cream-45">
                  +{article.technologies.length - 4}
                </Badge>
              )}
            </div>
          </div>
        </Card>
      </Link>
      <CardFooter className="bg-transparent border-t border-cream-0/10 px-0 mt-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-[11px] text-cream-45">
            <Clock className="h-3 w-3" />
            <time dateTime={article.publishedAt}>{formatRelativeTime(article.publishedAt)}</time>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-cream-45">
            <Building2 className="h-3 w-3" />
            <span>{article.source.name}</span>
          </div>
          <div className="flex-1" />
          <Button variant="ghost" size="sm" onClick={handleSaveToggle} aria-label={saved ? "Remove from saved" : "Save article"}>
            <Bookmark className={cn("h-4 w-4", saved && "fill-royal-500 text-royal-500")} />
          </Button>
          <Link href={article.canonicalUrl} target="_blank" rel="noopener noreferrer" aria-label="Read original article">
            <Button variant="ghost" size="icon" className="text-cream-40 hover:text-royal-400">
              <ExternalLink className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardFooter>
    </article>
  );
}