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

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(iso);
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length).trim() + '...';
}

export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    'AI Models': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    'Agentic AI': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    'Generative AI': 'bg-pink-500/20 text-pink-400 border-pink-500/30',
    'Machine Learning': 'bg-green-500/20 text-green-400 border-green-500/30',
    'Deep Learning': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    'AI Research': 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    'AI Infrastructure': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    'AI Frameworks & Tools': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    'AI Industry': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    'AI Applications': 'bg-rose-500/20 text-rose-400 border-rose-500/30',
    'AI Safety & Policy': 'bg-red-500/20 text-red-400 border-red-500/30',
    'Other': 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  };
  return colors[category] || colors['Other'];
}

export function getDevelopmentTypeColor(type: string): string {
  const colors: Record<string, string> = {
    'MODEL_RELEASE': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    'MODEL_UPDATE': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    'RESEARCH_PAPER': 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    'FRAMEWORK_RELEASE': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    'BENCHMARK': 'bg-green-500/20 text-green-400 border-green-500/30',
    'PRODUCT_LAUNCH': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    'FUNDING': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    'ACQUISITION': 'bg-red-500/20 text-red-400 border-red-500/30',
    'PARTNERSHIP': 'bg-pink-500/20 text-pink-400 border-pink-500/30',
    'REGULATION': 'bg-red-500/20 text-red-400 border-red-500/30',
    'OTHER': 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  };
  return colors[type] || colors['OTHER'];
}

export function formatDevelopmentType(type: string): string {
  return type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
}

export function getTagTypeColor(type: string): string {
  const colors: Record<string, string> = {
    'technology': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    'organization': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    'model': 'bg-green-500/20 text-green-400 border-green-500/30',
    'framework': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    'concept': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    'development_type': 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
  };
  return colors[type] || colors['concept'];
}