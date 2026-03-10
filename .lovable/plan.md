

## Plan: Connect Acme Travel Vault to Admin Workspace + Auto-Navigate on Role Switch

### Concept

The "Acme Travel" vault (id: `v1`) becomes the current customer workspace. When the owner clicks "Open" on a vault card, the app switches to admin role and navigates to that vault's dashboard. The existing image library, shares, brand assets etc. all belong to this vault context. When switching to Owner role, the app auto-navigates to `/vaults`.

### Changes

**1. Add active vault concept to UserRoleContext** (`src/contexts/UserRoleContext.tsx`)
- Add `activeVaultId: string | null` and `setActiveVaultId` to context
- Default `activeVaultId` to `"v1"` (Acme Travel) when in admin role
- Export `activeVaultId` so components can reference which vault is active

**2. Auto-navigate on role switch** (`src/components/AppSidebar.tsx`)
- Import `useNavigate` from react-router-dom
- In the role `Select` `onValueChange` handler: if switching to `"owner"`, navigate to `/vaults`. If switching to `"admin"` or `"supplier"`, navigate to `/`.

**3. "Open" button on vault cards navigates into admin view** (`src/pages/VaultManager.tsx`)
- Import `useNavigate` and `useUserRole`
- The "Open" button calls `setActiveVaultId(vault.id)`, `setRole("admin")`, and `navigate("/")`
- This simulates "entering" that vault's workspace

**4. Show active vault name in header** (`src/components/AppLayout.tsx`)
- Import `useUserRole` and `vaultStore`
- When in admin/supplier role and `activeVaultId` is set, show the vault name (e.g. "Acme Travel") in the header instead of the generic "Tour Image Management" text
- When in owner role, show "ImageVault Platform"

### Files

| File | Change |
|------|--------|
| `src/contexts/UserRoleContext.tsx` | Add `activeVaultId`, `setActiveVaultId` |
| `src/components/AppSidebar.tsx` | Auto-navigate on role change |
| `src/pages/VaultManager.tsx` | Wire "Open" button to switch role + navigate |
| `src/components/AppLayout.tsx` | Show active vault name in header |

