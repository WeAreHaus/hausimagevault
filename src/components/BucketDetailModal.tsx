import { imageStore } from "@/stores/imageStore";
import type { ImageItem } from "@/data/mockData";
import { getLogoById, type LogoAsset } from "@/stores/logoStore";
import { removeImageFromBucket } from "@/stores/bucketStore";
import type { Bucket, AssetDeliveryOptions } from "@/stores/bucketStore";
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

const SIZE_LABELS: Record<string, string> = {
  S: "512px",
  L: "1024px",
  XL: "2048px",
};

interface DetailRow {
  id: string;           // original asset id
  rowKey: string;       // unique key for React
  src: string;
  title: string;
  isVector: boolean;
  originalFormat: string;
  fileSize: string;
  uploadedAt: string;
  deliveryLabel?: string; // e.g. "PNG · L (1024px)"
}

function resolveToDetailRows(ids: string[], assetOptions?: Record<string, AssetDeliveryOptions>): DetailRow[] {
  const rows: DetailRow[] = [];

  for (const id of ids) {
    if (id.startsWith("logo-")) {
      const logo = getLogoById(id);
      if (!logo) continue;

      const opts = assetOptions?.[id];

      if (!opts) {
        // No delivery options stored — show as single vector row
        rows.push({
          id: logo.id,
          rowKey: logo.id,
          src: logo.previewUrl,
          title: logo.name,
          isVector: VECTOR_FORMATS.includes(logo.originalFormat),
          originalFormat: logo.originalFormat,
          fileSize: "—",
          uploadedAt: logo.uploadedAt,
        });
        continue;
      }

      // Original vector row
      if (opts.includeOriginal) {
        rows.push({
          id: logo.id,
          rowKey: `${logo.id}-original`,
          src: logo.previewUrl,
          title: logo.name,
          isVector: true,
          originalFormat: logo.originalFormat,
          fileSize: "—",
          uploadedAt: logo.uploadedAt,
          deliveryLabel: "Original",
        });
      }

      // Pixel variant rows — one per format × size combo
      if (opts.pixelFormats.length > 0 && opts.pixelSizes.length > 0) {
        for (const fmt of opts.pixelFormats) {
          for (const size of opts.pixelSizes) {
            rows.push({
              id: logo.id,
              rowKey: `${logo.id}-${fmt}-${size}`,
              src: logo.previewUrl,
              title: logo.name,
              isVector: false,
              originalFormat: fmt.toUpperCase(),
              fileSize: SIZE_LABELS[size] || size,
              uploadedAt: logo.uploadedAt,
              deliveryLabel: `${fmt} · ${size} (${SIZE_LABELS[size] || size})`,
            });
          }
        }
      }
    } else {
      const img = imageStore.getImages().find((i) => i.id === id);
      if (!img) continue;
      const ext = img.src.split(".").pop()?.toUpperCase() || "JPG";
      rows.push({
        id: img.id,
        rowKey: img.id,
        src: img.src,
        title: img.title,
        isVector: false,
        originalFormat: ext,
        fileSize: img.fileSize || "—",
        uploadedAt: img.uploadedAt,
      });
    }
  }

  return rows;
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

  const rows = resolveToDetailRows(bucket.imageIds, bucket.assetOptions);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5 text-primary" />
            <DialogTitle>{bucket.name}</DialogTitle>
            <Badge variant="secondary" className="text-xs font-normal ml-1">
              {rows.length} {rows.length === 1 ? "file" : "files"}
            </Badge>
          </div>
          {bucket.description && (
            <DialogDescription>{bucket.description}</DialogDescription>
          )}
        </DialogHeader>

        {rows.length === 0 ? (
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
                {rows.map((row) => (
                  <TableRow key={row.rowKey}>
                    <TableCell className="p-2">
                      <div className="h-10 w-10 rounded border overflow-hidden bg-muted flex-shrink-0">
                        <img
                          src={row.src}
                          alt={row.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-sm">
                      <div className="truncate max-w-[200px]">{row.title}</div>
                      {row.deliveryLabel && (
                        <span className="text-xs text-muted-foreground">{row.deliveryLabel}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {row.isVector ? (
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
                        {row.originalFormat}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-muted-foreground">
                        {row.fileSize}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(row.uploadedAt)}
                      </span>
                    </TableCell>
                    <TableCell className="p-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-destructive"
                        onClick={() => {
                          removeImageFromBucket(bucket.id, row.id);
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
