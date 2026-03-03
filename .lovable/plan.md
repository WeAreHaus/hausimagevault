

# Merge Share Manager & Buckets into One View

## Concept

Combine both pages into a single **Share Manager** page with two sections using tabs:

1. **Buckets** -- Reusable, named collections (current Buckets functionality)
2. **Quick Shares** -- One-off share links not tied to a bucket (current ShareManager links)

"Quick Shares" conveys that these are ad-hoc, disposable shares vs. the persistent bucket collections.

## Changes

### `src/pages/ShareManager.tsx`
- Rewrite to include a `Tabs` component with two tabs: **Buckets** and **Quick Shares**
- **Buckets tab**: Move all content from `Buckets.tsx` here (bucket list, edit, share, delete, thumbnails, expand/collapse)
- **Quick Shares tab**: Keep current share links list + "New Share Link" button
- Header stays as "Share Manager" with subtitle "Manage buckets and share links"

### `src/pages/Buckets.tsx`
- Delete this file (no longer needed as a standalone page)

### `src/App.tsx`
- Remove `/buckets` route and `Buckets` import

### `src/components/AppSidebar.tsx`
- Remove the "Buckets" nav item from `adminItems`; keep only "Share Manager"

