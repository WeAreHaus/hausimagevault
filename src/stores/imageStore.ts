import { mockImages } from "@/data/mockData";
import type { ImageItem } from "@/data/mockData";
import type { UploadedFile } from "@/components/MetadataEntryForm";

const STORAGE_KEY = "dam-images";

function loadImages(): ImageItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as ImageItem[];
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return mockImages;
}

let images: ImageItem[] = loadImages();
let listeners = new Set<() => void>();

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(images));
  } catch {}
}

function emit() {
  persist();
  listeners.forEach((l) => l());
}

export const imageStore = {
  getImages(): ImageItem[] {
    return images;
  },

  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => { listeners.delete(listener); };
  },

  getSnapshot(): ImageItem[] {
    return images;
  },

  addImages(files: UploadedFile[]) {
    const now = new Date().toISOString();
    const newItems: ImageItem[] = files.map((f, i) => ({
      id: `uploaded-${Date.now()}-${i}`,
      src: f.previewUrl,
      title: f.title || f.name,
      photographer: f.photographer || "Unknown",
      copyright: f.copyright || "",
      tourDate: now.slice(0, 10),
      description: f.description || "",
      altText: f.altText || "",
      tags: f.tags ? f.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
      status: [] as ImageItem["status"],
      width: 0,
      height: 0,
      fileSize: "",
      uploadedAt: now,
      mediaType: "image" as const,
    }));
    images = [...newItems, ...images];
    emit();
  },
};
