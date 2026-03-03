

# Plan: Logo Management i Brand Assets

## Vad

Bygga ut logo-sektionen på Brand Assets till ett fullständigt hanteringssystem med uppladdning, namngivning, förhandsvisning, och mock-nedladdning i pixelformat. Loggor ska också kunna läggas till i buckets och delas via Quick Share — precis som bilder.

Allt är dummy/mock UI — ingen riktig filkonvertering eller backend.

## Datamodell

Ny store `src/stores/logoStore.ts` (samma mönster som `imageStore`/`bucketStore` med localStorage + useSyncExternalStore):

```text
LogoAsset {
  id: string
  name: string               // t.ex. "Primary Logo", "Icon Only", "White Version"
  originalFormat: string      // "SVG" | "AI" | "PDF" | "EPS"
  previewUrl: string          // blob-URL eller placeholder
  fileName: string            // originalfilnamn
  uploadedAt: string
  dimensions?: string
}
```

Funktioner: `useLogos()`, `addLogo(file, name)`, `removeLogo(id)`, `updateLogoName(id, name)`

## UI-ändringar i `src/pages/BrandAssets.tsx`

### Logo-sektionen ersätts med:
1. **"Upload Logo" knapp** — öppnar en upload-modal
2. **Logo-grid** (liknande nuvarande men rikare kort):
   - Förhandsvisning (thumbnail)
   - Namn (redigerbart inline)
   - Original-format badge (SVG/AI/PDF/EPS)
   - **"Download as…"** dropdown med mock-alternativ: WebP, PNG, JPG
   - **Kontextmeny/knappar**: "Add to Bucket", "Quick Share", "Delete"
3. Tom-state med upload CTA om inga loggor finns

### Upload-modal (`src/components/LogoUploadModal.tsx`)
- Drag-and-drop zon + filväljare
- Accepterar: `.svg`, `.ai`, `.pdf`, `.eps` (validering på filändelse)
- Fält för namn (förifylt med filnamn utan ändelse)
- Info-text: *"Upload vector source files (SVG, AI, PDF, EPS). Pixel formats can be generated on download."*
- Upload-knapp → lägger till i logoStore, toast bekräftelse

### Nedladdning (mock)
"Download as…" dropdown som visar WebP/PNG/JPG. Klick triggar en toast: *"Generating [format]… (mock)"* — ingen riktig konvertering.

### Bucket/Share-integration
- "Add to Bucket" öppnar befintlig `AddToBucketModal` med logo-id som imageId (återanvänder samma bucket-system)
- "Quick Share" öppnar `ShareModal` med logon som en pseudo-ImageItem

## Filer som skapas/ändras

| Fil | Åtgärd |
|-----|--------|
| `src/stores/logoStore.ts` | **Ny** — store med localStorage-persistens |
| `src/components/LogoUploadModal.tsx` | **Ny** — upload-dialog med drag-drop + namngivning |
| `src/pages/BrandAssets.tsx` | **Ändra** — ersätt statisk logo-lista med dynamisk från logoStore, lägg till upload/download/bucket/share-knappar |

