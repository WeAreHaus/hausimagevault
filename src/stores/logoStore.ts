import { useSyncExternalStore } from "react";

export interface LogoAsset {
  id: string;
  name: string;
  originalFormat: string;
  previewUrl: string;
  fileName: string;
  uploadedAt: string;
  dimensions?: string;
}

const STORAGE_KEY = "dam-logos";

function load(): LogoAsset[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as LogoAsset[];
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  return [];
}

let logos: LogoAsset[] = load();
const listeners = new Set<() => void>();

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(logos));
  } catch {}
}

function emit() {
  persist();
  listeners.forEach((l) => l());
}

export function addLogo(file: File, name: string): LogoAsset {
  const ext = file.name.split(".").pop()?.toUpperCase() || "SVG";
  const previewUrl = file.type === "image/svg+xml" ? URL.createObjectURL(file) : "/placeholder.svg";
  const logo: LogoAsset = {
    id: `logo-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    name,
    originalFormat: ext,
    previewUrl,
    fileName: file.name,
    uploadedAt: new Date().toISOString(),
  };
  logos = [logo, ...logos];
  emit();
  return logo;
}

export function removeLogo(id: string) {
  logos = logos.filter((l) => l.id !== id);
  emit();
}

export function updateLogoName(id: string, name: string) {
  logos = logos.map((l) => (l.id === id ? { ...l, name } : l));
  emit();
}

export function getLogoById(id: string): LogoAsset | undefined {
  return logos.find((l) => l.id === id);
}

export function getLogosByIds(ids: string[]): LogoAsset[] {
  return ids.map((id) => logos.find((l) => l.id === id)).filter(Boolean) as LogoAsset[];
}

export function useLogos(): LogoAsset[] {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => { listeners.delete(cb); };
    },
    () => logos,
  );
}
