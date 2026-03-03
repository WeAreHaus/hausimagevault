import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { Bucket } from "@/stores/bucketStore";
import { updateBucket, createBucket } from "@/stores/bucketStore";
import { toast } from "sonner";

interface Props {
  bucket: Bucket | null;
  isOpen?: boolean;
  onClose: () => void;
}

export function BucketEditModal({ bucket, isOpen, onClose }: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const isCreate = !bucket;

  useEffect(() => {
    if (bucket) {
      setName(bucket.name);
      setDescription(bucket.description);
    } else {
      setName("");
      setDescription("");
    }
  }, [bucket, isOpen]);

  const handleSave = () => {
    if (!name.trim()) return;
    if (bucket) {
      updateBucket(bucket.id, { name: name.trim(), description: description.trim() });
      toast.success("Bucket updated");
    } else {
      createBucket(name.trim(), description.trim());
      toast.success("Bucket created");
    }
    onClose();
  };

  return (
    <Dialog open={!!isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{isCreate ? "New Bucket" : "Edit Bucket"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label className="text-xs text-muted-foreground">Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} className="mt-1" placeholder="e.g. Summer Campaign" />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Description</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 resize-none" rows={2} placeholder="Optional description" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={!name.trim()}>{isCreate ? "Create" : "Save"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
