"use client";

import { useSyncExternalStore } from "react";

const STORAGE_KEY = "theorbit:sidebar-collapsed";

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
    collapsed = window.localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    collapsed = false;
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