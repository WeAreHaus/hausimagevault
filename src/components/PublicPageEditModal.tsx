import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import type { PublicPage } from "@/stores/publicPageStore";
import { updatePublicPage, createPublicPage } from "@/stores/publicPageStore";
import { toast } from "sonner";

interface Props {
  page: PublicPage | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PublicPageEditModal({ page, isOpen, onClose }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [slug, setSlug] = useState("");
  const [downloadOption, setDownloadOption] = useState<"high-res" | "low-res" | "none">("low-res");
  const [watermark, setWatermark] = useState(false);
  const isCreate = !page;

  useEffect(() => {
    if (page) {
      setTitle(page.title);
      setDescription(page.description);
      setSlug(page.slug);
      setDownloadOption(page.downloadOption ?? "low-res");
      setWatermark(page.watermark ?? false);
    } else {
      setTitle("");
      setDescription("");
      setSlug("");
      setDownloadOption("low-res");
      setWatermark(false);
    }
  }, [page, isOpen]);

  const handleSave = () => {
    if (!title.trim()) return;
    if (page) {
      updatePublicPage(page.id, {
        title: title.trim(),
        description: description.trim(),
        slug: slug.trim() || undefined,
        downloadOption,
        watermark,
      });
      toast.success("Public page updated");
    } else {
      const created = createPublicPage(title.trim(), description.trim());
      updatePublicPage(created.id, { downloadOption, watermark });
      toast.success("Public page created");
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{isCreate ? "New Public Page" : "Edit Public Page"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label className="text-xs text-muted-foreground">Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1" placeholder="e.g. Media Kit 2025" />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Description</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 resize-none" rows={2} placeholder="Visible on the public page" />
          </div>
          {!isCreate && (
            <div>
              <Label className="text-xs text-muted-foreground">Slug</Label>
              <Input value={slug} onChange={(e) => setSlug(e.target.value)} className="mt-1 font-mono text-xs" placeholder="media-kit-2025" />
            </div>
          )}

          <Separator />

          <div>
            <Label className="text-xs font-semibold text-foreground">Visitor permissions</Label>
            <div className="mt-3 space-y-3">
              <div>
                <Label className="text-xs text-muted-foreground">Downloads</Label>
                <RadioGroup value={downloadOption} onValueChange={(v) => setDownloadOption(v as typeof downloadOption)} className="mt-1.5 gap-2">
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="high-res" id="dl-high" />
                    <Label htmlFor="dl-high" className="text-sm font-normal cursor-pointer">High-resolution downloads</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="low-res" id="dl-low" />
                    <Label htmlFor="dl-low" className="text-sm font-normal cursor-pointer">Low-resolution only</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="none" id="dl-none" />
                    <Label htmlFor="dl-none" className="text-sm font-normal cursor-pointer">No downloads</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="watermark-switch" className="text-sm font-normal cursor-pointer">Show watermark on images</Label>
                <Switch id="watermark-switch" checked={watermark} onCheckedChange={setWatermark} />
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={!title.trim()}>{isCreate ? "Create" : "Save"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
