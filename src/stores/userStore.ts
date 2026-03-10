import { getVaultKey, getCurrentVaultId, onVaultChange } from "@/stores/vaultScope";
import type { UserRole } from "@/contexts/UserRoleContext";

export interface MockUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  pending?: boolean;
}

const BASE_KEY = "dam-users";

const defaultUsersV1: MockUser[] = [
  { id: "1", name: "Anna Lindgren", email: "anna@example.com", role: "admin" },
  { id: "2", name: "Erik Holm", email: "erik@example.com", role: "supplier" },
];

function loadUsers(): MockUser[] {
  try {
    const raw = localStorage.getItem(getVaultKey(BASE_KEY));
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  return getCurrentVaultId() === "v1" ? defaultUsersV1 : [];
}

let users: MockUser[] = loadUsers();
let listeners = new Set<() => void>();

function persist() {
  try { localStorage.setItem(getVaultKey(BASE_KEY), JSON.stringify(users)); } catch {}
}

function emit() { persist(); listeners.forEach((l) => l()); }

onVaultChange(() => {
  users = loadUsers();
  listeners.forEach((l) => l());
});

export const userStore = {
  getUsers(): MockUser[] { return users; },
  subscribe(listener: () => void) { listeners.add(listener); return () => { listeners.delete(listener); }; },
  getSnapshot(): MockUser[] { return users; },

  addUser(user: Omit<MockUser, "id">) {
    const newUser: MockUser = { ...user, id: crypto.randomUUID() };
    users = [...users, newUser];
    emit();
  },

  removeUser(id: string) {
    users = users.filter((u) => u.id !== id);
    emit();
  },
};
