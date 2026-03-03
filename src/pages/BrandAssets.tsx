import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Copy, Check, Download, FolderPlus, Share2, Trash2, Pencil } from "lucide-react";
import { toast } from "sonner";
import { useLogos, removeLogo, updateLogoName, type LogoAsset } from "@/stores/logoStore";
import { LogoUploadModal } from "@/components/LogoUploadModal";
import { AddToBucketModal } from "@/components/AddToBucketModal";
import { ShareModal } from "@/components/ShareModal";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { ImageItem } from "@/data/mockData";

interface BrandAsset {
  id: string;
  name: string;
  category: "favicon" | "color" | "font";
  src?: string;
  value?: string;
  format?: string;
  dimensions?: string;
}

const mockAssets: BrandAsset[] = [
  { id: "ba-4", name: "Favicon 32×32", category: "favicon", src: "/favicon.ico", format: "ICO", dimensions: "32×32" },
  { id: "ba-5", name: "Favicon 180×180", category: "favicon", src: "/placeholder.svg", format: "PNG", dimensions: "180×180" },
  { id: "ba-6", name: "Primary Teal", category: "color", value: "#4d998f" },
  { id: "ba-7", name: "Dark Navy", category: "color", value: "#262d33" },
  { id: "ba-8", name: "Warm Sand", category: "color", value: "#f7f5f2" },
  { id: "ba-9", name: "Accent Gold", category: "color", value: "#d4a843" },
  { id: "ba-10", name: "DM Sans", category: "font", value: "DM Sans" },
];

const categories = ["favicon", "color", "font"] as const;
const categoryLabels: Record<string, string> = {
  favicon: "Favicons",
  color: "Brand Colors",
  font: "Typography",
};

const DOWNLOAD_FORMATS = ["WebP", "PNG", "JPG"];

function logoToImageItem(logo: LogoAsset): ImageItem {
  return {
    id: logo.id,
    src: logo.previewUrl,
    title: logo.name,
    photographer: "",
    copyright: "",
    tourDate: "",
    groupId: "",
    guide: "",
    description: "",
    altText: logo.name,
    tags: ["logo"],
    status: [],
    width: 0,
    height: 0,
    fileSize: "",
    uploadedAt: logo.uploadedAt,
    mediaType: "image",
  };
}

export default function BrandAssets() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [bucketLogoId, setBucketLogoId] = useState<string | null>(null);
  const [shareLogo, setShareLogo] = useState<LogoAsset | null>(null);

  const logos = useLogos();

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    toast.success("Copied to clipboard");
  };

  const handleDownload = (logo: LogoAsset, format: string) => {
    toast.success(`Generating ${format} for "${logo.name}"… (mock)`);
  };

  const handleDelete = (logo: LogoAsset) => {
    removeLogo(logo.id);
    toast.success(`Deleted "${logo.name}"`);
  };

  const startEdit = (logo: LogoAsset) => {
    setEditingId(logo.id);
    setEditName(logo.name);
  };

  const saveEdit = () => {
    if (editingId && editName.trim()) {
      updateLogoName(editingId, editName.trim());
    }
    setEditingId(null);
  };

  return (
    <div className="p-6 lg:p-8 space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Brand Assets</h1>
          <p className="text-muted-foreground mt-1">Logos, colors, favicons, and brand guidelines</p>
        </div>
      </div>

      {/* === LOGOS === */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Logos</h2>
          <Button size="sm" className="gap-1.5" onClick={() => setUploadOpen(true)}>
            <Upload className="h-4 w-4" /> Upload Logo
          </Button>
        </div>

        {logos.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Upload className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
              <p className="text-sm font-medium">No logos uploaded yet</p>
              <p className="text-xs text-muted-foreground mt-1">Upload vector source files (SVG, AI, PDF, EPS) to get started</p>
              <Button size="sm" className="mt-4 gap-1.5" onClick={() => setUploadOpen(true)}>
                <Upload className="h-4 w-4" /> Upload Logo
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            {logos.map((logo) => (
              <Card key={logo.id}>
                <CardContent className="p-4 space-y-3">
                  <div className="h-24 rounded border bg-muted flex items-center justify-center overflow-hidden">
                    <img src={logo.previewUrl} alt={logo.name} className="h-full w-full object-contain p-2" />
                  </div>

                  {editingId === logo.id ? (
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onBlur={saveEdit}
                      onKeyDown={(e) => e.key === "Enter" && saveEdit()}
                      autoFocus
                      className="h-8 text-sm"
                    />
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-medium truncate flex-1">{logo.name}</p>
                      <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={() => startEdit(logo)}>
                        <Pencil className="h-3 w-3" />
                      </Button>
                    </div>
                  )}

                  <div className="flex items-center gap-1.5">
                    <Badge variant="secondary" className="text-xs font-normal">{logo.originalFormat}</Badge>
                    <span className="text-xs text-muted-foreground truncate">{logo.fileName}</span>
                  </div>

                  <div className="flex items-center gap-1 flex-wrap">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-1 h-7 text-xs">
                          <Download className="h-3 w-3" /> Download as…
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-36 p-1" align="start">
                        {DOWNLOAD_FORMATS.map((fmt) => (
                          <button
                            key={fmt}
                            onClick={() => handleDownload(logo, fmt)}
                            className="w-full text-left text-sm px-3 py-1.5 rounded hover:bg-accent transition-colors"
                          >
                            {fmt}
                          </button>
                        ))}
                      </PopoverContent>
                    </Popover>

                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setBucketLogoId(logo.id)}>
                      <FolderPlus className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setShareLogo(logo)}>
                      <Share2 className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleDelete(logo)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* === OTHER CATEGORIES === */}
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

      {/* Modals */}
      <LogoUploadModal open={uploadOpen} onClose={() => setUploadOpen(false)} />
      <AddToBucketModal
        open={!!bucketLogoId}
        onClose={() => setBucketLogoId(null)}
        imageIds={bucketLogoId ? [bucketLogoId] : []}
      />
      <ShareModal
        open={!!shareLogo}
        onClose={() => setShareLogo(null)}
        preselectedImages={shareLogo ? [logoToImageItem(shareLogo)] : []}
      />
    </div>
  );
}
