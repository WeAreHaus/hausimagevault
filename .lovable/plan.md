

## Plan: License field, editable tags on images, and Tag Manager

Three changes: add a license text field to the data model and detail modal, make tags editable per image, and create a Tag Manager page for bulk renaming/deleting tags.

### 1. License field

**`src/data/mockData.ts`** — Add `license: string` to `ImageItem` interface. Set default `"All rights reserved"` in `generateMockImages`.

**`src/components/ImageDetailModal.tsx`** — Add editable License textarea between Copyright and Tour Date.

**`src/stores/imageStore.ts`** — Add `license: ""` to `addImages` mapping.

**`src/components/MetadataEntryForm.tsx`** — Add License input field to the upload form.

**`src/pages/BrandAssets.tsx`** + **`src/pages/ShareManager.tsx`** — Add `license: ""` to any dummy ImageItem objects.

### 2. Editable tags on ImageDetailModal

**`src/stores/imageStore.ts`** — Add `updateImage(id, partial)` method that patches an image and emits.

**`src/components/ImageDetailModal.tsx`** — Replace the read-only tag badges with:
- Each tag shown as a Badge with an X button to remove it
- An inline Input + "Add" button to type and add a new tag
- Changes call `imageStore.updateImage(id, { tags })` to persist

### 3. Tag Manager (Settings section)

**`src/components/settings/TagManager.tsx`** — New component showing:
- List of all unique tags across all images, with usage count
- Search/filter bar to find tags
- **Rename**: inline edit or small modal — renames the tag across ALL images in the store
- **Delete**: removes the tag from ALL images, with confirmation
- **Merge**: select two tags, keep one name (stretch — can be done via rename + delete)

**`src/pages/Settings.tsx`** — Import and render `<TagManager />` alongside existing settings sections.

**`src/stores/imageStore.ts`** — Add two helper methods:
- `renameTag(oldName, newName)` — iterates all images, replaces tag, emits
- `deleteTag(tagName)` — iterates all images, removes tag, emits

### Files summary

| File | Change |
|------|--------|
| `src/data/mockData.ts` | Add `license` to interface + mock data |
| `src/stores/imageStore.ts` | Add `updateImage`, `renameTag`, `deleteTag` methods; add `license` to `addImages` |
| `src/components/ImageDetailModal.tsx` | Add license field, make tags editable (add/remove) |
| `src/components/MetadataEntryForm.tsx` | Add license input |
| `src/components/settings/TagManager.tsx` | New — tag list with search, rename, delete |
| `src/pages/Settings.tsx` | Add `<TagManager />` |
| `src/pages/BrandAssets.tsx` | Add `license: ""` to dummy object |
| `src/pages/ShareManager.tsx` | Add `license: ""` to dummy object |

