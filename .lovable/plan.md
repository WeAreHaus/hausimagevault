

## Plan: Vault Card Cleanup, Edit/Delete/Create Functionality + Data Isolation Fixes

### 1. Remove language/integration tags from vault cards
Remove the `languages` and `integrations` badge rows from both grid and list views in `VaultManager.tsx`.

### 2. Create a VaultEditModal component
New file `src/components/VaultEditModal.tsx` — a dialog for both creating and editing vaults:
- Fields: Name, Domain
- On create: calls `vaultStore.addVault()` with the name, domain, generated `avatarLetter` (first letter of name), and status `"draft"`
- On edit: calls `vaultStore.updateVault()` with updated name/domain/avatarLetter

### 3. Add delete vault with confirmation
Add a delete button (trash icon) on each vault card. Uses an `AlertDialog` to confirm before calling `vaultStore.deleteVault(id)`. Also cleans up that vault's localStorage keys (`dam-images-{id}`, `dam-buckets-{id}`, etc.).

### 4. Wire "Create New Vault" button
Opens the VaultEditModal in create mode.

### 5. Fix Dashboard to use vault-scoped data
`Dashboard.tsx` currently imports `mockImages` and `mockShareLinks` directly instead of reading from `imageStore`. Refactor to use `useSyncExternalStore(imageStore.subscribe, imageStore.getSnapshot)` so it shows vault-specific data (empty for new vaults).

### 6. Fix UserManagement to be vault-scoped
`UserManagement.tsx` has hardcoded default users that show for every vault. Create a simple vault-scoped user store (or scope the defaults so only vault `"v1"` gets the mock users, others start empty).

### Files

| File | Change |
|------|--------|
| `src/pages/VaultManager.tsx` | Remove tags, add edit/delete buttons, wire create modal |
| `src/components/VaultEditModal.tsx` | New — create/edit vault dialog |
| `src/pages/Dashboard.tsx` | Use imageStore instead of hardcoded mockImages |
| `src/components/settings/UserManagement.tsx` | Vault-scope user data |
| `src/stores/vaultStore.ts` | Remove `languages`/`integrations` from Vault interface |

