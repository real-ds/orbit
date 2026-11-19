"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bookmark, Search } from "lucide-react";

const NAV_ITEMS = [
  { href: "/", label: "Latest" },
  { href: "/explore", label: "Explore" },
  { href: "/about", label: "About" },
] as const;

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Navbar() {
  const pathname = usePathname();
  const searchActive = isActive(pathname, "/search");
  const savedActive = isActive(pathname, "/saved");

  return (
    <header className="top">
      <div className="wrap bar">
        <Link className="brand" href="/">
          Orbit
        </Link>

        <nav aria-label="Primary">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              data-nav={item.label.toLowerCase()}
              aria-current={isActive(pathname, item.href) ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="nav-actions" role="group" aria-label="Quick links">
          <Link
            className="nav-action"
            href="/search"
            aria-label="Search articles"
            title="Search"
            aria-current={searchActive ? "page" : undefined}
          >
            <Search size={19} aria-hidden="true" />
          </Link>
          <Link
            className="nav-action"
            href="/saved"
            aria-label="Saved articles"
            title="Saved"
            aria-current={savedActive ? "page" : undefined}
          >
            <Bookmark
              size={19}
              aria-hidden="true"
              fill={savedActive ? "currentColor" : "none"}
            />
          </Link>
        </div>
      </div>
    </header>
  );
}
