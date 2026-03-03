import { useSyncExternalStore } from "react";

export interface AssetDeliveryOptions {
  includeOriginal: boolean;
  pixelFormats: string[];   // e.g. ["WebP", "PNG"]
  pixelSizes: string[];     // e.g. ["S", "L", "XL"]
}

export interface Bucket {
  id: string;
  name: string;
  description: string;
  imageIds: string[];
  assetOptions?: Record<string, AssetDeliveryOptions>; // keyed by asset id
  createdAt: string;
}

const STORAGE_KEY = "dam-buckets";

const defaultBuckets: Bucket[] = [
  {
    id: "bucket-001",
    name: "Lofoten Highlights",
    description: "Best shots from Lofoten tours",
    imageIds: ["img-0001", "img-0006", "img-0014"],
    createdAt: "2025-07-20",
  },
  {
    id: "bucket-002",
    name: "Winter Collection",
    description: "Aurora and glacier images for winter campaign",
    imageIds: ["img-0002", "img-0008", "img-0015"],
    createdAt: "2025-08-01",
  },
];

function loadBuckets(): Bucket[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return defaultBuckets;
}

let buckets: Bucket[] = loadBuckets();

let listeners: Set<() => void> = new Set();

function persist() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(buckets)); } catch {}
}

function emit() {
  persist();
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function getSnapshot(): Bucket[] {
  return buckets;
}

export function useBuckets() {
  return useSyncExternalStore(subscribe, getSnapshot);
}

export function createBucket(name: string, description: string, imageIds: string[] = [], assetOptions?: Record<string, AssetDeliveryOptions>): Bucket {
  const b: Bucket = {
    id: `bucket-${Date.now()}`,
    name,
    description,
    imageIds,
    assetOptions,
    createdAt: new Date().toISOString().slice(0, 10),
  };
  buckets = [...buckets, b];
  emit();
  return b;
}

export function updateBucket(id: string, updates: Partial<Pick<Bucket, "name" | "description">>) {
  buckets = buckets.map((b) => (b.id === id ? { ...b, ...updates } : b));
  emit();
}

export function addImagesToBucket(bucketId: string, imageIds: string[], newOptions?: Record<string, AssetDeliveryOptions>) {
  buckets = buckets.map((b) => {
    if (b.id !== bucketId) return b;
    const merged = new Set([...b.imageIds, ...imageIds]);
    const mergedOptions = newOptions ? { ...b.assetOptions, ...newOptions } : b.assetOptions;
    return { ...b, imageIds: [...merged], assetOptions: mergedOptions };
  });
  emit();
}

export function removeImageFromBucket(bucketId: string, imageId: string) {
  buckets = buckets.map((b) => {
    if (b.id !== bucketId) return b;
    const opts = b.assetOptions ? { ...b.assetOptions } : undefined;
    if (opts) delete opts[imageId];
    return { ...b, imageIds: b.imageIds.filter((id) => id !== imageId), assetOptions: opts };
  });
  emit();
}

export function deleteBucket(id: string) {
  buckets = buckets.filter((b) => b.id !== id);
  emit();
}
