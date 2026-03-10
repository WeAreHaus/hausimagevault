import { useState, useMemo } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tag, X, Search, Plus, Check } from "lucide-react";
import type { ImageItem } from "@/data/mockData";
import { imageStore } from "@/stores/imageStore";
import { toast } from "sonner";

interface TagFilterPopoverProps {
  allImages: ImageItem[];
  selectedTags: Set<string>;
  onSelectedTagsChange: (tags: Set<string>) => void;
  selectedIds?: Set<string>;
}

export function TagFilterPopover({ allImages, selectedTags, onSelectedTagsChange, selectedIds }: TagFilterPopoverProps) {
  const [tagSearch, setTagSearch] = useState("");

  const isAssignMode = selectedIds && selectedIds.size > 0;

  // All unique tags sorted alphabetically
  const allTags = useMemo(
    () => [...new Set(allImages.flatMap((i) => i.tags))].sort(),
    [allImages]
  );

  // Count how many images have each tag
  const tagCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const img of allImages) {
      for (const tag of img.tags) {
        counts.set(tag, (counts.get(tag) || 0) + 1);
      }
    }
    return counts;
  }, [allImages]);

  // In assign mode: which tags are on ALL selected images
  const selectionTagStatus = useMemo(() => {
    if (!isAssignMode) return new Map<string, "all" | "some">();
    const selectedImgs = allImages.filter((img) => selectedIds.has(img.id));
    const status = new Map<string, "all" | "some">();
    for (const tag of allTags) {
      const count = selectedImgs.filter((img) => img.tags.includes(tag)).length;
      if (count === selectedImgs.length) status.set(tag, "all");
      else if (count > 0) status.set(tag, "some");
    }
    return status;
  }, [isAssignMode, selectedIds, allImages, allTags]);

  // Filter tags by search
  const visibleTags = useMemo(() => {
    if (!tagSearch.trim()) return allTags;
    const q = tagSearch.toLowerCase();
    return allTags.filter((t) => t.toLowerCase().includes(q));
  }, [allTags, tagSearch]);

  const exactMatchExists = allTags.some((t) => t.toLowerCase() === tagSearch.trim().toLowerCase());
  const canCreate = tagSearch.trim().length > 0 && !exactMatchExists;

  const toggleTag = (tag: string) => {
    if (isAssignMode) {
      // Assign/remove tag from selected images
      const selectedImgs = allImages.filter((img) => selectedIds.has(img.id));
      const allHaveTag = selectedImgs.every((img) => img.tags.includes(tag));
      for (const img of selectedImgs) {
        if (allHaveTag) {
          imageStore.updateImage(img.id, { tags: img.tags.filter((t) => t !== tag) });
        } else if (!img.tags.includes(tag)) {
          imageStore.updateImage(img.id, { tags: [...img.tags, tag] });
        }
      }
      toast.success(allHaveTag ? `Removed "${tag}" from ${selectedImgs.length} image(s)` : `Added "${tag}" to ${selectedImgs.length} image(s)`);
    } else {
      // Filter mode
      const next = new Set(selectedTags);
      if (next.has(tag)) next.delete(tag);
      else next.add(tag);
      onSelectedTagsChange(next);
    }
  };

  const createTag = () => {
    const newTag = tagSearch.trim();
    if (!newTag) return;
    if (isAssignMode) {
      const selectedImgs = allImages.filter((img) => selectedIds.has(img.id));
      for (const img of selectedImgs) {
        if (!img.tags.includes(newTag)) {
          imageStore.updateImage(img.id, { tags: [...img.tags, newTag] });
        }
      }
      toast.success(`Created and added "${newTag}" to ${selectedImgs.length} image(s)`);
    } else {
      // Just add to filter
      const next = new Set(selectedTags);
      next.add(newTag);
      onSelectedTagsChange(next);
      toast.success(`Tag "${newTag}" created`);
    }
    setTagSearch("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && canCreate) {
      e.preventDefault();
      createTag();
    }
  };

  const clearAll = () => onSelectedTagsChange(new Set());

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="gap-1.5 min-w-[100px]">
          <Tag className="h-3.5 w-3.5" />
          Tags
          {selectedTags.size > 0 && (
            <Badge variant="default" className="ml-1 h-5 min-w-[20px] px-1.5 text-[10px] rounded-full">
              {selectedTags.size}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        {/* Mode indicator */}
        {isAssignMode && (
          <div className="px-3 pt-2.5 pb-1">
            <p className="text-xs font-medium text-primary">Assign tags to {selectedIds.size} selected image{selectedIds.size !== 1 ? "s" : ""}</p>
          </div>
        )}

        {/* Search + Create */}
        <div className="p-3 border-b">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder={isAssignMode ? "Search or create tag…" : "Search tags…"}
              value={tagSearch}
              onChange={(e) => setTagSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              className="pl-8 h-8 text-sm"
            />
          </div>
          {canCreate && (
            <button
              onClick={createTag}
              className="mt-2 w-full flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-primary hover:bg-accent transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              Create "{tagSearch.trim()}"
              {isAssignMode && <span className="text-muted-foreground ml-auto">& assign</span>}
            </button>
          )}
        </div>

        {/* Tag chips */}
        <ScrollArea className="max-h-[240px]">
          <div className="p-3 flex flex-wrap gap-1.5">
            {visibleTags.length === 0 && !canCreate && (
              <p className="text-sm text-muted-foreground py-2 w-full text-center">No tags found</p>
            )}
            {visibleTags.map((tag) => {
              const count = tagCounts.get(tag) || 0;
              if (isAssignMode) {
                const status = selectionTagStatus.get(tag);
                const isAll = status === "all";
                const isSome = status === "some";
                return (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium transition-colors border cursor-pointer ${
                      isAll
                        ? "bg-primary text-primary-foreground border-primary"
                        : isSome
                        ? "bg-primary/20 text-primary border-primary/40"
                        : "bg-secondary/50 text-secondary-foreground border-border hover:bg-secondary"
                    }`}
                  >
                    {isAll && <Check className="h-3 w-3 mr-0.5" />}
                    {tag}
                    <span className={`text-[10px] ${isAll ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                      {count}
                    </span>
                  </button>
                );
              }
              // Filter mode
              const isActive = selectedTags.has(tag);
              return (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium transition-colors border cursor-pointer ${
                    isActive
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-secondary/50 text-secondary-foreground border-border hover:bg-secondary"
                  }`}
                >
                  {tag}
                  <span className={`text-[10px] ${isActive ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </ScrollArea>

        {/* Footer */}
        {!isAssignMode && selectedTags.size > 0 && (
          <div className="border-t px-3 py-2 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">{selectedTags.size} selected</span>
            <button onClick={clearAll} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
              <X className="h-3 w-3" /> Clear all
            </button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
