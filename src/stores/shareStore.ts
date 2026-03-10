import { mockShareLinks } from "@/data/mockData";
import type { ShareLink } from "@/data/mockData";
import { getVaultKey, getCurrentVaultId, onVaultChange } from "@/stores/vaultScope";
import { useSyncExternalStore } from "react";

const BASE_KEY = "dam-shares";

function loadShares(): ShareLink[] {
  try {
    const raw = localStorage.getItem(getVaultKey(BASE_KEY));
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  return getCurrentVaultId() === "v1" ? mockShareLinks : [];
}

let shares: ShareLink[] = loadShares();
let listeners = new Set<() => void>();

function persist() {
  try { localStorage.setItem(getVaultKey(BASE_KEY), JSON.stringify(shares)); } catch {}
}

function emit() { persist(); listeners.forEach((l) => l()); }

onVaultChange(() => {
  shares = loadShares();
  listeners.forEach((l) => l());
});

export const shareStore = {
  getShares(): ShareLink[] { return shares; },
  subscribe(listener: () => void) { listeners.add(listener); return () => { listeners.delete(listener); }; },
  getSnapshot(): ShareLink[] { return shares; },
};

export function useShares(): ShareLink[] {
  return useSyncExternalStore(shareStore.subscribe, shareStore.getSnapshot);
}
