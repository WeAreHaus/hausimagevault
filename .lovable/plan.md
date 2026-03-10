

## Plan: Fix Data Leakage Between Vaults

After investigating, there are several sources of data leakage — some components still use hardcoded mock data instead of vault-scoped stores:

### Issues Found

1. **`ShareManager.tsx` (line 2, 191)** — Imports and renders `mockShareLinks` directly from `mockData.ts`. These quick-share links appear identically in every vault regardless of which vault is active.

2. **`BrandAssets.tsx` (line 26-30)** — Has hardcoded `mockAssets` (favicons, fonts) that display on every vault. These should either be vault-scoped or only shown for vault v1.

3. **`UploadFlow.tsx` (line 17-23)** — The simulated upload always uses the same 6 mock preview images (`fjord1`, `aurora1`, etc.), so uploads in different vaults look visually identical even though they're technically separate entries. This creates the strong impression of data leakage.

### Changes

**`src/pages/ShareManager.tsx`**
- Create a vault-scoped `shareStore` (similar pattern to other stores) to hold share links
- Only seed `mockShareLinks` data for vault `"v1"`, other vaults start with empty quick-shares
- Replace the direct `mockShareLinks` import with the store

**`src/stores/shareStore.ts`** (new file)
- Vault-scoped store for quick share links using the same `getVaultKey` / `onVaultChange` pattern
- Seeds mock data only for vault v1

**`src/pages/BrandAssets.tsx`**
- Scope the hardcoded `mockAssets` (favicons/fonts) to vault v1 only — other vaults see empty brand assets sections

**`src/pages/UploadFlow.tsx`**
- Generate unique image IDs with the vault ID prefix so they're clearly distinguishable per vault (the mock previews will still look similar but at least won't collide)

### Result
Each vault will have fully independent data across all views: dashboard, image library, shares, brand assets, and user management.

