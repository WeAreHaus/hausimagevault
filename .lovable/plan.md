

## Plan: Reduce Vaults to Two

Remove Fjord Experiences, Arctic Lights, and Mountain Lodge Media from the mock data in `src/stores/vaultStore.ts`, keeping only Acme Travel and Nordic Adventures.

### Change

**`src/stores/vaultStore.ts`** — Remove entries `v3`, `v4`, `v5` from the `mockVaults` array. Keep `v1` (Acme Travel) and `v2` (Nordic Adventures). Also clear localStorage on load if it contains the old set (so stale data doesn't persist).

