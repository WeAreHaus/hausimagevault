import { imageStore } from "@/stores/imageStore";
import { getLogoById } from "@/stores/logoStore";
import { removeAssetFromPublicPage } from "@/stores/publicPageStore";
import type { PublicPage } from "@/stores/publicPageStore";
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
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { X, Globe, Image, Diamond } from "lucide-react";
import { toast } from "sonner";

interface Row {
  id: string;
  src: string;
  title: string;
  isLogo: boolean;
  format: string;
  date: string;
}

function resolveRows(ids: string[]): Row[] {
  const rows: Row[] = [];
  for (const id of ids) {
    if (id.startsWith("logo-")) {
      const logo = getLogoById(id);
      if (!logo) continue;
      rows.push({ id: logo.id, src: logo.previewUrl, title: logo.name, isLogo: true, format: logo.originalFormat, date: logo.uploadedAt });
    } else {
      const img = imageStore.getImages().find((i) => i.id === id);
      if (!img) continue;
      const ext = img.src.split(".").pop()?.toUpperCase() || "JPG";
      rows.push({ id: img.id, src: img.src, title: img.title, isLogo: false, format: ext, date: img.uploadedAt });
    }
  }
  return rows;
}

function formatDate(d: string) {
  try { return new Date(d).toLocaleDateString("sv-SE"); } catch { return d; }
}

interface Props {
  page: PublicPage | null;
  open: boolean;
  onClose: () => void;
}

export function PublicPageDetailModal({ page, open, onClose }: Props) {
  if (!page) return null;
  const rows = resolveRows(page.imageIds);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            <DialogTitle>{page.title}</DialogTitle>
            <Badge variant="secondary" className="text-xs font-normal ml-1">
              {rows.length} {rows.length === 1 ? "asset" : "assets"}
            </Badge>
          </div>
          {page.description && <DialogDescription>{page.description}</DialogDescription>}
        </DialogHeader>

        {rows.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Globe className="h-8 w-8 mx-auto mb-2 opacity-40" />
            <p className="text-sm">No assets added yet</p>
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
                  <TableHead className="w-24">Date</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="p-2">
                      <div className="h-10 w-10 rounded border overflow-hidden bg-muted">
                        <img src={row.src} alt={row.title} className="h-full w-full object-cover" />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-sm truncate max-w-[200px]">{row.title}</TableCell>
                    <TableCell>
                      {row.isLogo ? (
                        <Badge variant="outline" className="gap-1 text-xs font-normal"><Diamond className="h-3 w-3" />Logo</Badge>
                      ) : (
                        <Badge variant="secondary" className="gap-1 text-xs font-normal"><Image className="h-3 w-3" />Image</Badge>
                      )}
                    </TableCell>
                    <TableCell><span className="text-xs text-muted-foreground font-mono">{row.format}</span></TableCell>
                    <TableCell><span className="text-xs text-muted-foreground">{formatDate(row.date)}</span></TableCell>
                    <TableCell className="p-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive"
                        onClick={() => { removeAssetFromPublicPage(page.id, row.id); toast.success("Removed from page"); }}>
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
