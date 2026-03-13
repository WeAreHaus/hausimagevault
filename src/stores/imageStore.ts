import { mockImages } from "@/data/mockData";
import type { ImageItem } from "@/data/mockData";
import type { UploadedFile } from "@/components/MetadataEntryForm";
import { getVaultKey, getCurrentVaultId, onVaultChange } from "@/stores/vaultScope";

const BASE_KEY = "dam-images";

function loadImages(): ImageItem[] {
  try {
    const raw = localStorage.getItem(getVaultKey(BASE_KEY));
    if (raw) {
      const parsed = JSON.parse(raw) as ImageItem[];
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  // Only seed mock data for vault v1
  return getCurrentVaultId() === "v1" ? mockImages : [];
}

let images: ImageItem[] = loadImages();
let listeners = new Set<() => void>();

function persist() {
  try {
    localStorage.setItem(getVaultKey(BASE_KEY), JSON.stringify(images));
  } catch {}
}

function emit() {
  persist();
  listeners.forEach((l) => l());
}

// Reload when vault changes
onVaultChange(() => {
  images = loadImages();
  listeners.forEach((l) => l());
});

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

  addImages(files: UploadedFile[], s3Keys?: string[]) {
    const now = new Date().toISOString();
    const newItems: ImageItem[] = files.map((f, i) => ({
      id: `uploaded-${Date.now()}-${i}`,
      src: f.previewUrl,
      s3Key: s3Keys?.[i],
      title: f.title || f.name,
      photographer: f.photographer || "Unknown",
      copyright: f.copyright || "",
      license: f.license || "",
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

  updateImage(id: string, partial: Partial<ImageItem>) {
    images = images.map((img) => img.id === id ? { ...img, ...partial } : img);
    emit();
  },

  renameTag(oldName: string, newName: string) {
    const trimmed = newName.trim();
    if (!trimmed || oldName === trimmed) return;
    images = images.map((img) => {
      if (!img.tags.includes(oldName)) return img;
      const newTags = img.tags.map((t) => t === oldName ? trimmed : t);
      return { ...img, tags: [...new Set(newTags)] };
    });
    emit();
  },

  deleteTag(tagName: string) {
    images = images.map((img) => {
      if (!img.tags.includes(tagName)) return img;
      return { ...img, tags: img.tags.filter((t) => t !== tagName) };
    });
    emit();
  },

  deleteImages(ids: string[]) {
    const idSet = new Set(ids);
    images = images.filter((img) => !idSet.has(img.id));
    emit();
  },
};
