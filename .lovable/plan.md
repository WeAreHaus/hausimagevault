

# Plan: Uppdatera Share Manager-vyn

## Ändringar i `src/pages/ShareManager.tsx`

### 1. Ta bort "New Share Link"-knappen
Remove the button + `showCreate` state from Quick Shares-tabben. Quick Shares skapas via bildbiblioteket, inte härifrån.

### 2. Lägg till beskrivningar under respektive tab
- **Buckets tab**: Kort beskrivning typ: *"Buckets are reusable collections of images that you can organize, update, and share multiple times."*
- **Quick Shares tab**: Kort beskrivning typ: *"Quick Shares are one-time share links created directly from the image library. They are not saved as collections."*

Placeras som en `<p className="text-sm text-muted-foreground">` direkt under varje `TabsContent`-start.

### 3. Lägg till "New Bucket"-knapp i Buckets-tabben
En `<Button>` med `<Plus>` ikon och texten "New Bucket" placerad till höger, ovanför bucket-listan. Klick öppnar `BucketEditModal` med `bucket=null` (nytt läge). Kräver en liten uppdatering av `BucketEditModal` för att hantera create-läge (anropa `createBucket` från bucketStore istället för `updateBucket`).

### 4. Uppdatera `src/components/BucketEditModal.tsx`
Stöd för create-läge: om `bucket` är `null`, visa titeln "New Bucket" och anropa `createBucket(name, description)` vid spara istället för `updateBucket`.

### 5. Eventuell ny export i `src/stores/bucketStore.ts`
Verifiera att `createBucket(name, description)` finns — om inte, skapa den (liknar befintlig `addBucket` men utan imageIds).

