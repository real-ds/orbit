"use client";

import { useSyncExternalStore } from "react";

const STORAGE_KEY = "theorbit:saved-v1";

type SavedSnapshot = {
  ids: string[];
  ready: boolean;
};

const EMPTY_SNAPSHOT: SavedSnapshot = { ids: [], ready: false };

let snapshot: SavedSnapshot = EMPTY_SNAPSHOT;
let loaded = false;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    const ids = Array.isArray(parsed)
      ? parsed.filter((value): value is string => typeof value === "string")
      : [];
    snapshot = { ids, ready: true };
  } catch {
    snapshot = { ids: [], ready: true };
  }
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  load();
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

export function toggleSaved(slug: string) {
  if (!loaded) load();
  const ids = snapshot.ids.includes(slug)
    ? snapshot.ids.filter((id) => id !== slug)
    : [slug, ...snapshot.ids];
  snapshot = { ids, ready: true };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // Storage can be unavailable in private mode. The in-memory list still works.
  }
  emit();
}

export function useSavedStories(): SavedSnapshot {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}