import { useState } from "react";
import { useBuckets, deleteBucket, removeImageFromBucket } from "@/stores/bucketStore";
import type { Bucket } from "@/stores/bucketStore";
import { mockImages } from "@/data/mockData";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FolderOpen, Pencil, Trash2, Share2, X, ChevronDown, ChevronUp } from "lucide-react";
import { BucketEditModal } from "@/components/BucketEditModal";
import { ShareModal } from "@/components/ShareModal";
import { toast } from "sonner";

export default function Buckets() {
  const buckets = useBuckets();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [editBucket, setEditBucket] = useState<Bucket | null>(null);
  const [shareBucket, setShareBucket] = useState<Bucket | null>(null);

  const getImages = (ids: string[]) => mockImages.filter((i) => ids.includes(i.id));

  const handleDelete = (b: Bucket) => {
    deleteBucket(b.id);
    toast.success(`Deleted bucket "${b.name}"`);
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Buckets</h1>
        <p className="text-muted-foreground mt-1">
          Organize and share collections of images
        </p>
      </div>

      {buckets.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <FolderOpen className="h-10 w-10 mx-auto mb-3 opacity-40" />
          <p>No buckets yet. Select images in the library and add them to a bucket.</p>
        </div>
      )}

      <div className="grid gap-4">
        {buckets.map((bucket) => {
          const images = getImages(bucket.imageIds);
          const isExpanded = expanded === bucket.id;
          return (
            <Card key={bucket.id}>
              <CardContent className="p-5 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <FolderOpen className="h-4 w-4 text-primary flex-shrink-0" />
                      <h3 className="font-semibold truncate">{bucket.name}</h3>
                      <Badge variant="secondary" className="text-xs font-normal flex-shrink-0">
                        {bucket.imageIds.length} images
                      </Badge>
                    </div>
                    {bucket.description && (
                      <p className="text-sm text-muted-foreground mt-1">{bucket.description}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-0.5">Created {bucket.createdAt}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditBucket(bucket)}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShareBucket(bucket)}>
                      <Share2 className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(bucket)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>

                {/* Preview thumbnails */}
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5 overflow-hidden">
                    {images.slice(0, isExpanded ? images.length : 6).map((img) => (
                      <div key={img.id} className="relative group h-14 w-14 rounded border overflow-hidden flex-shrink-0">
                        <img src={img.src} alt={img.altText} className="h-full w-full object-cover" />
                        <button
                          onClick={() => {
                            removeImageFromBucket(bucket.id, img.id);
                            toast.success("Image removed from bucket");
                          }}
                          className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                  {images.length > 6 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs h-7"
                      onClick={() => setExpanded(isExpanded ? null : bucket.id)}
                    >
                      {isExpanded ? <ChevronUp className="h-3 w-3 mr-1" /> : <ChevronDown className="h-3 w-3 mr-1" />}
                      {isExpanded ? "Less" : `+${images.length - 6} more`}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <BucketEditModal bucket={editBucket} onClose={() => setEditBucket(null)} />
      {shareBucket && (
        <ShareModal
          open={!!shareBucket}
          onClose={() => setShareBucket(null)}
          preselectedImages={getImages(shareBucket.imageIds)}
        />
      )}
    </div>
  );
}
