

## Plan: Improved Image Card Selection & Edit UX

### Problem
Currently the image card has a tiny checkbox (top-left, hidden until hover) for selection, and clicking anywhere else opens the detail/edit modal. The checkbox is hard to hit, and there's no clear visual separation between "select" and "edit" actions.

### Solution
Flip the primary action: **clicking the card image selects/deselects it**. Add a small **edit (pencil) button** that opens the detail modal.

### Design

**Clicking the image thumbnail area** → toggles selection (replaces the tiny checkbox as the primary interaction)

**Edit button** → a small pencil icon button in the bottom-right corner of the image area (appears on hover, always visible when selected), opens `ImageDetailModal`

**Selection visual** → keep the existing `ring-2 ring-primary` border + add a checkmark overlay on the image when selected

**Remove the Checkbox** — the entire image area becomes the click target for selection, making it much easier to hit

### Changes — single file

**`src/pages/ImageLibrary.tsx`** (lines 243-290):
- Replace the outer `<button onClick={() => setSelectedImage(img)}>` wrapper — make the image `<div>` area clickable for selection (`toggleSelect`)
- Remove the small `<Checkbox>` overlay
- Add a visible check icon overlay on the image when selected (centered or top-left, larger than current checkbox)
- Add a small edit button (Pencil icon) in the bottom-right of the image area that calls `setSelectedImage(img)` with `e.stopPropagation()`
- Keep the info section below the image non-interactive (just displays metadata)
- Import `Pencil` (or `PenLine`) and `Check` from lucide-react

