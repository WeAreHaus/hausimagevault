import { useSyncExternalStore } from "react";

export interface Bucket {
  id: string;
  name: string;
  description: string;
  imageIds: string[];
  createdAt: string;
}

let buckets: Bucket[] = [
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

let listeners: Set<() => void> = new Set();

function emit() {
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

export function createBucket(name: string, description: string, imageIds: string[] = []): Bucket {
  const b: Bucket = {
    id: `bucket-${Date.now()}`,
    name,
    description,
    imageIds,
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

export function addImagesToBucket(bucketId: string, imageIds: string[]) {
  buckets = buckets.map((b) => {
    if (b.id !== bucketId) return b;
    const merged = new Set([...b.imageIds, ...imageIds]);
    return { ...b, imageIds: [...merged] };
  });
  emit();
}

export function removeImageFromBucket(bucketId: string, imageId: string) {
  buckets = buckets.map((b) => {
    if (b.id !== bucketId) return b;
    return { ...b, imageIds: b.imageIds.filter((id) => id !== imageId) };
  });
  emit();
}

export function deleteBucket(id: string) {
  buckets = buckets.filter((b) => b.id !== id);
  emit();
}
