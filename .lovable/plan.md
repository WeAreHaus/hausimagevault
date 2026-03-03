

# Plan: Bucket Detail View

## Vad

Ny komponent `BucketDetailModal` som öppnas när man klickar på en bucket i Share Manager. Visar alla filer i bucketen i en tabell/lista med metadata — speciellt relevant nu med loggor som kan vara vektor eller pixel.

## UI

En fullwidth dialog med:
- **Header**: Bucket-namn, beskrivning, antal filer
- **Fillista** (tabell): varje rad visar:
  - Thumbnail
  - Namn/titel
  - Typ-badge: "Vector" (SVG/AI/PDF/EPS) eller "Image" (JPG/PNG etc)
  - Originalformat (t.ex. "SVG", "JPG")
  - Filstorlek (om tillgänglig)
  - Uppladdningsdatum
  - Ta bort-knapp (X)
- Tom-state om bucketen är tom

Klick på bucket-namn eller en ny "Open"-knapp i bucket-kortet öppnar modalen.

## Filer

| Fil | Åtgärd |
|-----|--------|
| `src/components/BucketDetailModal.tsx` | **Ny** — dialog med fillista, resolvar både images och logos, visar typ/format-info |
| `src/pages/ShareManager.tsx` | **Ändra** — lägg till state för `detailBucket`, klickbar bucket-titel + "Open"-knapp som öppnar detaljvyn |

## Logik

- Återanvänd `resolveAssets()` som redan finns i ShareManager
- För logos: visa `originalFormat` (SVG/AI/PDF/EPS) och badge "Vector"
- För vanliga bilder: visa filstorlek, dimensioner, badge "Image"
- Remove-knapp anropar `removeImageFromBucket`

