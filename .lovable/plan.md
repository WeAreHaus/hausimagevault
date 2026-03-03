

# Fix Upload Flow: Scrolling, Remove Mandatory Fields, Add Title & AI Alt Text

## Problems identified

1. **Can't reach image 2+**: The `ScrollArea` with `max-h-[calc(100vh-280px)]` is likely clipping content. Each metadata form is tall (~400px), so with 3 images the content overflows but scrolling doesn't work properly. Fix: remove `ScrollArea` wrapper and use normal page scrolling with `overflow-y-auto` on the container.

2. **Fields should not be mandatory**: Currently `isFileComplete` blocks the "Finalize Upload" button. Remove the `disabled={!allComplete}` constraint so users can finalize at any time. Keep the progress indicator as a soft nudge but not a blocker. Remove red border styling on empty fields and the destructive badge.

3. **Missing "Title" field**: Add a `title` field to `UploadedFile` and a corresponding input in the form.

4. **AI Alt Text generation**: Add a "Generate AI Alt Text" button per image in `MetadataEntryForm`, matching the pattern already used in `ImageDetailModal` (mock delayed result with `setTimeout`).

## Changes

### `src/components/MetadataEntryForm.tsx`
- Add `title: string` to `UploadedFile` interface
- Remove `requiredFields` array and the `isFileComplete` mandatory check -- replace with a softer "filled fields" counter
- Remove red/destructive styling; use neutral borders with a subtle highlight when fields are filled
- Add a "Title" input field (first field, full width)
- Add a "Generate AI Alt Text" button next to the Alt Text label (uses `setTimeout` mock, same as `ImageDetailModal`)
- Remove the `*` required markers from labels

### `src/pages/UploadFlow.tsx`
- Add `title: ""` to `createMockFiles`
- Remove `ScrollArea` -- use a simple `div` with `overflow-y-auto` and proper height so all images are scrollable
- Change "Finalize Upload" to always be enabled (remove `disabled={!allComplete}`)
- Keep progress bar as informational only ("X of Y images have metadata")
- Update `isFileComplete` usage to be purely visual (count of filled fields rather than blocker)
- Update description text to remove "required" language

