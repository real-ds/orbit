import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CATEGORIES, categoryHref } from "@/data/taxonomy";

export const metadata: Metadata = {
  title: "About",
  description: "How Orbit collects, summarises and classifies AI news every 48 hours.",
};

const STEPS = [
  {
    number: "01",
    title: "Discover",
    body: "A scheduled collector gathers the last 48 hours of coverage from configured RSS feeds, APIs and publisher pages.",
  },
  {
    number: "02",
    title: "Understand",
    body: "Each story gets a concise summary, a category, a development type and tags for the models, organisations and ideas involved.",
  },
  {
    number: "03",
    title: "Connect",
    body: "Duplicate URLs are merged, separate reporting is kept, and every item links straight back to its original publisher.",
  },
];

export default function AboutPage() {
  return (
    <article className="about">
      <header className="about-hero">
        <div className="about-hero__inner">
          <p className="about-hero__eyebrow">About Orbit</p>
          <h1 className="about-hero__title">
            <span className="about-hero__type">AI, in focus.</span>
          </h1>
          <p className="about-hero__tagline">
            A calmer way to track the models, research and industry moves shaping what comes next.
          </p>
        </div>
      </header>

      <section className="about-band about-band--inverse" id="mission">
        <div className="wrap about-band__inner">
          <p className="about-band__index">01 / Why Orbit</p>

          <div className="about-band__grid">
            <h2 className="about-band__title">Clear signal, less noise.</h2>
            <div className="about-band__copy">
              <p>
                Orbit is an independent AI news desk for people who want the story without the
                scroll. We collect recent developments, summarise them in plain language and keep
                the source one click away.
              </p>
              <p>
                Instead of another endless feed, you get a compact, classified record of what
                changed in AI — and why it matters.
              </p>
            </div>
          </div>

          <dl className="about-band__facts">
            <div className="about-band__fact">
              <dt>Cadence</dt>
              <dd>Every 48 hours</dd>
            </div>
            <div className="about-band__fact">
              <dt>Coverage</dt>
              <dd>{CATEGORIES.length} categories</dd>
            </div>
            <div className="about-band__fact">
              <dt>Attribution</dt>
              <dd>Original links</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="about-band" id="how-it-works">
        <div className="wrap about-band__inner">
          <p className="about-band__index">02 / How it works</p>
          <h2 className="about-band__title">Three steps, one tidy feed.</h2>

          <div className="about-band__steps">
            {STEPS.map((step) => (
              <section key={step.number} className="about-band__step">
                <p className="about-band__step-number">{step.number}</p>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </section>
            ))}
          </div>
        </div>
      </section>

      <section className="about-band about-band--inverse" id="categories">
        <div className="wrap about-band__inner">
          <p className="about-band__index">03 / Explore</p>

          <div className="about-band__grid">
            <div>
              <h2 className="about-band__title">Find your angle.</h2>
              <div className="about-band__copy">
                <p>
                  Browse by category, development type, organisation or tag. Search runs across
                  every headline and summary, and saved stories stay in your browser.
                </p>
              </div>
            </div>

            <div>
              <h3 className="about-band__subhead">Categories</h3>
              <div className="chips about-band__chips">
                {CATEGORIES.map((category) => (
                  <Link key={category} className="chip" href={categoryHref(category)}>
                    {category}
                  </Link>
                ))}
              </div>

              <dl className="about-band__meta">
                <div className="about-band__meta-row">
                  <dt>Stack</dt>
                  <dd>Next.js, PostgreSQL and a scheduled collection worker.</dd>
                </div>
                <div className="about-band__meta-row">
                  <dt>Privacy</dt>
                  <dd>No accounts, no tracking. Saved articles never leave your device.</dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="about-band__cta">
            <Link className="btn" href="/">
              Browse the latest
              <ArrowUpRight className="btn__icon" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}
