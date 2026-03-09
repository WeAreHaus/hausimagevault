

## Plan: Remove "Group" metadata field

Remove `groupId` from the data model, filters, detail modal, and all references — same pattern as the Guide removal.

### Files to change

1. **`src/data/mockData.ts`** — Remove `groupId` from `ImageItem` interface, `generateMockImages`, and the `groupIds` export.

2. **`src/pages/ImageLibrary.tsx`** — Remove `filterGroup` state, `groupIds` memo, the Group filter `<Select>`, filter logic (`filterGroup !== "all"`), and `filterGroup` from `clearFilters`, `hasFilters`, and page reset dependencies.

3. **`src/components/ImageDetailModal.tsx`** — Remove the "Group ID" label + input field.

4. **`src/stores/imageStore.ts`** — Remove `groupId: ""` from `addImages`.

5. **`src/pages/BrandAssets.tsx`** — Remove `groupId: ""` from dummy ImageItem.

6. **`src/pages/ShareManager.tsx`** — Remove `groupId: ""` from dummy ImageItem.

