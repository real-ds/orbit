"use client";

import { useCallback, useSyncExternalStore } from "react";

const STORAGE_KEY = "ai-tracker:sidebar-collapsed:v1";

/**
 * `true` means the filter sidebar is collapsed to its rail.
 * The default is expanded on desktop and collapsed on narrow viewports.
 */
let collapsed = false;
let loaded = false;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "1") {
      collapsed = true;
    } else if (stored === "0") {
      collapsed = false;
    } else {
      collapsed = window.innerWidth < 820;
    }
  } catch {
    collapsed = window.innerWidth < 820;
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
  return collapsed;
}

function getServerSnapshot() {
  return false;
}

export function toggleSidebarCollapsed() {
  collapsed = !collapsed;
  try {
    window.localStorage.setItem(STORAGE_KEY, collapsed ? "1" : "0");
  } catch {
    // Storage can be unavailable in private mode. The toggle still works in memory.
  }
  emit();
}

export function useSidebarCollapsed(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function useToggleSidebar(): () => void {
  return useCallback(() => toggleSidebarCollapsed(), []);
}
