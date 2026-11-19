import Link from "next/link";
import { ArrowUp } from "lucide-react";
import { CATEGORIES, categoryHref } from "@/data/taxonomy";

const EXPLORE_LINKS = [
  { href: "/", label: "Latest" },
  { href: "/explore", label: "Explore" },
  { href: "/search", label: "Search" },
  { href: "/saved", label: "Saved" },
];

const TOPIC_LINKS = CATEGORIES.slice(0, 5).map((category) => ({
  href: categoryHref(category),
  label: category,
}));

const PROJECT_LINKS = [
  { href: "/about", label: "About Orbit" },
  { href: "/about#how-it-works", label: "How it works" },
  { href: "/about#categories", label: "Categories" },
];

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer__top">
          <div className="footer__brand">
            <Link className="footer__logo" href="/">
              Orbit
            </Link>
            <p className="footer__tagline">
              A quieter way to keep up with AI. Every story summarised, classified and linked back
              to its source.
            </p>
          </div>

          <nav className="footer__links" aria-label="Footer">
            <div className="footer__group">
              <h2 className="footer__label">Explore</h2>
              <ul>
                {EXPLORE_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer__group">
              <h2 className="footer__label">Topics</h2>
              <ul>
                {TOPIC_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer__group">
              <h2 className="footer__label">Project</h2>
              <ul>
                {PROJECT_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>

        <div className="footer__bottom">
          <p>&copy; {year} Orbit. Updated every 48 hours.</p>
          <p className="footer__note">Independent AI news desk · Built for curious minds</p>
          <Link className="footer__back" href="#app">
            Back to top
            <ArrowUp aria-hidden="true" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
