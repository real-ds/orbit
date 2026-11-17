export type TopicId =
  | "models"
  | "agents"
  | "ml"
  | "research"
  | "infra"
  | "hardware"
  | "policy"
  | "startups";

export type VisualTone = 1 | 2 | 3 | 4;

export type VisualMotif = "orbit" | "grid" | "wave" | "pulse";

export type Topic = {
  id: TopicId;
  label: string;
  blurb: string;
};

export type Author = {
  id: string;
  name: string;
  role: string;
  initials: string;
  bio: string;
  based: string;
};

export type StoryBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string; id: string }
  | { type: "quote"; text: string; attribution?: string }
  | { type: "list"; items: string[]; ordered?: boolean }
  | { type: "code"; language: string; code: string }
  | { type: "callout"; title: string; body: string };

export type Story = {
  slug: string;
  title: string;
  dek: string;
  topicId: TopicId;
  tags: string[];
  authorId: string;
  publishedAt: string;
  readMinutes: number;
  reads: number;
  editorsPick?: boolean;
  featured?: boolean;
  trendingRank?: number;
  visual: {
    tone: VisualTone;
    motif: VisualMotif;
  };
  takeaways: string[];
  body: StoryBlock[];
};

export type Brief = {
  id: string;
  text: string;
  source: string;
  time: string;
};

export type MarketItem = {
  symbol: string;
  name: string;
  change: string;
  direction: "up" | "down";
};