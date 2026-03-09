

## Plan: Multi-tag filter med sökbar, kategoriserad tag-picker

### Problem
Med 40+ taggar i en enkel dropdown blir det svårt att hitta rätt. Användare behöver kunna välja **flera taggar** samtidigt och snabbt hitta dem.

### Lösning: Searchable multi-select tag popover

En popover-baserad komponent som ersätter den nuvarande single-select dropdown:

1. **Trigger-knapp** visar "Tags" + antal valda som badge, t.ex. `Tags (3)`
2. **Popover-innehåll**:
   - Sökfält högst upp för att filtrera taggar i realtid
   - Taggarna visas som klickbara chips/badges i ett wrappande grid (inte en lista) — mer kompakt, lättskummat
   - Varje chip togglar on/off med tydlig visuell markering (fylld = aktiv)
   - "Clear all" länk när taggar är valda
3. **Valda taggar visas som badges** under filterfältet (eller inline) som går att klicka bort med X

### Filterlogik
- `filterTag: string` → `selectedTags: Set<string>`
- En bild matchar om den har **alla** valda taggar (AND-logik) — ger progressiv insnävning
- Popovern visar antal matchande bilder per tag (contextual counts)

### Tekniska ändringar

| Fil | Ändring |
|-----|---------|
| `src/components/TagFilterPopover.tsx` | **Ny** — Popover med sökfält + chip-grid, multi-select, counts |
| `src/pages/ImageLibrary.tsx` | Byt `filterTag: string` → `selectedTags: Set<string>`, uppdatera filterlogik till AND, ersätt tag-Select med `<TagFilterPopover>`, visa valda taggar som dismissable badges |

### UI-detaljer
- Byggs med befintliga `Popover`, `Input`, `Badge`, `Button` komponenter — inga nya dependencies
- Chips i popovern: `Badge variant="outline"` (ej vald) / `Badge variant="default"` (vald)
- Sökfältet filtrerar taggnamn med fuzzy contains-match
- Varje tag-chip visar count: `fjord (12)`
- Max-höjd på chip-arean med scroll vid behov

