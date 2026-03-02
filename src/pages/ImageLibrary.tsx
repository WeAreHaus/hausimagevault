import { useState, useMemo } from "react";
import { mockImages, photographers, guides, groupIds, allTags } from "@/data/mockData";
import type { ImageItem } from "@/data/mockData";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/StatusBadge";
import { Search, X } from "lucide-react";
import { ImageDetailModal } from "@/components/ImageDetailModal";

export default function ImageLibrary() {
  const [search, setSearch] = useState("");
  const [filterPhotographer, setFilterPhotographer] = useState<string>("all");
  const [filterGuide, setFilterGuide] = useState<string>("all");
  const [filterGroup, setFilterGroup] = useState<string>("all");
  const [filterTag, setFilterTag] = useState<string>("all");
  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null);

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

  const hasFilters = search || filterPhotographer !== "all" || filterGuide !== "all" || filterGroup !== "all" || filterTag !== "all";

  const clearFilters = () => {
    setSearch("");
    setFilterPhotographer("all");
    setFilterGuide("all");
    setFilterGroup("all");
    setFilterTag("all");
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Image Library</h1>
          <p className="text-muted-foreground mt-1">{filtered.length} of {mockImages.length} images</p>
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

      {/* Grid */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filtered.map((img) => (
          <button
            key={img.id}
            onClick={() => setSelectedImage(img)}
            className="group rounded-lg border bg-card overflow-hidden text-left transition-shadow hover:shadow-md focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <div className="aspect-[4/3] overflow-hidden">
              <img
                src={img.src}
                alt={img.altText}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
            </div>
            <div className="p-3 space-y-2">
              <p className="text-sm font-medium truncate">{img.title}</p>
              <p className="text-xs text-muted-foreground">{img.photographer} · {img.tourDate}</p>
              <div className="flex flex-wrap gap-1">
                {img.status.map((s) => <StatusBadge key={s} status={s} />)}
              </div>
              <div className="flex flex-wrap gap-1">
                {img.tags.slice(0, 3).map((t) => (
                  <Badge key={t} variant="secondary" className="text-[10px] px-1.5 py-0">{t}</Badge>
                ))}
                {img.tags.length > 3 && <span className="text-[10px] text-muted-foreground">+{img.tags.length - 3}</span>}
              </div>
            </div>
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <p>No images match your filters.</p>
        </div>
      )}

      <ImageDetailModal image={selectedImage} onClose={() => setSelectedImage(null)} />
    </div>
  );
}
