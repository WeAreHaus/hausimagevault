import { useState, useMemo, useCallback } from "react";
import { mockImages, photographers, guides, groupIds, allTags } from "@/data/mockData";
import type { ImageItem } from "@/data/mockData";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { StatusBadge } from "@/components/StatusBadge";
import { Search, X, Share2, CheckSquare, Square, ChevronLeft, ChevronRight } from "lucide-react";
import { ImageDetailModal } from "@/components/ImageDetailModal";
import { ShareModal } from "@/components/ShareModal";

const PAGE_SIZE = 48;

export default function ImageLibrary() {
  const [search, setSearch] = useState("");
  const [filterPhotographer, setFilterPhotographer] = useState<string>("all");
  const [filterGuide, setFilterGuide] = useState<string>("all");
  const [filterGroup, setFilterGroup] = useState<string>("all");
  const [filterTag, setFilterTag] = useState<string>("all");
  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const [showShareModal, setShowShareModal] = useState(false);

  const filtered = useMemo(() => {
    return mockImages.filter((img) => {
      if (search && !img.title.toLowerCase().includes(search.toLowerCase()) && !img.tags.some((t) => t.includes(search.toLowerCase()))) return false;
      if (filterPhotographer !== "all" && img.photographer !== filterPhotographer) return false;
      if (filterGuide !== "all" && img.guide !== filterGuide) return false;
      if (filterGroup !== "all" && img.groupId !== filterGroup) return false;
      if (filterTag !== "all" && !img.tags.includes(filterTag)) return false;
      return true;
    });
  }, [search, filterPhotographer, filterGuide, filterGroup, filterTag]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const safePage = Math.min(page, totalPages || 1);
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  // Reset page when filters change
  useMemo(() => { setPage(1); }, [search, filterPhotographer, filterGuide, filterGroup, filterTag]);

  const hasFilters = search || filterPhotographer !== "all" || filterGuide !== "all" || filterGroup !== "all" || filterTag !== "all";

  const clearFilters = () => {
    setSearch("");
    setFilterPhotographer("all");
    setFilterGuide("all");
    setFilterGroup("all");
    setFilterTag("all");
  };

  const toggleSelect = useCallback((id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const selectAllOnPage = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      paginated.forEach((img) => next.add(img.id));
      return next;
    });
  };

  const deselectAll = () => setSelectedIds(new Set());

  const allOnPageSelected = paginated.length > 0 && paginated.every((img) => selectedIds.has(img.id));

  const selectedImages = useMemo(
    () => mockImages.filter((img) => selectedIds.has(img.id)),
    [selectedIds]
  );

  return (
    <div className="p-6 lg:p-8 space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Image Library</h1>
          <p className="text-muted-foreground mt-1">{filtered.length} images{hasFilters ? " (filtered)" : ""}</p>
        </div>
        {hasFilters && (
          <button onClick={clearFilters} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
            <X className="h-3 w-3" /> Clear filters
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search images…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={filterPhotographer} onValueChange={setFilterPhotographer}>
          <SelectTrigger className="w-[160px]"><SelectValue placeholder="Photographer" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Photographers</SelectItem>
            {photographers.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filterGuide} onValueChange={setFilterGuide}>
          <SelectTrigger className="w-[150px]"><SelectValue placeholder="Guide" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Guides</SelectItem>
            {guides.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filterGroup} onValueChange={setFilterGroup}>
          <SelectTrigger className="w-[170px]"><SelectValue placeholder="Group" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Groups</SelectItem>
            {groupIds.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filterTag} onValueChange={setFilterTag}>
          <SelectTrigger className="w-[140px]"><SelectValue placeholder="Tag" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tags</SelectItem>
            {allTags.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Selection toolbar */}
      <div className="flex items-center justify-between border-b pb-3">
        <div className="flex items-center gap-3">
          <button
            onClick={allOnPageSelected ? deselectAll : selectAllOnPage}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {allOnPageSelected ? (
              <CheckSquare className="h-4 w-4 text-primary" />
            ) : (
              <Square className="h-4 w-4" />
            )}
            {allOnPageSelected ? "Deselect all" : `Select all on page`}
          </button>
          {selectedIds.size > 0 && (
            <span className="text-sm font-medium text-primary">
              {selectedIds.size} selected
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          Page {safePage} of {totalPages}
        </div>
      </div>

      {/* Bulk action bar */}
      {selectedIds.size > 0 && (
        <div className="sticky top-0 z-20 flex items-center justify-between gap-4 rounded-lg border bg-card/95 backdrop-blur-sm px-4 py-3 shadow-sm">
          <p className="text-sm">
            <span className="font-semibold text-foreground">{selectedIds.size}</span>{" "}
            <span className="text-muted-foreground">image{selectedIds.size !== 1 ? "s" : ""} selected</span>
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={deselectAll}>
              Clear
            </Button>
            <Button size="sm" onClick={() => setShowShareModal(true)} className="gap-1.5">
              <Share2 className="h-3.5 w-3.5" /> Share Selected
            </Button>
          </div>
        </div>
      )}

      {/* Grid */}
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {paginated.map((img) => {
          const isSelected = selectedIds.has(img.id);
          return (
            <div
              key={img.id}
              className={`group relative rounded-lg border overflow-hidden bg-card transition-all hover:shadow-md ${
                isSelected ? "ring-2 ring-primary border-primary" : ""
              }`}
            >
              {/* Checkbox overlay */}
              <div
                className={`absolute top-2 left-2 z-10 transition-opacity ${
                  isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                }`}
              >
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={() => toggleSelect(img.id)}
                  className="bg-background/80 backdrop-blur-sm"
                />
              </div>

              {/* Image – click to view detail */}
              <button
                onClick={() => setSelectedImage(img)}
                className="w-full text-left focus:outline-none"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={img.src}
                    alt={img.altText}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="p-2.5 space-y-1.5">
                  <p className="text-xs font-medium truncate">{img.title}</p>
                  <p className="text-[11px] text-muted-foreground truncate">{img.photographer} · {img.tourDate}</p>
                  <div className="flex flex-wrap gap-0.5">
                    {img.status.map((s) => <StatusBadge key={s} status={s} />)}
                  </div>
                </div>
              </button>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <p>No images match your filters.</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <Button
            variant="outline"
            size="sm"
            disabled={safePage <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> Previous
          </Button>
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              let pageNum: number;
              if (totalPages <= 7) {
                pageNum = i + 1;
              } else if (safePage <= 4) {
                pageNum = i + 1;
              } else if (safePage >= totalPages - 3) {
                pageNum = totalPages - 6 + i;
              } else {
                pageNum = safePage - 3 + i;
              }
              return (
                <Button
                  key={pageNum}
                  variant={pageNum === safePage ? "default" : "ghost"}
                  size="sm"
                  className="w-9 h-9"
                  onClick={() => setPage(pageNum)}
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>
          <Button
            variant="outline"
            size="sm"
            disabled={safePage >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Next <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}

      <ImageDetailModal image={selectedImage} onClose={() => setSelectedImage(null)} />
      <ShareModal
        open={showShareModal}
        onClose={() => setShowShareModal(false)}
        preselectedImages={selectedImages}
      />
    </div>
  );
}
