import { useState } from "react";
import type { ImageItem } from "@/data/mockData";
import { useShares } from "@/stores/shareStore";
import { imageStore } from "@/stores/imageStore";
import { useBuckets, deleteBucket, removeImageFromBucket } from "@/stores/bucketStore";
import type { Bucket } from "@/stores/bucketStore";
import { usePublicPages, deletePublicPage, updatePublicPage } from "@/stores/publicPageStore";
import type { PublicPage } from "@/stores/publicPageStore";
import { getLogosByIds, type LogoAsset } from "@/stores/logoStore";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Share2, Plus, Download, Globe, FolderOpen, Pencil, Trash2, X, ChevronDown, ChevronUp, Eye, ExternalLink, Link2 } from "lucide-react";
import { ShareModal } from "@/components/ShareModal";
import { BucketEditModal } from "@/components/BucketEditModal";
import { BucketDetailModal } from "@/components/BucketDetailModal";
import { PublicPageEditModal } from "@/components/PublicPageEditModal";
import { PublicPageDetailModal } from "@/components/PublicPageDetailModal";
import { toast } from "sonner";

function logoToImageItem(logo: LogoAsset): ImageItem {
  return {
    id: logo.id,
    src: logo.previewUrl,
    title: logo.name,
    photographer: "",
    copyright: "",
    license: "",
    tourDate: "",
    description: "",
    altText: logo.name,
    tags: ["logo"],
    status: [],
    width: 0,
    height: 0,
    fileSize: "",
    uploadedAt: logo.uploadedAt,
    mediaType: "image",
  };
}

function resolveAssets(ids: string[]): ImageItem[] {
  const logoIds = ids.filter((id) => id.startsWith("logo-"));
  const imageIds = ids.filter((id) => !id.startsWith("logo-"));
  const allImages = imageStore.getImages();
  const images = allImages.filter((i) => imageIds.includes(i.id));
  const logos = getLogosByIds(logoIds).map(logoToImageItem);
  return [...images, ...logos];
}

