import { useState } from "react";
import type { ImageItem } from "@/data/mockData";
import { imageStore } from "@/stores/imageStore";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/StatusBadge";
import { Sparkles, Share2, Globe, Play, X, Plus, Trash2, Download } from "lucide-react";
import { S3Image } from "@/components/S3Image";
import { ShareModal } from "@/components/ShareModal";
import { PublishModal } from "@/components/PublishModal";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { getDownloadUrl } from "@/lib/s3Client";

interface Props {
  image: ImageItem | null;
  onClose: () => void;
}

export function ImageDetailModal({ image, onClose }: Props) {
  const [altText, setAltText] = useState("");
  const [license, setLicense] = useState("");
  const [showShare, setShowShare] = useState(false);
  const [showPublish, setShowPublish] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [downloading, setDownloading] = useState(false);

  if (!image) return null;

  const currentAlt = altText || image.altText;
  const currentLicense = license || image.license;
  const isVideo = image.mediaType === "video";

  const handleGenerateAlt = () => {
    setAiLoading(true);
    setTimeout(() => {
      setAltText(
        `A breathtaking ${image.tags[0]} scene captured during a guided tour in Norway. ${image.description}`
      );
      setAiLoading(false);
      toast.success("AI alt text generated");
    }, 1500);
  };

  const handleRemoveTag = (tag: string) => {
    const newTags = image.tags.filter((t) => t !== tag);
    imageStore.updateImage(image.id, { tags: newTags });
  };

  const handleAddTag = () => {
    const trimmed = newTag.trim().toLowerCase();
    if (!trimmed) return;
    if (image.tags.includes(trimmed)) {
      toast.error("Tag already exists");
      return;
    }
    imageStore.updateImage(image.id, { tags: [...image.tags, trimmed] });
    setNewTag("");
  };

  const handleDownloadOriginal = async () => {
    if (!image.s3Key) {
      toast.error("No original file available for download");
      return;
    }
    setDownloading(true);
    try {
      const url = await getDownloadUrl(image.s3Key);
      const a = document.createElement("a");
      a.href = url;
      a.download = image.title || "download";
      a.target = "_blank";
      document.body.appendChild(a);
      a.click();
      a.remove();
      toast.success("Download started");
    } catch (err) {
      console.error("Download failed:", err);
      toast.error("Failed to download original");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <>
      <Dialog open={!!image} onOpenChange={() => onClose()}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {image.title}
              {isVideo && <Badge variant="secondary">Video</Badge>}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-6 md:grid-cols-[1fr_1fr]">
            {/* Preview */}
            <div className="space-y-3">
              <div className="rounded-lg overflow-hidden border relative">
                <S3Image src={image.src} s3Key={image.s3Key} size="large" alt={currentAlt} className="w-full object-contain max-h-[400px]" />
                {isVideo && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <div className="h-16 w-16 rounded-full bg-background/90 flex items-center justify-center shadow-lg">
                      <Play className="h-8 w-8 text-foreground ml-1" />
                    </div>
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {image.status.map((s) => <StatusBadge key={s} status={s} />)}
              </div>

              {/* Editable Tags */}
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Tags</Label>
                <div className="flex flex-wrap gap-1">
                  {image.tags.map((t) => (
                    <Badge key={t} variant="secondary" className="text-xs gap-1 pr-1">
                      {t}
                      <button
                        onClick={() => handleRemoveTag(t)}
                        className="ml-0.5 rounded-full hover:bg-muted-foreground/20 p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-1.5">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add tag…"
                    className="h-8 text-sm"
                    onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
                  />
                  <Button variant="outline" size="sm" className="h-8 gap-1" onClick={handleAddTag} disabled={!newTag.trim()}>
                    <Plus className="h-3 w-3" /> Add
                  </Button>
                </div>
              </div>

              <div className="text-xs text-muted-foreground space-y-0.5">
                <p>{image.width} × {image.height}px · {image.fileSize}</p>
                {isVideo && image.duration && <p>Duration: {image.duration}</p>}
                <p>Uploaded {image.uploadedAt}</p>
              </div>
            </div>

            {/* Metadata */}
            <div className="space-y-4">
              <div className="grid gap-3">
                <div>
                  <Label className="text-xs text-muted-foreground">Photographer</Label>
                  <Input value={image.photographer} readOnly className="mt-1" />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Copyright</Label>
                  <Input value={image.copyright} readOnly className="mt-1" />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">License</Label>
                  <Textarea
                    value={currentLicense}
                    onChange={(e) => {
                      setLicense(e.target.value);
                      imageStore.updateImage(image.id, { license: e.target.value });
                    }}
                    placeholder="e.g. All rights reserved, CC BY 4.0…"
                    className="mt-1 resize-none"
                    rows={2}
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Tour Date</Label>
                  <Input value={image.tourDate} readOnly className="mt-1" />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Description</Label>
                  <Textarea value={image.description} readOnly className="mt-1 resize-none" rows={2} />
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <Label className="text-xs text-muted-foreground">Alt Text</Label>
                    <Button variant="ghost" size="sm" onClick={handleGenerateAlt} disabled={aiLoading} className="text-xs gap-1 h-7">
                      <Sparkles className="h-3 w-3" />
                      {aiLoading ? "Generating…" : "Generate AI Alt Text"}
                    </Button>
                  </div>
                  <Textarea value={currentAlt} onChange={(e) => setAltText(e.target.value)} className="mt-1 resize-none" rows={2} />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                {image.s3Key && (
                  <Button onClick={handleDownloadOriginal} variant="outline" className="flex-1 gap-1.5" disabled={downloading}>
                    <Download className="h-4 w-4" /> {downloading ? "Laddar…" : "Download Original"}
                  </Button>
                )}
                <Button onClick={() => setShowShare(true)} variant="outline" className="flex-1 gap-1.5">
                  <Share2 className="h-4 w-4" /> Create Share Link
                </Button>
                <Button onClick={() => setShowPublish(true)} className="flex-1 gap-1.5">
                  <Globe className="h-4 w-4" /> Publish to Website
                </Button>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="w-full text-destructive hover:text-destructive hover:bg-destructive/10 gap-1.5 mt-1">
                    <Trash2 className="h-4 w-4" /> Delete Image
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete "{image.title}"?</AlertDialogTitle>
                    <AlertDialogDescription>This action cannot be undone. The image will be permanently removed.</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={() => {
                      imageStore.deleteImages([image.id]);
                      toast.success("Image deleted");
                      onClose();
                    }}>Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ShareModal open={showShare} onClose={() => setShowShare(false)} preselectedImages={[image]} />
      <PublishModal open={showPublish} onClose={() => setShowPublish(false)} image={image} />
    </>
  );
}
