import { useState, useMemo } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tag, X, Search } from "lucide-react";
import type { ImageItem } from "@/data/mockData";

interface TagFilterPopoverProps {
  allImages: ImageItem[];
  selectedTags: Set<string>;
  onSelectedTagsChange: (tags: Set<string>) => void;
}

export function TagFilterPopover({ allImages, selectedTags, onSelectedTagsChange }: TagFilterPopoverProps) {
  const [tagSearch, setTagSearch] = useState("");

  // All unique tags sorted alphabetically
  const allTags = useMemo(
    () => [...new Set(allImages.flatMap((i) => i.tags))].sort(),
    [allImages]
  );

  // Count how many images have each tag (among images matching OTHER current filters — here we just count all for simplicity)
  const tagCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const img of allImages) {
      for (const tag of img.tags) {
        counts.set(tag, (counts.get(tag) || 0) + 1);
      }
    }
    return counts;
  }, [allImages]);

  // Filter tags by search
  const visibleTags = useMemo(() => {
    if (!tagSearch.trim()) return allTags;
    const q = tagSearch.toLowerCase();
    return allTags.filter((t) => t.toLowerCase().includes(q));
  }, [allTags, tagSearch]);

  const toggleTag = (tag: string) => {
    const next = new Set(selectedTags);
    if (next.has(tag)) {
      next.delete(tag);
    } else {
      next.add(tag);
    }
    onSelectedTagsChange(next);
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
        {/* Search */}
        <div className="p-3 border-b">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search tags…"
              value={tagSearch}
              onChange={(e) => setTagSearch(e.target.value)}
              className="pl-8 h-8 text-sm"
            />
          </div>
        </div>

        {/* Tag chips */}
        <ScrollArea className="max-h-[240px]">
          <div className="p-3 flex flex-wrap gap-1.5">
            {visibleTags.length === 0 && (
              <p className="text-sm text-muted-foreground py-2 w-full text-center">No tags found</p>
            )}
            {visibleTags.map((tag) => {
              const isActive = selectedTags.has(tag);
              const count = tagCounts.get(tag) || 0;
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
        {selectedTags.size > 0 && (
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
