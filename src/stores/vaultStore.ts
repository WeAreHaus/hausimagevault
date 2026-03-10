export interface Vault {
  id: string;
  name: string;
  domain: string;
  status: "live" | "preview" | "draft";
  languages: string[];
  integrations: string[];
  updatedAt: string;
  avatarLetter: string;
}

const STORAGE_KEY = "dam-vaults";

const mockVaults: Vault[] = [
  { id: "v1", name: "Acme Travel", domain: "acmetravel.com", status: "live", languages: ["EN", "NO"], integrations: ["WordPress", "Shopify"], updatedAt: "2026-03-08T14:30:00Z", avatarLetter: "A" },
  { id: "v2", name: "Nordic Adventures", domain: "nordicadv.no", status: "live", languages: ["NO", "EN", "DE"], integrations: ["WordPress"], updatedAt: "2026-03-07T09:15:00Z", avatarLetter: "N" },
  { id: "v3", name: "Fjord Experiences", domain: "fjordexp.com", status: "preview", languages: ["EN"], integrations: [], updatedAt: "2026-03-05T11:00:00Z", avatarLetter: "F" },
  { id: "v4", name: "Arctic Lights", domain: "arcticlights.no", status: "draft", languages: ["NO"], integrations: ["WordPress"], updatedAt: "2026-03-01T16:45:00Z", avatarLetter: "A" },
  { id: "v5", name: "Mountain Lodge Media", domain: "mtlodge.com", status: "live", languages: ["EN", "NO"], integrations: ["WordPress", "Cloudflare"], updatedAt: "2026-03-09T08:20:00Z", avatarLetter: "M" },
];

function load(): Vault[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return mockVaults;
}

let vaults: Vault[] = load();
let listeners = new Set<() => void>();

function persist() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(vaults)); } catch {}
}

function emit() { persist(); listeners.forEach((l) => l()); }

export const vaultStore = {
  getVaults(): Vault[] { return vaults; },
  subscribe(listener: () => void) { listeners.add(listener); return () => { listeners.delete(listener); }; },
  getSnapshot(): Vault[] { return vaults; },

  addVault(v: Omit<Vault, "id" | "updatedAt">) {
    const newVault: Vault = { ...v, id: `v-${Date.now()}`, updatedAt: new Date().toISOString() };
    vaults = [newVault, ...vaults];
    emit();
  },

  updateVault(id: string, partial: Partial<Vault>) {
    vaults = vaults.map((v) => v.id === id ? { ...v, ...partial, updatedAt: new Date().toISOString() } : v);
    emit();
  },

  deleteVault(id: string) {
    vaults = vaults.filter((v) => v.id !== id);
    emit();
  },
};
