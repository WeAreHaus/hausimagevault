

# Implementation Plan

## 1. Batch Publish to WordPress

Add a "Publish Selected" button in the bulk action bar (alongside "Share Selected" and "Add to Bucket"). Create a `BatchPublishModal` component that:
- Shows thumbnails of all selected images
- Runs a simulated multi-step publish process (resize, optimize, attach metadata, push to WP) with a progress bar across all images
- Marks each image as published upon completion
- Shows a summary when done

Changes: `ImageLibrary.tsx` (add button), new `BatchPublishModal.tsx`, `PublishModal.tsx` (reuse step definitions).

## 2. Video Category

Extend the data model to support a `mediaType: "image" | "video"` field on `ImageItem` (rename to `MediaItem` or keep and extend). Add mock video entries with a play icon overlay in the grid. Add a media type filter dropdown in the library. The detail modal adapts to show a video placeholder instead of an image preview.

Changes: `mockData.ts` (add field + mock video items), `ImageLibrary.tsx` (filter + video overlay), `ImageDetailModal.tsx` (video-aware preview).

## 3. User Roles & Role Switcher

Since this is a prototype without auth, implement a role context (`UserRoleContext`) with a role switcher in the sidebar. Two roles:

- **Admin/Editor** -- full access to all features (current behavior)
- **Supplier/Photographer** -- limited view: can upload images and must fill metadata, cannot access Share Manager, Brand Assets, etc.

The sidebar adapts navigation items based on role. A mock role toggle sits at the bottom of the sidebar.

Changes: New `UserRoleContext.tsx`, update `AppSidebar.tsx` (conditional nav items + role switcher).

## 4. Upload Flow with Mandatory Metadata

Create an `UploadFlow` page/modal accessible from both roles. The flow has two steps:

**Step 1 -- Drop Zone**: Drag-and-drop area or file picker. Simulates selecting multiple files. Shows thumbnails of "uploaded" files.

**Step 2 -- Metadata Form**: A scrollable list of uploaded images, each with required fields (photographer, copyright, description, alt text, tags). Fields are validated -- user cannot proceed until all required fields are filled. Visual indicators (red borders, completion percentage) make it clear what's missing. A progress bar shows "12 of 15 images complete". This enforces metadata entry without being frustrating.

For suppliers, this is the primary landing page. For admins, it's accessible via an "Upload" button in the library header.

Changes: New `UploadFlow.tsx` page, new `MetadataEntryForm.tsx` component, route in `App.tsx`, nav item in sidebar.

## Files to Create/Modify

| File | Action |
|------|--------|
| `src/components/BatchPublishModal.tsx` | Create -- batch publish simulation |
| `src/pages/UploadFlow.tsx` | Create -- upload + metadata entry flow |
| `src/components/MetadataEntryForm.tsx` | Create -- per-image metadata form with validation |
| `src/contexts/UserRoleContext.tsx` | Create -- role state + provider |
| `src/data/mockData.ts` | Modify -- add `mediaType` field, mock videos |
| `src/pages/ImageLibrary.tsx` | Modify -- add Publish button, media type filter, video overlay |
| `src/components/ImageDetailModal.tsx` | Modify -- video-aware preview |
| `src/components/AppSidebar.tsx` | Modify -- role-based nav + role switcher |
| `src/App.tsx` | Modify -- add upload route, wrap with role provider |