export default function ShareManager() {
  const buckets = useBuckets();
  const publicPages = usePublicPages();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [editBucket, setEditBucket] = useState<Bucket | null>(null);
  const [createMode, setCreateMode] = useState(false);
  const [shareBucket, setShareBucket] = useState<Bucket | null>(null);
  const [detailBucket, setDetailBucket] = useState<Bucket | null>(null);
  const [editPage, setEditPage] = useState<PublicPage | null>(null);
  const [createPageMode, setCreatePageMode] = useState(false);
  const [detailPage, setDetailPage] = useState<PublicPage | null>(null);

  const getImages = (ids: string[]) => resolveAssets(ids);

  const handleDeleteBucket = (b: Bucket) => {
    deleteBucket(b.id);
    toast.success(`Deleted bucket "${b.name}"`);
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Share Manager</h1>
        <p className="text-muted-foreground mt-1">Manage buckets and share links</p>
      </div>

      <Tabs defaultValue="buckets">
        <TabsList>
          <TabsTrigger value="buckets">Buckets</TabsTrigger>
          <TabsTrigger value="quick-shares">Quick Shares</TabsTrigger>
          <TabsTrigger value="public-access">Public Access</TabsTrigger>
        </TabsList>

        {/* Buckets Tab */}
        <TabsContent value="buckets" className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              Buckets are reusable collections of images that you can organize, update, and share multiple times.
            </p>
            <Button onClick={() => setCreateMode(true)} className="gap-1.5 flex-shrink-0">
              <Plus className="h-4 w-4" /> New Bucket
            </Button>
          </div>

          {buckets.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              <FolderOpen className="h-10 w-10 mx-auto mb-3 opacity-40" />
              <p>No buckets yet. Create one or select images in the library and add them to a bucket.</p>
            </div>
          )}

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
                        <h3 className="font-semibold truncate cursor-pointer hover:text-primary transition-colors" onClick={() => setDetailBucket(bucket)}>{bucket.name}</h3>
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
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setDetailBucket(bucket)}>
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditBucket(bucket)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShareBucket(bucket)}>
                        <Share2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDeleteBucket(bucket)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>

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

          <BucketEditModal bucket={editBucket} isOpen={!!editBucket || createMode} onClose={() => { setEditBucket(null); setCreateMode(false); }} />
          <BucketDetailModal bucket={detailBucket} open={!!detailBucket} onClose={() => setDetailBucket(null)} />
          {shareBucket && (
            <ShareModal
              open={!!shareBucket}
              onClose={() => setShareBucket(null)}
              preselectedImages={getImages(shareBucket.imageIds)}
            />
          )}
        </TabsContent>

        {/* Quick Shares Tab */}
        <TabsContent value="quick-shares" className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Quick Shares are one-time share links created directly from the image library. They are not saved as collections.
          </p>

          {mockShareLinks.map((link) => {
            const images = getImages(link.imageIds);
            return (
              <Card key={link.id}>
                <CardContent className="p-5">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex gap-2">
                      {images.map((img) => (
                        <img key={img.id} src={img.src} alt={img.altText} className="h-16 w-20 rounded object-cover" />
                      ))}
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <Share2 className="h-4 w-4 text-info" />
                        <span className="text-sm font-medium">{link.imageIds.length} image{link.imageIds.length > 1 ? "s" : ""}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        To: {link.recipientEmails.join(", ")}
                      </p>
                      <div className="flex flex-wrap gap-2 text-xs">
                        <Badge variant="outline" className="font-normal">Created {link.createdAt}</Badge>
                        <Badge variant="outline" className="font-normal">Expires {link.expiresAt}</Badge>
                        {link.allowOriginalDownload && (
                          <Badge variant="secondary" className="gap-1 font-normal">
                            <Download className="h-3 w-3" /> Original
                          </Badge>
                        )}
                        {link.allowWebDownload && (
                          <Badge variant="secondary" className="gap-1 font-normal">
                            <Globe className="h-3 w-3" /> Web
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground font-mono truncate">{link.url}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        {/* Public Access Tab */}
        <TabsContent value="public-access" className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              Create public pages to share images and brand assets via an open link. Perfect for media kits and press pages.
            </p>
            <Button onClick={() => setCreatePageMode(true)} className="gap-1.5 flex-shrink-0">
              <Plus className="h-4 w-4" /> New Page
            </Button>
          </div>

          {publicPages.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              <Globe className="h-10 w-10 mx-auto mb-3 opacity-40" />
              <p>No public pages yet. Create one to share assets publicly.</p>
            </div>
          )}

          {publicPages.map((page) => {
            const assets = resolveAssets(page.imageIds);
            return (
              <Card key={page.id}>
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-primary flex-shrink-0" />
                        <h3 className="font-semibold truncate cursor-pointer hover:text-primary transition-colors" onClick={() => setDetailPage(page)}>{page.title}</h3>
                        <Badge variant="secondary" className="text-xs font-normal flex-shrink-0">
                          {page.imageIds.length} assets
                        </Badge>
                        <Badge variant={page.published ? "default" : "outline"} className="text-xs font-normal flex-shrink-0">
                          {page.published ? "Published" : "Draft"}
                        </Badge>
                      </div>
                      {page.description && (
                        <p className="text-sm text-muted-foreground mt-1">{page.description}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-0.5 font-mono">/public/{page.slug}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Switch
                        checked={page.published}
                        onCheckedChange={(checked) => {
                          updatePublicPage(page.id, { published: checked });
                          toast.success(checked ? "Page published" : "Page unpublished");
                        }}
                      />
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setDetailPage(page)}>
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditPage(page)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      {page.published && (
                        <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                          <a href={`/public/${page.slug}`} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => {
                          navigator.clipboard.writeText(`${window.location.origin}/public/${page.slug}`);
                          toast.success("Link copied");
                        }}
                      >
                        <Link2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => { deletePublicPage(page.id); toast.success("Page deleted"); }}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>

                  {assets.length > 0 && (
                    <div className="flex gap-1.5 overflow-hidden">
                      {assets.slice(0, 6).map((img) => (
                        <div key={img.id} className="h-14 w-14 rounded border overflow-hidden flex-shrink-0">
                          <img src={img.src} alt={img.altText} className="h-full w-full object-cover" />
                        </div>
                      ))}
                      {assets.length > 6 && (
                        <div className="h-14 w-14 rounded border flex items-center justify-center text-xs text-muted-foreground flex-shrink-0">
                          +{assets.length - 6}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}

          <PublicPageEditModal page={editPage} isOpen={!!editPage || createPageMode} onClose={() => { setEditPage(null); setCreatePageMode(false); }} />
          <PublicPageDetailModal page={detailPage} open={!!detailPage} onClose={() => setDetailPage(null)} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
