

## Plan: Delete Images + Owner-Level "Vaults" Management

Two features: (1) ability to delete images, and (2) a new "owner" role with a top-level dashboard for managing multiple ImageVault instances (customers).

---

### 1. Delete Images

**`src/stores/imageStore.ts`** — Add `deleteImages(ids: string[])` method that filters out the given IDs and emits.

**`src/pages/ImageLibrary.tsx`** — Add a "Delete" button (Trash2 icon) to the bulk action bar. On click, show an `AlertDialog` confirmation ("Delete X images? This cannot be undone."). On confirm, call `imageStore.deleteImages([...selectedIds])` and clear selection.

Also add a delete button inside `ImageDetailModal` for single-image delete.

**`src/components/ImageDetailModal.tsx`** — Add a destructive "Delete" button at the bottom of the modal. Confirmation via AlertDialog, then calls `imageStore.deleteImages([id])` and closes modal.

---

### 2. Owner Role + Vaults Management

Inspired by the uploaded CMS screenshot — a top-level view where the app owner manages multiple "Vaults" (equivalent to "Sites" in the CMS). Each Vault represents a customer's ImageVault instance.

**`src/contexts/UserRoleContext.tsx`** — Extend `UserRole` to `"owner" | "admin" | "supplier"`. Add `isOwner` boolean.

**`src/stores/vaultStore.ts`** — New store (localStorage-persisted) managing a list of Vault objects:
```
{ id, name, domain, status: "live" | "preview" | "draft", languages: string[], integrations: string[], updatedAt, avatarLetter }
```
With mock data (e.g. "Acme Travel", "Nordic Adventures", etc.) and CRUD methods.

**`src/pages/VaultManager.tsx`** — New page, owner-only. Grid of Vault cards (like the CMS screenshot) showing:
- Avatar letter + name + domain
- Status badge (Live/Preview/Draft)
- Language tags, integration tags
- "Updated X ago"
- "Open Vault →" button + preview eye icon
- "+ Create New Vault" button top-right
- Search bar + grid/list toggle

**`src/components/AppSidebar.tsx`** — Add owner-level nav items:
```
ownerItems = [
  { title: "Vaults", url: "/vaults", icon: Building2 },
  { title: "Users", url: "/users", icon: Users },
  { title: "Platform Settings", url: "/platform-settings", icon: Settings2 },
]
```
When role is "owner", show these items instead of admin items. The sidebar label changes to "ImageVault Platform".

**`src/App.tsx`** — Add routes: `/vaults` → VaultManager, `/users` (placeholder), `/platform-settings` (placeholder).

**Role selector in sidebar** — Add "Owner / Platform" as a third option.

---

### Files summary

| File | Change |
|------|--------|
| `src/stores/imageStore.ts` | Add `deleteImages(ids)` |
| `src/pages/ImageLibrary.tsx` | Add delete button in bulk bar with AlertDialog |
| `src/components/ImageDetailModal.tsx` | Add single-image delete button |
| `src/contexts/UserRoleContext.tsx` | Add `"owner"` role, `isOwner` |
| `src/stores/vaultStore.ts` | New — vault CRUD store with mock data |
| `src/pages/VaultManager.tsx` | New — owner dashboard with vault cards |
| `src/components/AppSidebar.tsx` | Add owner nav items, third role option |
| `src/App.tsx` | Add `/vaults` route |

