import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Copy, Check, Download, FolderPlus, Share2, Trash2, Pencil, Plus } from "lucide-react";
import { S3Image } from "@/components/S3Image";
import { toast } from "sonner";
import { useLogos, removeLogo, updateLogoName, type LogoAsset } from "@/stores/logoStore";
import { useBrandColors, addBrandColor, updateBrandColor, removeBrandColor } from "@/stores/brandColorStore";
import { LogoUploadModal } from "@/components/LogoUploadModal";
import { AddToBucketModal } from "@/components/AddToBucketModal";
import { ShareModal } from "@/components/ShareModal";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { ImageItem } from "@/data/mockData";
import { getCurrentVaultId } from "@/stores/vaultScope";

interface BrandAsset {
  id: string;
  name: string;
  category: "favicon" | "font";
  src?: string;
  value?: string;
  format?: string;
  dimensions?: string;
}

const mockAssetsV1: BrandAsset[] = [
  { id: "ba-4", name: "Favicon 32×32", category: "favicon", src: "/favicon.ico", format: "ICO", dimensions: "32×32" },
  { id: "ba-5", name: "Favicon 180×180", category: "favicon", src: "/placeholder.svg", format: "PNG", dimensions: "180×180" },
  { id: "ba-10", name: "DM Sans", category: "font", value: "DM Sans" },
];

function getMockAssets(): BrandAsset[] {
  return getCurrentVaultId() === "v1" ? mockAssetsV1 : [];
}

const categories = ["favicon", "font"] as const;
const categoryLabels: Record<string, string> = {
  favicon: "Favicons",
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
    license: "",
    tourDate: "",
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
  const [colorEditId, setColorEditId] = useState<string | null>(null);
  const [colorEditName, setColorEditName] = useState("");
  const [colorEditValue, setColorEditValue] = useState("#000000");
  const [showAddColor, setShowAddColor] = useState(false);
  const [newColorName, setNewColorName] = useState("");
  const [newColorValue, setNewColorValue] = useState("#000000");

  const logos = useLogos();
  const brandColors = useBrandColors();

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

      {/* === BRAND COLORS === */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Brand Colors</h2>
          {!showAddColor && (
            <Button size="sm" variant="outline" className="gap-1.5" onClick={() => setShowAddColor(true)}>
              <Plus className="h-4 w-4" /> Add Color
            </Button>
          )}
        </div>

        {showAddColor && (
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <input
                type="color"
                value={newColorValue}
                onChange={(e) => setNewColorValue(e.target.value)}
                className="h-10 w-10 rounded border cursor-pointer shrink-0"
              />
              <Input
                value={newColorName}
                onChange={(e) => setNewColorName(e.target.value)}
                placeholder="Color name…"
                className="flex-1"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter" && newColorName.trim()) {
                    addBrandColor(newColorName.trim(), newColorValue);
                    toast.success(`Added "${newColorName.trim()}"`);
                    setNewColorName("");
                    setNewColorValue("#000000");
                    setShowAddColor(false);
                  }
                }}
              />
              <Button
                size="sm"
                disabled={!newColorName.trim()}
                onClick={() => {
                  addBrandColor(newColorName.trim(), newColorValue);
                  toast.success(`Added "${newColorName.trim()}"`);
                  setNewColorName("");
                  setNewColorValue("#000000");
                  setShowAddColor(false);
                }}
              >
                Add
              </Button>
              <Button size="sm" variant="ghost" onClick={() => { setShowAddColor(false); setNewColorName(""); setNewColorValue("#000000"); }}>
                Cancel
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
          {brandColors.map((color) => (
            <Card key={color.id} className="overflow-hidden">
              <div className="h-20 relative" style={{ backgroundColor: colorEditId === color.id ? colorEditValue : color.value }}>
                {colorEditId === color.id && (
                  <label className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black/20 hover:bg-black/30 transition-colors">
                    <span className="text-xs font-medium text-white bg-black/40 px-2 py-1 rounded">Click to change</span>
                    <input
                      type="color"
                      value={colorEditValue}
                      onChange={(e) => setColorEditValue(e.target.value)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </label>
                )}
              </div>
              <CardContent className="p-3">
                {colorEditId === color.id ? (
                  <div className="space-y-2">
                    <Input
                      value={colorEditName}
                      onChange={(e) => setColorEditName(e.target.value)}
                      className="h-7 text-sm"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          updateBrandColor(color.id, { name: colorEditName.trim() || color.name, value: colorEditValue });
                          setColorEditId(null);
                          toast.success("Color updated");
                        }
                      }}
                    />
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        className="h-6 text-xs flex-1"
                        onClick={() => {
                          updateBrandColor(color.id, { name: colorEditName.trim() || color.name, value: colorEditValue });
                          setColorEditId(null);
                          toast.success("Color updated");
                        }}
                      >
                        Save
                      </Button>
                      <Button size="sm" variant="ghost" className="h-6 text-xs" onClick={() => setColorEditId(null)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{color.name}</p>
                      <p className="text-xs text-muted-foreground font-mono">{color.value}</p>
                    </div>
                    <div className="flex items-center gap-0.5">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleCopy(color.value, color.id)}>
                        {copiedId === color.id ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setColorEditId(color.id); setColorEditName(color.name); setColorEditValue(color.value); }}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => { removeBrandColor(color.id); toast.success(`Deleted "${color.name}"`); }}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* === OTHER CATEGORIES === */}
      {categories.map((cat) => {
        const assets = getMockAssets().filter((a) => a.category === cat);
        if (assets.length === 0) return null;

        return (
          <div key={cat} className="space-y-3">
            <h2 className="text-lg font-semibold">{categoryLabels[cat]}</h2>

            {cat === "font" ? (
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
