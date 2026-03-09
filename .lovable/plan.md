

## Plan: Remove "Guide" metadata field

Remove the `guide` field from the data model, mock data, stores, filters, and detail views across the app.

### Files to change

1. **`src/data/mockData.ts`** — Remove `guide` from `ImageItem` interface, remove `guideList`, remove `guide` assignment in `generateMockImages`, remove `guides` export.

2. **`src/pages/ImageLibrary.tsx`** — Remove `filterGuide` state, the guide filter `<Select>`, guide from `useMemo` derivations, filter logic, `clearFilters`, `hasFilters`, and page reset dependencies.

3. **`src/components/ImageDetailModal.tsx`** — Remove the Guide input field from the detail modal.

4. **`src/stores/imageStore.ts`** — Remove `guide: ""` from `addImages`.

5. **`src/pages/BrandAssets.tsx`** — Remove `guide: ""` from the dummy ImageItem construction.

6. **`src/pages/ShareManager.tsx`** — Remove `guide: ""` from the dummy ImageItem construction.

