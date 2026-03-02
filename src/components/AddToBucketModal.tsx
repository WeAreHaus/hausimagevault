import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useBuckets, createBucket, addImagesToBucket } from "@/stores/bucketStore";
import { FolderPlus, Plus, Check } from "lucide-react";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onClose: () => void;
  imageIds: string[];
}

export function AddToBucketModal({ open, onClose, imageIds }: Props) {
  const buckets = useBuckets();
  const [showNew, setShowNew] = useState(false);
  const [newName, setNewName] = useState("");
  const [addedTo, setAddedTo] = useState<Set<string>>(new Set());

  const handleAddTo = (bucketId: string) => {
    addImagesToBucket(bucketId, imageIds);
    setAddedTo((prev) => new Set(prev).add(bucketId));
    const bucket = buckets.find((b) => b.id === bucketId);
    toast.success(`Added ${imageIds.length} image${imageIds.length > 1 ? "s" : ""} to "${bucket?.name}"`);
  };

  const handleCreateNew = () => {
    if (!newName.trim()) return;
    const b = createBucket(newName.trim(), "", imageIds);
    setAddedTo((prev) => new Set(prev).add(b.id));
    setNewName("");
    setShowNew(false);
    toast.success(`Created bucket "${b.name}" with ${imageIds.length} image${imageIds.length > 1 ? "s" : ""}`);
  };

  const handleClose = () => {
    setAddedTo(new Set());
    setShowNew(false);
    setNewName("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FolderPlus className="h-5 w-5" />
            Add to Bucket
          </DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">
          {imageIds.length} image{imageIds.length !== 1 ? "s" : ""} selected
        </p>

        <div className="space-y-1.5 max-h-[240px] overflow-y-auto">
          {buckets.map((bucket) => {
            const wasAdded = addedTo.has(bucket.id);
            return (
              <button
                key={bucket.id}
                onClick={() => handleAddTo(bucket.id)}
                disabled={wasAdded}
                className="w-full flex items-center justify-between rounded-md border px-3 py-2.5 text-left text-sm hover:bg-accent/60 transition-colors disabled:opacity-60"
              >
                <div>
                  <p className="font-medium">{bucket.name}</p>
                  <p className="text-xs text-muted-foreground">{bucket.imageIds.length} images</p>
                </div>
                {wasAdded ? (
                  <Check className="h-4 w-4 text-success" />
                ) : (
                  <Plus className="h-4 w-4 text-muted-foreground" />
                )}
              </button>
            );
          })}
        </div>

        {showNew ? (
          <div className="flex gap-2">
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Bucket name…"
              autoFocus
              onKeyDown={(e) => e.key === "Enter" && handleCreateNew()}
            />
            <Button size="sm" onClick={handleCreateNew} disabled={!newName.trim()}>
              Create
            </Button>
          </div>
        ) : (
          <Button variant="outline" size="sm" onClick={() => setShowNew(true)} className="gap-1.5">
            <Plus className="h-3.5 w-3.5" /> New Bucket
          </Button>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>Done</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
