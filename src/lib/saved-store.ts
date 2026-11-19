"use client";

import { useCallback, useSyncExternalStore } from "react";

const STORAGE_KEY = "ai-tracker:saved-articles:v1";

/** Keys written by earlier iterations of the app, migrated on first read. */
const LEGACY_KEYS = ["ai-tracker-saved-articles", "theorbit:saved-v1"];

export interface SavedSnapshot {
  ids: string[];
  ready: boolean;
}

const EMPTY_SNAPSHOT: SavedSnapshot = { ids: [], ready: false };

let snapshot: SavedSnapshot = EMPTY_SNAPSHOT;
let loaded = false;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function parseIds(raw: string | null): string[] | null {
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    return parsed.filter((value): value is string => typeof value === "string");
  } catch {
    return null;
  }
}

function readStoredIds(): string[] {
  if (typeof window === "undefined") return [];

  const current = parseIds(window.localStorage.getItem(STORAGE_KEY));
  if (current) return current;

  // First run after the store was unified: carry over anything saved under
  // an older key so bookmarks are not silently lost.
  for (const legacyKey of LEGACY_KEYS) {
    const legacy = parseIds(window.localStorage.getItem(legacyKey));
    if (legacy?.length) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(legacy));
      return legacy;
    }
  }

  return [];
}

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  snapshot = { ids: readStoredIds(), ready: true };
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  load();

  // Keep other tabs in sync.
  if (typeof window !== "undefined") {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== null && event.key !== STORAGE_KEY) return;
      snapshot = { ids: readStoredIds(), ready: true };
      emit();
    };
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(listener);
      window.removeEventListener("storage", onStorage);
    };
  }

  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return snapshot;
}

function getServerSnapshot() {
  return EMPTY_SNAPSHOT;
}

function persist(ids: string[]) {
  snapshot = { ids, ready: true };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // Storage can be unavailable in private mode. The in-memory list still works.
  }
  emit();
}

export function toggleSaved(articleId: string): boolean {
  if (!loaded) load();

  const isSaved = snapshot.ids.includes(articleId);
  const ids = isSaved
    ? snapshot.ids.filter((id) => id !== articleId)
    : [articleId, ...snapshot.ids];

  persist(ids);
  return !isSaved;
}

export function isArticleSaved(articleId: string): boolean {
  return snapshot.ids.includes(articleId);
}

/** Subscribe to the saved-article list. */
export function useSavedArticles(): SavedSnapshot {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** Toggle an article and report its new saved state. */
export function useToggleSaved(): (articleId: string) => boolean {
  return useCallback((articleId: string) => toggleSaved(articleId), []);
}
