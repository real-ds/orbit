"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Zap, GitBranch, MessageSquare, Mail, ArrowLeft, Clock, Database, Cpu, Brain, Shield, Globe, BookOpen } from "lucide-react";

export default function AboutPage() {
  const [latestRun, setLatestRun] = useState({ completedAt: "", articlesInserted: 25 });
  const [currentYear, setCurrentYear] = useState("");

  useEffect(() => {
    setLatestRun({ completedAt: new Date().toISOString(), articlesInserted: 25 });
    setCurrentYear(new Date().getFullYear().toString());
  }, []);

  return (
    <div className="min-h-screen bg-charcoal-900">
      <header className="border-b border-cream-0/10 bg-charcoal-900/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2" aria-label="AI Intelligence Tracker Home">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-royal-500 to-purple-600 flex items-center justify-center">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <span className="font-display text-xl text-cream-10">AI Intelligence Tracker</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="pt-12 lg:pt-16">
          <Link href="/" className="inline-flex items-center gap-2 text-cream-40 hover:text-royal-400 transition-colors mb-8">
            <ArrowLeft className="h-5 w-5" />
            Back to Dashboard
          </Link>

          <header className="mb-12 text-center">
            <div className="mx-auto w-24 h-24 rounded-2xl bg-gradient-to-br from-royal-500 to-purple-600 flex items-center justify-center mb-6">
              <Zap className="h-12 w-12 text-white" />
            </div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl leading-[1.05] tracking-[-0.02em] text-cream-10 mb-4">
              About AI Intelligence Tracker
            </h1>
            <p className="text-cream-40 text-lg max-w-2xl mx-auto leading-relaxed">
              An automated AI and technology news aggregation platform that discovers, processes, summarizes, and organizes recent developments in the artificial intelligence industry.
            </p>
          </header>

          <section className="mb-16">
            <h2 className="font-display text-2xl text-cream-10 mb-6">How It Works</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { icon: Globe, title: "Automated Discovery", description: "Scheduled Python worker runs every 48 hours, discovering articles from configured RSS feeds, APIs, and web sources published within the rolling last 48 hours." },
                { icon: Brain, title: "AI Processing", description: "Cloud LLM generates ~100-word summaries, classifies articles into categories, extracts technologies, organizations, and generates relevant tags." },
                { icon: Database, title: "Structured Storage", description: "Articles saved to Supabase PostgreSQL with full metadata, relationships, and full-text search vectors for fast querying." },
                { icon: Cpu, title: "Deduplication", description: "URL-based canonicalization and content hashing prevent duplicate articles while preserving separate coverage from different publishers." },
                { icon: Shield, title: "Verification & Attribution", description: "Every article retains original source attribution and link. No mandatory multi-source corroboration required." },
                { icon: BookOpen, title: "Public Dashboard", description: "Next.js frontend with search, filtering, pagination, and category/tag navigation for easy discovery." },
              ].map((item, i) => (
                <article key={i} className="bg-charcoal-800/50 border border-cream-0/10 rounded-2xl p-6 hover:border-cream-0/20 transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-royal-500/20 flex items-center justify-center mb-4">
                    <item.icon className="h-6 w-6 text-royal-400" />
                  </div>
                  <h3 className="font-display text-xl text-cream-10 mb-2">{item.title}</h3>
                  <p className="text-cream-40 leading-relaxed">{item.description}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="mb-16">
            <h2 className="font-display text-2xl text-cream-10 mb-6">Article Categories</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                "AI Models", "Agentic AI", "Generative AI", "Machine Learning", "Deep Learning", "AI Research",
                "AI Infrastructure", "AI Frameworks & Tools", "AI Industry", "AI Applications", "AI Safety & Policy", "Other"
              ].map((cat) => (
                <Link key={cat} href={`/category/${cat.toLowerCase().replace(/\s+/g, '-').replace('&', '')}`} className="bg-charcoal-800/50 border border-cream-0/10 rounded-xl p-4 hover:border-royal-500/50 hover:bg-royal-500/10 transition-all group">
                  <span className="font-medium text-cream-10 group-hover:text-royal-400">{cat}</span>
                </Link>
              ))}
            </div>
          </section>

          <section className="mb-16">
            <h2 className="font-display text-2xl text-cream-10 mb-6">Technical Stack</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { name: "Frontend", tech: "Next.js 16, React 19, TypeScript, Tailwind CSS v4" },
                { name: "Backend", tech: "Python 3.11, Supabase PostgreSQL, Row Level Security" },
                { name: "AI Processing", tech: "Cloud LLM API (OpenAI/Anthropic/Neon AI Gateway)" },
                { name: "Hosting", tech: "Vercel (Frontend), GitHub Actions / External Scheduler (Worker)" },
                { name: "Storage", tech: "Supabase Storage (Images), Supabase Database (Articles)" },
                { name: "Search", tech: "PostgreSQL Full-Text Search with GIN Indexes" },
                { name: "Scheduling", tech: "GitHub Actions Cron (Every 48 hours)" },
                { name: "Monitoring", tech: "Collection run logs, per-source metrics, error tracking" },
              ].map((item, i) => (
                <div key={i} className="bg-charcoal-800/50 border border-cream-0/10 rounded-2xl p-6">
                  <h3 className="font-display text-lg text-royal-400 mb-2">{item.name}</h3>
                  <p className="text-cream-40 text-sm">{item.tech}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-16">
            <h2 className="font-display text-2xl text-cream-10 mb-6">Collection Statistics</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="bg-charcoal-800/50 border border-cream-0/10 rounded-2xl p-6 text-center">
                <div className="font-display text-4xl text-royal-400 mb-1">{latestRun.articlesInserted}</div>
                <div className="text-cream-40 text-sm">Articles per Run (Max)</div>
              </div>
              <div className="bg-charcoal-800/50 border border-cream-0/10 rounded-2xl p-6 text-center">
                <div className="font-display text-4xl text-royal-400 mb-1">48h</div>
                <div className="text-cream-40 text-sm">Collection Interval</div>
              </div>
              <div className="bg-charcoal-800/50 border border-cream-0/10 rounded-2xl p-6 text-center">
                <div className="font-display text-4xl text-royal-400 mb-1">~100</div>
                <div className="text-cream-40 text-sm">Words per Summary</div>
              </div>
              <div className="bg-charcoal-800/50 border border-cream-0/10 rounded-2xl p-6 text-center">
                <div className="font-display text-4xl text-royal-400 mb-1">Indefinite</div>
                <div className="text-cream-40 text-sm">Historical Retention</div>
              </div>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="font-display text-2xl text-cream-10 mb-6">Privacy & Security</h2>
            <div className="space-y-4">
              {[
                "Public users can only read published articles and metadata — no write access",
                "Database writes restricted through Supabase Row Level Security policies",
                "Python worker uses privileged credentials stored in server-side environment variables only",
                "No secrets exposed in frontend code or client-side bundles",
                "Source URLs and extracted content validated before processing",
                "Image caching respects licensing and usage permissions",
                "No user authentication required for MVP — read-only public access",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-4 bg-charcoal-800/50 border border-cream-0/10 rounded-xl">
                  <Shield className="h-5 w-5 text-royal-400 flex-shrink-0 mt-0.5" />
                  <p className="text-cream-30">{item}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-16">
            <h2 className="font-display text-2xl text-cream-10 mb-6">Roadmap</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { title: "User Accounts", desc: "Personalized feeds, bookmarks, watchlists, and cross-device sync", status: "Planned" },
                { title: "Push Notifications", desc: "Real-time alerts for breaking AI news and specific topic matches", status: "Planned" },
                { title: "Semantic Search", desc: "Vector embeddings for similarity-based article discovery", status: "Research" },
                { title: "Article Clustering", desc: "Auto-group multiple articles covering the same development", status: "Planned" },
                { title: "API Access", desc: "Public REST API for developers to build on the dataset", status: "Planned" },
                { title: "Multi-language", desc: "Support for non-English AI news sources and translations", status: "Research" },
              ].map((item, i) => (
                <div key={i} className="bg-charcoal-800/50 border border-cream-0/10 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-display text-lg text-cream-10">{item.title}</h3>
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-royal-500/20 text-royal-400 border border-royal-500/30">
                      {item.status}
                    </span>
                  </div>
                  <p className="text-cream-40 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <footer className="border-t border-cream-0/10 pt-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-cream-40 text-sm">
                AI Intelligence Tracker &copy; {currentYear} &mdash; Automated AI news aggregation
              </p>
              <div className="flex items-center gap-4">
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-cream-40 hover:text-royal-400 transition-colors" aria-label="GitHub">
                  <GitBranch className="h-5 w-5" />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-cream-40 hover:text-royal-400 transition-colors" aria-label="Twitter">
                  <MessageSquare className="h-5 w-5" />
                </a>
                <a href="mailto:desk@theorbit.news" className="text-cream-40 hover:text-royal-400 transition-colors" aria-label="Email">
                  <Mail className="h-5 w-5" />
                </a>
              </div>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}