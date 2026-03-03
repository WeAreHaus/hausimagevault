import { imageStore } from "@/stores/imageStore";
import type { ImageItem } from "@/data/mockData";
import { getLogosByIds, getLogoById, type LogoAsset } from "@/stores/logoStore";
import { removeImageFromBucket } from "@/stores/bucketStore";
import type { Bucket } from "@/stores/bucketStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { X, FolderOpen, Image, Diamond } from "lucide-react";
import { toast } from "sonner";

const VECTOR_FORMATS = ["SVG", "AI", "PDF", "EPS"];

interface ResolvedAsset {
  id: string;
  src: string;
  title: string;
  isVector: boolean;
  originalFormat: string;
  fileSize: string;
  uploadedAt: string;
}

function resolveToDetailAssets(ids: string[]): ResolvedAsset[] {
  return ids.map((id) => {
    if (id.startsWith("logo-")) {
      const logo = getLogoById(id);
      if (!logo) return null;
      return {
        id: logo.id,
        src: logo.previewUrl,
        title: logo.name,
        isVector: VECTOR_FORMATS.includes(logo.originalFormat),
        originalFormat: logo.originalFormat,
        fileSize: "—",
        uploadedAt: logo.uploadedAt,
      };
    }
    const img = imageStore.getImages().find((i) => i.id === id);
    if (!img) return null;
    const ext = img.src.split(".").pop()?.toUpperCase() || "JPG";
    return {
      id: img.id,
      src: img.src,
      title: img.title,
      isVector: false,
      originalFormat: ext,
      fileSize: img.fileSize || "—",
      uploadedAt: img.uploadedAt,
    };
  }).filter(Boolean) as ResolvedAsset[];
}

function formatDate(d: string) {
  try {
    return new Date(d).toLocaleDateString("sv-SE");
  } catch {
    return d;
  }
}

interface BucketDetailModalProps {
  bucket: Bucket | null;
  open: boolean;
  onClose: () => void;
}

export function BucketDetailModal({ bucket, open, onClose }: BucketDetailModalProps) {
  if (!bucket) return null;

  const assets = resolveToDetailAssets(bucket.imageIds);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5 text-primary" />
            <DialogTitle>{bucket.name}</DialogTitle>
            <Badge variant="secondary" className="text-xs font-normal ml-1">
              {assets.length} {assets.length === 1 ? "file" : "files"}
            </Badge>
          </div>
          {bucket.description && (
            <DialogDescription>{bucket.description}</DialogDescription>
          )}
        </DialogHeader>

        {assets.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <FolderOpen className="h-8 w-8 mx-auto mb-2 opacity-40" />
            <p className="text-sm">This bucket is empty</p>
          </div>
        ) : (
          <div className="overflow-auto flex-1 -mx-6 px-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-14"></TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="w-24">Type</TableHead>
                  <TableHead className="w-20">Format</TableHead>
                  <TableHead className="w-20">Size</TableHead>
                  <TableHead className="w-24">Date</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assets.map((asset) => (
                  <TableRow key={asset.id}>
                    <TableCell className="p-2">
                      <div className="h-10 w-10 rounded border overflow-hidden bg-muted flex-shrink-0">
                        <img
                          src={asset.src}
                          alt={asset.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-sm truncate max-w-[200px]">
                      {asset.title}
                    </TableCell>
                    <TableCell>
                      {asset.isVector ? (
                        <Badge variant="outline" className="gap-1 text-xs font-normal">
                          <Diamond className="h-3 w-3" />
                          Vector
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="gap-1 text-xs font-normal">
                          <Image className="h-3 w-3" />
                          Image
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-muted-foreground font-mono">
                        {asset.originalFormat}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-muted-foreground">
                        {asset.fileSize}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(asset.uploadedAt)}
                      </span>
                    </TableCell>
                    <TableCell className="p-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-destructive"
                        onClick={() => {
                          removeImageFromBucket(bucket.id, asset.id);
                          toast.success("Removed from bucket");
                        }}
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
