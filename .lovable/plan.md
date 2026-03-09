

## Plan: Download & Watermark Settings for Public Pages

Add three new settings to the PublicPage data model and edit modal, and respect them on the public preview page.

### Data Model — `src/stores/publicPageStore.ts`

Add to `PublicPage` interface:
```ts
downloadOption: "high-res" | "low-res" | "none";
watermark: boolean;
```

Defaults: `downloadOption: "low-res"`, `watermark: false`.

Update `createPublicPage` to set defaults. Update `updatePublicPage`'s type signature to allow these new fields.

### Edit Modal — `src/components/PublicPageEditModal.tsx`

Add two new controls in a "Visitor permissions" section:

1. **Download** — RadioGroup with three options:
   - High-resolution downloads
   - Low-resolution only
   - No downloads

2. **Watermark** — Switch toggle: "Show watermark on images"

Wire state for both, populate from `page` in useEffect, pass to `updatePublicPage`/`createPublicPage`.

### Public Preview — `src/pages/PublicPagePreview.tsx`

- If `downloadOption === "none"`: hide the Download button entirely
- If `downloadOption === "low-res"`: keep download button but add `(Low-res)` label (in practice same src for now since we don't have real resolution variants, but the UI distinction is there)
- If `watermark === true`: render a semi-transparent "PREVIEW" text overlay on each image via CSS

### Files to change

| File | Change |
|------|--------|
| `src/stores/publicPageStore.ts` | Add `downloadOption` and `watermark` to interface + defaults |
| `src/components/PublicPageEditModal.tsx` | Add RadioGroup for download + Switch for watermark |
| `src/pages/PublicPagePreview.tsx` | Conditionally show/hide download button, render watermark overlay |

