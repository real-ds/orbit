"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "Latest" },
  { href: "/explore", label: "Explore" },
  { href: "/search", label: "Search" },
  { href: "/saved", label: "Saved" },
  { href: "/about", label: "About" },
] as const;

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Navbar() {
  const pathname = usePathname();

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
      </div>
    </header>
  );
}
