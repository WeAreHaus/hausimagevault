

## Plan: Add Tag Creation & Assignment in Image Library

The TagFilterPopover currently only filters — it cannot create new tags or assign them to images. We need to enhance it so users can:

1. **Create new tags** by typing a name and pressing Enter/clicking a button when no match exists
2. **Assign tags to selected images** from the popover (bulk tagging)

### Changes

**`src/components/TagFilterPopover.tsx`**
- Add an input field at the top that doubles as search + create. When the typed tag doesn't exist, show a "Create & add [tag]" button
- When images are selected (pass `selectedIds` as prop), toggling a tag assigns/removes it from those images via `imageStore.updateImage`
- When no images are selected, it behaves as a filter (current behavior)
- Show a visual indicator (checkmark) next to tags that are already on all selected images

**`src/pages/ImageLibrary.tsx`**
- Pass `selectedIds` to `TagFilterPopover` so it knows when to switch between filter mode and assign mode

### Behavior
- **No selection**: popover works as filter (current)
- **Images selected**: popover works as tag assigner — toggling a tag adds/removes it from selected images
- **Create**: typing a new tag name + pressing Enter creates the tag and assigns it to selected images (or adds it to the filter if none selected)

