import { useState, useSyncExternalStore } from "react";
import { imageStore } from "@/stores/imageStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Search, Pencil, Trash2, Tag } from "lucide-react";
import { toast } from "sonner";

export default function TagManager() {
  const images = useSyncExternalStore(imageStore.subscribe, imageStore.getSnapshot);
  const [search, setSearch] = useState("");
  const [renameTag, setRenameTag] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const [deleteTag, setDeleteTag] = useState<string | null>(null);

  // Compute tag → count map
  const tagCounts = new Map<string, number>();
  for (const img of images) {
    for (const t of img.tags) {
      tagCounts.set(t, (tagCounts.get(t) || 0) + 1);
    }
  }

  const allTags = [...tagCounts.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .filter(([name]) => !search || name.toLowerCase().includes(search.toLowerCase()));

  const handleRename = () => {
    if (!renameTag || !newName.trim()) return;
    imageStore.renameTag(renameTag, newName.trim().toLowerCase());
    toast.success(`Renamed "${renameTag}" → "${newName.trim().toLowerCase()}"`);
    setRenameTag(null);
    setNewName("");
  };

  const handleDelete = () => {
    if (!deleteTag) return;
    imageStore.deleteTag(deleteTag);
    toast.success(`Deleted tag "${deleteTag}" from all images`);
    setDeleteTag(null);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Tag Manager
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tags…"
              className="pl-9"
            />
          </div>

          <p className="text-sm text-muted-foreground">
            {tagCounts.size} unique tags across {images.length} images
          </p>

          {allTags.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">No tags found</p>
          ) : (
            <div className="space-y-1 max-h-[400px] overflow-y-auto">
              {allTags.map(([tag, count]) => (
                <div
                  key={tag}
                  className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-muted/50 transition-colors group"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-sm font-medium truncate">{tag}</span>
                    <Badge variant="secondary" className="text-[10px] font-normal shrink-0">
                      {count} {count === 1 ? "image" : "images"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => {
                        setRenameTag(tag);
                        setNewName(tag);
                      }}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive"
                      onClick={() => setDeleteTag(tag)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Rename Dialog */}
      <Dialog open={!!renameTag} onOpenChange={() => setRenameTag(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Rename Tag</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Renaming "<span className="font-medium text-foreground">{renameTag}</span>" will update it across all images.
            </p>
            <div>
              <Label className="text-xs text-muted-foreground">New name</Label>
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="mt-1"
                autoFocus
                onKeyDown={(e) => e.key === "Enter" && handleRename()}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRenameTag(null)}>Cancel</Button>
            <Button onClick={handleRename} disabled={!newName.trim() || newName.trim() === renameTag}>Rename</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteTag} onOpenChange={() => setDeleteTag(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Tag</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            This will remove "<span className="font-medium text-foreground">{deleteTag}</span>" from all images ({tagCounts.get(deleteTag || "") || 0} images affected). This cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTag(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
