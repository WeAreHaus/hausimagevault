import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
  const isCreate = !page;

  useEffect(() => {
    if (page) {
      setTitle(page.title);
      setDescription(page.description);
      setSlug(page.slug);
    } else {
      setTitle("");
      setDescription("");
      setSlug("");
    }
  }, [page, isOpen]);

  const handleSave = () => {
    if (!title.trim()) return;
    if (page) {
      updatePublicPage(page.id, {
        title: title.trim(),
        description: description.trim(),
        slug: slug.trim() || undefined,
      });
      toast.success("Public page updated");
    } else {
      createPublicPage(title.trim(), description.trim());
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
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={!title.trim()}>{isCreate ? "Create" : "Save"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
