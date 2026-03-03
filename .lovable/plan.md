

# Plan: Aktivera dropzone + Fixa bucket-persistens

## Problem 1: Buckets försvinner

`bucketStore.ts` använder en modul-lokal `let buckets` variabel. Denna nollställs varje gång Vite gör en HMR-uppdatering (hot module reload) eftersom modulen laddas om och den initiala arrayen med bara 2 hårdkodade buckets återställs. Alla buckets som skapats under sessionen försvinner.

**Fix**: Spara buckets i `localStorage`. Vid modulstart, läs från localStorage. Vid varje mutation, skriv tillbaka. Behåll de 2 default-buckets som fallback om localStorage är tomt.

## Problem 2: Dropzone är inte interaktiv

Dropzonen i `UploadFlow.tsx` är bara visuell — den har ingen `<input type="file">` och hanterar inga drag-events. Den ska aktiveras så att man faktiskt kan välja filer från sin dator (bilder visas som thumbnails via `URL.createObjectURL`).

**Fix**: Lägg till en dold `<input type="file" multiple accept="image/*">` kopplad till dropzonen. Lägg till `onDragOver`/`onDrop`-handlers. När filer väljs, skapa `UploadedFile[]` med `URL.createObjectURL` som `previewUrl` och gå till metadata-steget. Behåll simuleringsknappar som alternativ.

## Ändringar

### `src/stores/bucketStore.ts`
- Läs initial state från `localStorage` (key `"dam-buckets"`), fallback till default-data
- I `emit()`, skriv `buckets` till `localStorage`

### `src/pages/UploadFlow.tsx`
- Lägg till `<input type="file" multiple accept="image/*" ref={fileInputRef}>` (dold)
- Klick på dropzone triggar `fileInputRef.current.click()`
- `onDragOver`, `onDragLeave`, `onDrop` handlers med visuell drag-state
- Konvertera `FileList` → `UploadedFile[]` med `URL.createObjectURL`
- Gå till metadata-steg automatiskt efter filval

