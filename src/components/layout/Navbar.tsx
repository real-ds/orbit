"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  onSearchClick?: () => void;
  onMenuClick?: () => void;
}

export function Navbar({ onSearchClick, onMenuClick }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [isSearchOpen]);

  const navLinks = [
    { href: "/", label: "Dashboard" },
    { href: "/saved", label: "Saved" },
    { href: "/about", label: "About" },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 border-b transition-all duration-200",
        "bg-bg/95 backdrop-blur-sm",
        isScrolled && "border-border shadow-card"
      )}
      style={{ height: "72px" }}
    >
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 h-full">
        <nav className="flex items-center justify-between h-full" aria-label="Main navigation">
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="flex items-center gap-3 px-2 py-2 -ml-2 rounded-lg hover:bg-bg-raised transition-colors"
              aria-label="AI Intelligence Tracker Home"
            >
              <span className="font-display text-lg font-semibold text-text-primary hidden sm:block">
                AI Intelligence Tracker
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-1 ml-4 border-l border-border pl-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2.5 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-bg-raised rounded-lg transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center relative">
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className="flex items-center gap-2 w-72 px-4 py-2.5 bg-bg-raised border border-border rounded-xl text-text-secondary placeholder:text-text-muted hover:border-accent focus-within:border-accent transition-all duration-200"
                aria-label="Search articles"
              >
                <span className="text-sm font-medium truncate">Search articles, topics, companies...</span>
                <kbd className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-mono text-text-muted bg-bg border-border rounded">
                  <span>⌘</span>K
                </kbd>
              </button>

              {isSearchOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 w-72" role="search">
                  <div className="bg-bg-elevated border border-border rounded-xl p-3 shadow-card animate-fade-in">
                    <input
                      ref={searchInputRef}
                      type="search"
                      placeholder="Search articles, topics, companies..."
                      className="w-full bg-transparent text-text-primary placeholder:text-text-muted text-sm outline-none"
                      autoComplete="off"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-1">
              <Link
                href="/saved"
                className="p-2.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-raised transition-colors"
                aria-label="Saved articles"
              >
                Saved
              </Link>

              <button
                type="button"
                className="p-2.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-raised transition-colors"
                aria-label="Toggle theme"
              >
                Theme
              </button>

              <button
                type="button"
                onClick={onMenuClick}
                className="md:hidden p-2.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-raised transition-colors"
                aria-label="Open menu"
              >
                Menu
              </button>
            </div>
          </div>
        </nav>
      </div>

      {isSearchOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setIsSearchOpen(false)}
          aria-hidden="true"
        />
      )}
    </header>
  );
}