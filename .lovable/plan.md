

# Plan: Fix logo visibility in buckets + format/size selection for vector assets

## Problem 1: Logos don't appear in buckets
`ShareManager.tsx` line 21: `getImages` only searches `mockImages`. Logo IDs (e.g. `logo-...`) are never found there, so they render as empty in the bucket view.

## Problem 2: No format/size choice when adding vectors to bucket or share
When adding a vector logo to a bucket or share, the user should be able to choose which deliverables to include: the original vector file and/or pixel renders in specific sizes.

## Changes

### 1. `src/stores/logoStore.ts` — add a `getLogoById` export
Simple lookup function so other parts of the app can resolve logo IDs.

### 2. `src/pages/ShareManager.tsx` — resolve both images and logos
Update `getImages` to also check `logoStore` for IDs that start with `logo-`. Convert matched logos to `ImageItem`-compatible objects (reuse the `logoToImageItem` pattern from BrandAssets). Show them in bucket thumbnails alongside regular images.

### 3. New component: `src/components/AssetFormatPickerModal.tsx`
A small dialog shown when adding a vector asset to a bucket or share. Options:
- **Include original vector** (checkbox, default on)
- **Include pixel versions** (checkbox) → sub-options:
  - Format: WebP / PNG / JPG (multi-select)
  - Size: S (512px) / L (1024px) / XL (2048px) (multi-select)
- Confirm button adds the selected configuration

The modal returns a selection object; for now we store it alongside the bucket entry as metadata (or just show a toast confirming the choices since this is mock).

### 4. `src/components/AddToBucketModal.tsx` — trigger format picker for vectors
When `imageIds` contain a logo ID, after the user picks a bucket, show the `AssetFormatPickerModal` before confirming. For regular images, behavior stays the same.

### 5. `src/components/ShareModal.tsx` — format picker for vector items
When `preselectedImages` includes a vector/logo item, show per-item format/size options inline or via the same picker modal before generating the link.

### 6. `src/stores/bucketStore.ts` — extend bucket items with format metadata (optional)
Add an optional `assetOptions` map on the bucket to track which formats/sizes were selected per asset. This is stored but only used for display in this mock phase.

## File summary

| File | Action |
|------|--------|
| `src/stores/logoStore.ts` | Add `getLogoById()` export |
| `src/components/AssetFormatPickerModal.tsx` | **New** — format/size picker dialog |
| `src/pages/ShareManager.tsx` | Resolve logo IDs in bucket view |
| `src/components/AddToBucketModal.tsx` | Show format picker for vector assets |
| `src/components/ShareModal.tsx` | Show format/size options for vector items |
| `src/stores/bucketStore.ts` | Minor: optional format metadata on bucket items |

