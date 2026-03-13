import { useSyncExternalStore } from "react";
import { getVaultKey, onVaultChange } from "@/stores/vaultScope";
import { uploadFileToS3 } from "@/lib/s3Client";
import { getCurrentVaultId } from "@/stores/vaultScope";

export interface LogoAsset {
  id: string;
  name: string;
  originalFormat: string;
  previewUrl: string;
  s3Key?: string;
  fileName: string;
  uploadedAt: string;
  dimensions?: string;
}

const BASE_KEY = "dam-logos";

function load(): LogoAsset[] {
  try {
    const raw = localStorage.getItem(getVaultKey(BASE_KEY));
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
    localStorage.setItem(getVaultKey(BASE_KEY), JSON.stringify(logos));
  } catch {}
}

function emit() {
  persist();
  listeners.forEach((l) => l());
}

onVaultChange(() => {
  logos = load();
  listeners.forEach((l) => l());
});

/**
 * Upload a logo file, optionally to S3. Returns the created LogoAsset.
 * S3 path: {vault-slug}/assets/{uuid}.{ext}
 */
export async function addLogo(file: File, name: string): Promise<LogoAsset> {
  const ext = file.name.split(".").pop()?.toUpperCase() || "SVG";
  const previewUrl = "";

  let s3Key: string | undefined;
  try {
    const vaultId = getCurrentVaultId();
    const prefix = `${vaultId}/assets`;
    s3Key = await uploadFileToS3(file, prefix);
  } catch (err) {
    console.warn("S3 upload for logo failed, storing locally only:", err);
  }

  const logo: LogoAsset = {
    id: `logo-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    name,
    originalFormat: ext,
    previewUrl,
    s3Key,
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
