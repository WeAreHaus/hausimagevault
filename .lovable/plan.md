

## Plan: Vault-Scoped Data Isolation

Right now all 5 content stores use a single hardcoded localStorage key each (e.g. `"dam-images"`), so all vaults share identical data. We need to namespace every key by vault ID.

### Approach

Create a central vault scope module that all stores reference. When `activeVaultId` changes, all stores reload from their vault-specific localStorage key.

### Changes

**1. New file: `src/stores/vaultScope.ts`**
- Tracks current vault ID (initially `"v1"`)
- `getVaultKey(baseKey)` → returns `"baseKey-{vaultId}"` (e.g. `"dam-images-v1"`)
- `setCurrentVault(id)` — updates vault ID and calls all registered reload callbacks
- `onVaultChange(callback)` — registers a reload callback

**2. Refactor 5 content stores** to use vault-scoped keys:

Each store (`imageStore`, `bucketStore`, `logoStore`, `brandColorStore`, `publicPageStore`) will:
- Replace hardcoded `STORAGE_KEY` with `getVaultKey(BASE_KEY)` in both `load()` and `persist()`
- Register an `onVaultChange` callback that reloads data from the new vault's storage and notifies all subscribers
- Mock/default data only seeds for vault `"v1"`

| Store | Base Key | Default data scope |
|-------|----------|--------------------|
| `imageStore` | `"dam-images"` | v1 only (mockImages) |
| `bucketStore` | `"dam-buckets"` | v1 only (defaultBuckets) |
| `logoStore` | `"dam-logos"` | Empty for all |
| `brandColorStore` | `"brand-colors"` | v1 only (default colors) |
| `publicPageStore` | `"dam-public-pages"` | Empty for all |

**3. `src/contexts/UserRoleContext.tsx`**
- When `setActiveVaultId` is called, also call `setCurrentVault(id)` from vaultScope to trigger all store reloads

**4. `src/stores/vaultStore.ts`** — unchanged (global, not vault-scoped)

### Result
- Each vault gets completely independent content
- Switching vaults reloads everything from vault-specific storage
- Nordic Adventures starts empty, Acme Travel keeps existing data

