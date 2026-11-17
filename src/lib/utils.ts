export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

const timeFormatter = new Intl.DateTimeFormat("en-US", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: "UTC",
});

const weekdayFormatter = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

export function formatDate(iso: string): string {
  return dateFormatter.format(new Date(iso));
}

export function formatTime(iso: string): string {
  return timeFormatter.format(new Date(iso));
}

export function formatDateTime(iso: string): string {
  return `${formatDate(iso)} · ${formatTime(iso)} UTC`;
}

export function formatLongDate(date: Date): string {
  return weekdayFormatter.format(date);
}

export function formatReads(reads: number): string {
  if (reads < 1000) return String(reads);
  return `${(reads / 1000).toFixed(1).replace(/\.0$/, "")}k`;
}

export function initialsOf(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function formatRelativeTime(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(iso);
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length).trim() + "...";
}

export function getCategorySlug(category: string): string {
  return category
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/&/g, "")
    .replace(/[^a-z0-9-]/g, "");
}

export function getCategoryHref(category: string): string {
  if (category === "All" || category === "all") return "/";
  return `/category/${getCategorySlug(category)}`;
}

export function formatDevelopmentType(type: string): string {
  return type
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export const CATEGORY_LIST = [
  "All",
  "AI Models",
  "Agentic AI",
  "Generative AI",
  "Machine Learning",
  "Deep Learning",
  "AI Research",
  "AI Infrastructure",
  "AI Frameworks & Tools",
  "AI Industry",
  "AI Applications",
  "AI Safety & Policy",
  "Other",
] as const;

export const DEVELOPMENT_TYPES = [
  "MODEL_RELEASE",
  "MODEL_UPDATE",
  "RESEARCH_PAPER",
  "FRAMEWORK_RELEASE",
  "BENCHMARK",
  "PRODUCT_LAUNCH",
  "FUNDING",
  "ACQUISITION",
  "PARTNERSHIP",
  "REGULATION",
  "OTHER",
] as const;

export function getCategoryColor(category: string): string {
  return "bg-bg-raised text-text-primary border-border";
}

export function getDevelopmentTypeColor(type: string): string {
  return "bg-bg-raised text-text-secondary border-border";
}

export function getTagTypeColor(type: string): string {
  return "bg-bg-raised text-text-secondary border-border";
}