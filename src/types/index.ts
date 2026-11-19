export type Category =
  | 'AI Models'
  | 'Agentic AI'
  | 'Generative AI'
  | 'Machine Learning'
  | 'Deep Learning'
  | 'AI Research'
  | 'AI Infrastructure'
  | 'AI Frameworks & Tools'
  | 'AI Industry'
  | 'AI Applications'
  | 'AI Safety & Policy'
  | 'Other';

export type DevelopmentType =
  | 'MODEL_RELEASE'
  | 'MODEL_UPDATE'
  | 'RESEARCH_PAPER'
  | 'FRAMEWORK_RELEASE'
  | 'BENCHMARK'
  | 'PRODUCT_LAUNCH'
  | 'FUNDING'
  | 'ACQUISITION'
  | 'PARTNERSHIP'
  | 'REGULATION'
  | 'OTHER';

export type TagType =
  | 'technology'
  | 'organization'
  | 'model'
  | 'framework'
  | 'concept'
  | 'development_type';

export interface Tag {
  id: string;
  name: string;
  type: TagType;
  count?: number;
}

export interface Source {
  id: string;
  name: string;
  url: string;
  type: 'rss' | 'api' | 'html';
  category: string;
}

export interface ArticleMedia {
  id: string;
  url: string;
  altText: string;
  credit: string;
  width: number;
  height: number;
}

export interface Article {
  id: string;
  urlHash: string;
  canonicalUrl: string;
  originalUrl: string;
  headline: string;
  summary: string;
  keyTakeaways: string[];
  category: Category;
  subcategory: string | null;
  developmentType: DevelopmentType;
  technologies: string[];
  organizations: string[];
  tags: Tag[];
  publishedAt: string;
  collectedAt: string;
  sourceId: string;
  source: Source;
  media: ArticleMedia | null;
  metadata: Record<string, unknown>;
  editorsPick?: boolean;
  readMinutes?: number;
}

export interface CollectionRun {
  id: string;
  startedAt: string;
  completedAt: string | null;
  status: 'running' | 'completed' | 'failed' | 'partial';
  articlesDiscovered: number;
  articlesInserted: number;
  articlesDuplicated: number;
  articlesRejected: number;
  sourcesProcessed: number;
  sourcesFailed: number;
}

export interface CollectionRunSource {
  id: string;
  runId: string;
  sourceId: string;
  sourceName: string;
  status: 'success' | 'failed' | 'skipped';
  articlesFound: number;
  articlesNew: number;
  articlesDuplicate: number;
}

export interface FacetCount {
  name: string;
  count: number;
}

export interface ArticleFacets {
  categories: FacetCount[];
  developmentTypes: FacetCount[];
  organizations: FacetCount[];
  technologies: FacetCount[];
}

export interface PaginatedArticles {
  data: Article[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  facets: ArticleFacets;
}
