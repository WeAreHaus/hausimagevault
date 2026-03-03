import { useParams } from "react-router-dom";
import { getPublicPageBySlug } from "@/stores/publicPageStore";
import { imageStore } from "@/stores/imageStore";
import { getLogoById } from "@/stores/logoStore";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Asset {
  id: string;
  src: string;
  title: string;
}

function resolveAssets(ids: string[]): Asset[] {
  const assets: Asset[] = [];
  for (const id of ids) {
    if (id.startsWith("logo-")) {
      const logo = getLogoById(id);
      if (logo) assets.push({ id: logo.id, src: logo.previewUrl, title: logo.name });
    } else {
      const img = imageStore.getImages().find((i) => i.id === id);
      if (img) assets.push({ id: img.id, src: img.src, title: img.title });
    }
  }
  return assets;
}

export default function PublicPagePreview() {
  const { slug } = useParams<{ slug: string }>();
  const page = slug ? getPublicPageBySlug(slug) : undefined;

  if (!page || !page.published) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold">Page not found</h1>
          <p className="text-muted-foreground">This page doesn't exist or hasn't been published yet.</p>
        </div>
      </div>
    );
  }

  const assets = resolveAssets(page.imageIds);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b">
        <div className="max-w-5xl mx-auto px-6 py-10">
          <h1 className="text-3xl font-bold tracking-tight">{page.title}</h1>
          {page.description && (
            <p className="text-muted-foreground mt-2 max-w-2xl">{page.description}</p>
          )}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {assets.length === 0 ? (
          <p className="text-muted-foreground text-center py-16">No assets on this page.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {assets.map((asset) => (
              <div key={asset.id} className="group relative rounded-lg border overflow-hidden bg-muted">
                <img src={asset.src} alt={asset.title} className="w-full aspect-square object-cover" />
                <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-3">
                  <p className="text-sm font-medium text-center truncate w-full">{asset.title}</p>
                  <Button size="sm" variant="secondary" className="gap-1.5" asChild>
                    <a href={asset.src} download={asset.title}>
                      <Download className="h-3.5 w-3.5" /> Download
                    </a>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
