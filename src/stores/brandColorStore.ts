import { useSyncExternalStore } from "react";

export interface BrandColor {
  id: string;
  name: string;
  value: string; // hex
}

const STORAGE_KEY = "brand-colors";

const defaults: BrandColor[] = [
  { id: "bc-1", name: "Primary Teal", value: "#4d998f" },
  { id: "bc-2", name: "Dark Navy", value: "#262d33" },
  { id: "bc-3", name: "Warm Sand", value: "#f7f5f2" },
  { id: "bc-4", name: "Accent Gold", value: "#d4a843" },
];

let colors: BrandColor[] = load();
let listeners = new Set<() => void>();

function load(): BrandColor[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [...defaults];
  } catch {
    return [...defaults];
  }
}

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(colors));
  listeners.forEach((l) => l());
}

export function useBrandColors() {
  return useSyncExternalStore(
    (cb) => { listeners.add(cb); return () => listeners.delete(cb); },
    () => colors
  );
}

export function addBrandColor(name: string, value: string): BrandColor {
  const c: BrandColor = { id: `bc-${Date.now()}`, name, value };
  colors = [...colors, c];
  save();
  return c;
}

export function updateBrandColor(id: string, updates: Partial<Pick<BrandColor, "name" | "value">>) {
  colors = colors.map((c) => (c.id === id ? { ...c, ...updates } : c));
  save();
}

export function removeBrandColor(id: string) {
  colors = colors.filter((c) => c.id !== id);
  save();
}
