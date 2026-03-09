import { useSyncExternalStore } from "react";

export interface PublicPage {
  id: string;
  title: string;
  description: string;
  imageIds: string[];
  slug: string;
  published: boolean;
  createdAt: string;
  downloadOption: "high-res" | "low-res" | "none";
  watermark: boolean;
}

const STORAGE_KEY = "dam-public-pages";

function loadPages(): PublicPage[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

let pages: PublicPage[] = loadPages();
let listeners = new Set<() => void>();

function persist() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(pages)); } catch {}
}

function emit() {
  persist();
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function getSnapshot(): PublicPage[] {
  return pages;
}

export function usePublicPages() {
  return useSyncExternalStore(subscribe, getSnapshot);
}

export function getPublicPageBySlug(slug: string): PublicPage | undefined {
  return pages.find((p) => p.slug === slug);
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    || `page-${Date.now()}`;
}

export function createPublicPage(title: string, description: string): PublicPage {
  const base = slugify(title);
  const existing = pages.map((p) => p.slug);
  let slug = base;
  let i = 2;
  while (existing.includes(slug)) {
    slug = `${base}-${i++}`;
  }

  const page: PublicPage = {
    id: `pub-${Date.now()}`,
    title,
    description,
    imageIds: [],
    slug,
    published: false,
    createdAt: new Date().toISOString().slice(0, 10),
    downloadOption: "low-res",
    watermark: false,
  };
  pages = [...pages, page];
  emit();
  return page;
}

export function updatePublicPage(id: string, updates: Partial<Pick<PublicPage, "title" | "description" | "slug" | "published">>) {
  pages = pages.map((p) => (p.id === id ? { ...p, ...updates } : p));
  emit();
}

export function deletePublicPage(id: string) {
  pages = pages.filter((p) => p.id !== id);
  emit();
}

export function addAssetsToPublicPage(pageId: string, assetIds: string[]) {
  pages = pages.map((p) => {
    if (p.id !== pageId) return p;
    const merged = new Set([...p.imageIds, ...assetIds]);
    return { ...p, imageIds: [...merged] };
  });
  emit();
}

export function removeAssetFromPublicPage(pageId: string, assetId: string) {
  pages = pages.map((p) => {
    if (p.id !== pageId) return p;
    return { ...p, imageIds: p.imageIds.filter((id) => id !== assetId) };
  });
  emit();
}
