

# Plan: Uppladdade bilder visas i biblioteket + sortering

## Problem

`handleFinalize` i `UploadFlow.tsx` visar bara en toast — den lägger aldrig till bilderna i någon delad state. `ImageLibrary` läser direkt från den statiska `mockImages`-arrayen i `mockData.ts`, så uppladdade bilder syns aldrig.

## Lösning

Skapa en **imageStore** (samma mönster som `bucketStore`) som håller alla bilder — både mock-data och uppladdade. Persistera i `localStorage` så bilder överlever sidladdningar.

### Ändringar

#### Ny fil: `src/stores/imageStore.ts`
- Exportera en reaktiv store med `subscribe`/`getImages`-mönster (samma som bucketStore)
- Initialt: ladda från `localStorage`, fallback till `mockImages`
- `addImages(files: UploadedFile[])` — konverterar `UploadedFile` till `ImageItem` och lägger till i listan med `uploadedAt: new Date().toISOString()`
- Persistera till `localStorage` vid varje mutation

#### `src/pages/UploadFlow.tsx`
- I `handleFinalize`: anropa `imageStore.addImages(files)` för att spara bilderna

#### `src/pages/ImageLibrary.tsx`
- Byt från statisk `mockImages`-import till `imageStore.getImages()` med `useSyncExternalStore` (eller subscribe-pattern)
- Lägg till en **sorteringsväljare** (Select) i filter-raden med alternativen:
  - "Newest first" (standard) — sorterar på `uploadedAt` desc
  - "Oldest first" — sorterar på `uploadedAt` asc
  - "Title A–Z"
  - "Title Z–A"
- Uppdatera `photographers`, `guides`, `groupIds`, `allTags` att deriveras från den dynamiska listan istället för statiska exporter

