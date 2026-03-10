export interface Vault {
  id: string;
  name: string;
  domain: string;
  status: "live" | "preview" | "draft";
  updatedAt: string;
  avatarLetter: string;
}

const STORAGE_KEY = "dam-vaults";

const VAULT_SCOPED_KEYS = [
  "dam-images",
  "dam-buckets",
  "dam-logos",
  "brand-colors",
  "dam-public-pages",
  "dam-users",
  "dam-shares",
];

const mockVaults: Vault[] = [
  { id: "v1", name: "Acme Travel", domain: "acmetravel.com", status: "live", updatedAt: "2026-03-08T14:30:00Z", avatarLetter: "A" },
  { id: "v2", name: "Nordic Adventures", domain: "nordicadv.no", status: "live", updatedAt: "2026-03-07T09:15:00Z", avatarLetter: "N" },
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
    return newVault;
  },

  updateVault(id: string, partial: Partial<Vault>) {
    vaults = vaults.map((v) => v.id === id ? { ...v, ...partial, updatedAt: new Date().toISOString() } : v);
    emit();
  },

  deleteVault(id: string) {
    vaults = vaults.filter((v) => v.id !== id);
    // Clean up all vault-scoped localStorage keys
    VAULT_SCOPED_KEYS.forEach((key) => {
      try { localStorage.removeItem(`${key}-${id}`); } catch {}
    });
    emit();
  },
};
