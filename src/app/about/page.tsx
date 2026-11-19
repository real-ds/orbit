import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CATEGORIES, categoryHref } from "@/data/taxonomy";
import AboutHero from "@/components/about/AboutHero";
import CategoryRibbon from "@/components/about/CategoryRibbon";

export const metadata: Metadata = {
  title: "About",
  description:
    "Discover how Orbit tracks, summarises and organises developments in artificial intelligence.",
};

const STEPS = [
  {
    number: "01",
    title: "We find the signal.",
    body: "Orbit collects recent developments from configured RSS feeds, APIs and trusted publishers across the AI ecosystem.",
  },
  {
    number: "02",
    title: "We make sense of it.",
    body: "Stories are summarised, classified and tagged so you can understand what happened without reading through endless coverage.",
  },
  {
    number: "03",
    title: "We keep you connected.",
    body: "Articles are organised, duplicates are handled and original publisher links remain accessible for deeper reading.",
  },
];

export default function AboutPage() {
  return (
    <article className="about">

      {/* HERO */}
      <AboutHero />
      <CategoryRibbon />

      {/* INTRODUCTION */}
      <section className="about-section about-intro" id="mission">
        <div className="about-container">

          <div className="about-intro__heading">
            <h2>
              Too much happening.
              <br />
              Too little time.
            </h2>
          </div>

          <div className="about-intro__content">
            <p>
              Artificial intelligence moves fast. New models,
              research papers, products and breakthroughs appear
              every day.
            </p>

            <p>
              Orbit brings these developments into one place.
              It collects relevant stories, makes sense of them
              and presents them in a way that is easy to explore.
            </p>

            <p>
              No endless scrolling. No unnecessary noise.
              Just a clearer view of what is happening in AI.
            </p>
          </div>

        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="about-section about-process" id="how-it-works">
        <div className="about-container">

          <div className="about-section__heading">
            <h2>
              From information
              <br />
              to understanding.
            </h2>

            <p>
              Every story goes through a simple process before
              it reaches your feed.
            </p>
          </div>

          <div className="about-steps">
            {STEPS.map((step) => (
              <div
                key={step.number}
                className="about-step"
              >
                <span className="about-step__number">
                  {step.number}
                </span>

                <div className="about-step__content">
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </div>

                <ArrowUpRight
                  className="about-step__icon"
                  aria-hidden="true"
                />
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* EXPLORE */}
      <section className="about-section about-explore" id="categories">
        <div className="about-container">

          <div className="about-explore__grid">

            <div className="about-explore__intro">
              <h2>
                Follow what
                <br />
                moves you.
              </h2>

              <p>
                From machine learning to robotics, explore the
                areas of AI that interest you. Browse categories,
                discover organisations and follow the developments
                shaping the industry.
              </p>
            </div>

            <div className="about-explore__topics">
              <div className="about-topics">
                {CATEGORIES.map((category) => (
                  <Link
                    key={category}
                    className="about-topic"
                    href={categoryHref(category)}
                  >
                    {category}
                    <ArrowUpRight
                      size={14}
                      aria-hidden="true"
                    />
                  </Link>
                ))}
              </div>
            </div>

          </div>

          {/* PRINCIPLES */}
          <div className="about-principles">

            <div className="about-principle">
              <h3>Less noise.</h3>
              <p>
                Concise summaries that help you understand
                developments without unnecessary reading.
              </p>
            </div>

            <div className="about-principle">
              <h3>Better discovery.</h3>
              <p>
                Stories organised by category, development type,
                organisation and relevant tags.
              </p>
            </div>

            <div className="about-principle">
              <h3>Sources matter.</h3>
              <p>
                Every story points back to its original publisher.
                Read further and verify the information yourself.
              </p>
            </div>

          </div>

          {/* CTA */}
          <div className="about-cta">
            <h2>Find your orbit.</h2>

            <Link className="about-cta__link" href="/">
              Browse the latest
              <ArrowUpRight size={17} aria-hidden="true" />
            </Link>
          </div>

        </div>
      </section>

    </article>
  );
}
