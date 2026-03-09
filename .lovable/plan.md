

# Plan: Public Access — ny tab i Share Manager

## Koncept

En ny tab "Public Access" bredvid Buckets och Quick Shares. Här skapar admin publika sidor/portaler — öppna webbsidor med bilder och brand assets som vem som helst kan se via en länk. Tänk media kit / press page.

## Nya filer

### `src/stores/publicPageStore.ts`
Store (localStorage, samma mönster som bucketStore) för publika sidor:
```ts
interface PublicPage {
  id: string;
  title: string;
  description: string;
  imageIds: string[];   // bilder + logo-IDs
  slug: string;         // genererad URL-slug
  published: boolean;
  createdAt: string;
}
```
CRUD-funktioner: `createPublicPage`, `updatePublicPage`, `deletePublicPage`, `addAssetsToPublicPage`, `removeAssetFromPublicPage`, `usePublicPages`.

### `src/components/PublicPageEditModal.tsx`
Dialog för att skapa/redigera en publik sida — titel, beskrivning, slug. Återanvänder samma mönster som `BucketEditModal`.

### `src/components/PublicPageDetailModal.tsx`
Detaljvy (som `BucketDetailModal`) — visar alla assets i sidan med typ/format-info och möjlighet att ta bort enskilda.

### `src/pages/PublicPagePreview.tsx`
Faktisk publik sida som renderas på route `/public/:slug`. Visar titel, beskrivning och ett bildgalleri. Ingen sidebar/layout — fristående sida. Besökare kan se och ladda ner bilder.

## Ändringar i befintliga filer

### `src/pages/ShareManager.tsx`
- Lägg till tredje tab `<TabsTrigger value="public-access">Public Access</TabsTrigger>`
- TabsContent med lista över publika sidor (kort med titel, antal assets, publicerad-status, slug/länk)
- Knappar: skapa ny, redigera, förhandsgranska, ta bort

### `src/App.tsx`
- Ny route: `<Route path="/public/:slug" element={<PublicPagePreview />} />` — utanför `AppLayout` (ingen sidebar)

## Filsammanfattning

| Fil | Åtgärd |
|-----|--------|
| `src/stores/publicPageStore.ts` | **Ny** — CRUD-store för publika sidor |
| `src/components/PublicPageEditModal.tsx` | **Ny** — skapa/redigera dialog |
| `src/components/PublicPageDetailModal.tsx` | **Ny** — detaljvy med assets |
| `src/pages/PublicPagePreview.tsx` | **Ny** — publik galleri-sida |
| `src/pages/ShareManager.tsx` | **Ändra** — lägg till Public Access-tab |
| `src/App.tsx` | **Ändra** — ny route `/public/:slug` |

