import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Upload, Copy, Check } from "lucide-react";
import { toast } from "sonner";

interface BrandAsset {
  id: string;
  name: string;
  category: "logo" | "favicon" | "color" | "font" | "other";
  src?: string;
  value?: string;
  format?: string;
  dimensions?: string;
}

const mockAssets: BrandAsset[] = [
  { id: "ba-1", name: "Logo – Primary (SVG)", category: "logo", src: "/placeholder.svg", format: "SVG", dimensions: "400×80" },
  { id: "ba-2", name: "Logo – White (PNG)", category: "logo", src: "/placeholder.svg", format: "PNG", dimensions: "800×160" },
  { id: "ba-3", name: "Logo – Icon Only", category: "logo", src: "/placeholder.svg", format: "SVG", dimensions: "120×120" },
  { id: "ba-4", name: "Favicon 32×32", category: "favicon", src: "/favicon.ico", format: "ICO", dimensions: "32×32" },
  { id: "ba-5", name: "Favicon 180×180", category: "favicon", src: "/placeholder.svg", format: "PNG", dimensions: "180×180" },
  { id: "ba-6", name: "Primary Teal", category: "color", value: "#4d998f" },
  { id: "ba-7", name: "Dark Navy", category: "color", value: "#262d33" },
  { id: "ba-8", name: "Warm Sand", category: "color", value: "#f7f5f2" },
  { id: "ba-9", name: "Accent Gold", category: "color", value: "#d4a843" },
  { id: "ba-10", name: "DM Sans", category: "font", value: "DM Sans" },
];

const categories = ["logo", "favicon", "color", "font"] as const;

const categoryLabels: Record<string, string> = {
  logo: "Logos",
  favicon: "Favicons",
  color: "Brand Colors",
  font: "Typography",
};

export default function BrandAssets() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    toast.success("Copied to clipboard");
  };

  return (
    <div className="p-6 lg:p-8 space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Brand Assets</h1>
          <p className="text-muted-foreground mt-1">Logos, colors, favicons, and brand guidelines</p>
        </div>
        <Button className="gap-1.5">
          <Upload className="h-4 w-4" /> Upload Asset
        </Button>
      </div>

      {categories.map((cat) => {
        const assets = mockAssets.filter((a) => a.category === cat);
        if (assets.length === 0) return null;

        return (
          <div key={cat} className="space-y-3">
            <h2 className="text-lg font-semibold">{categoryLabels[cat]}</h2>

            {cat === "color" ? (
              <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
                {assets.map((asset) => (
                  <Card key={asset.id} className="overflow-hidden">
                    <div className="h-20" style={{ backgroundColor: asset.value }} />
                    <CardContent className="p-3 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{asset.name}</p>
                        <p className="text-xs text-muted-foreground font-mono">{asset.value}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => handleCopy(asset.value!, asset.id)}
                      >
                        {copiedId === asset.id ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : cat === "font" ? (
              <div className="grid gap-3">
                {assets.map((asset) => (
                  <Card key={asset.id}>
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">{asset.name}</p>
                          <p className="text-2xl mt-2" style={{ fontFamily: asset.value }}>
                            The quick brown fox jumps over the lazy dog
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">Weights: 300, 400, 500, 600, 700</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                {assets.map((asset) => (
                  <Card key={asset.id}>
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="h-16 w-16 rounded border bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
                        {asset.src && (
                          <img src={asset.src} alt={asset.name} className="h-full w-full object-contain p-1" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{asset.name}</p>
                        <div className="flex gap-1.5 mt-1">
                          {asset.format && <Badge variant="secondary" className="text-xs font-normal">{asset.format}</Badge>}
                          {asset.dimensions && <Badge variant="outline" className="text-xs font-normal">{asset.dimensions}</Badge>}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
