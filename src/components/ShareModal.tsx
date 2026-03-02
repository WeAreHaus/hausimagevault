import { useState, useEffect } from "react";
import type { ImageItem } from "@/data/mockData";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Copy, CheckCircle2, Link, X } from "lucide-react";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onClose: () => void;
  preselectedImages?: ImageItem[];
}

export function ShareModal({ open, onClose, preselectedImages = [] }: Props) {
  const [emails, setEmails] = useState("");
  const [expiryDate, setExpiryDate] = useState("2025-10-01");
  const [allowOriginal, setAllowOriginal] = useState(false);
  const [allowWeb, setAllowWeb] = useState(true);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [removedIds, setRemovedIds] = useState<Set<string>>(new Set());

  // Reset removed IDs when modal opens with new images
  useEffect(() => {
    if (open) setRemovedIds(new Set());
  }, [open, preselectedImages]);

  const images = preselectedImages.filter((img) => !removedIds.has(img.id));

  const removeImage = (id: string) => {
    setRemovedIds((prev) => new Set(prev).add(id));
  };

  const handleGenerate = () => {
    const hash = Math.random().toString(36).substring(2, 10);
    setGeneratedLink(`https://share.nordictours.com/s/${hash}`);
    toast.success("Share link created");
  };

  const handleCopy = () => {
    if (generatedLink) {
      navigator.clipboard.writeText(generatedLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClose = () => {
    setGeneratedLink(null);
    setCopied(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Share Link</DialogTitle>
        </DialogHeader>

        {!generatedLink ? (
          <div className="space-y-5">
            {/* Selected images summary */}
            <div>
              <Label className="text-xs text-muted-foreground mb-2 block">
                {images.length} image{images.length !== 1 ? "s" : ""} selected
              </Label>
              <div className="flex flex-wrap gap-1.5 max-h-[120px] overflow-y-auto border rounded-lg p-2">
                {images.map((img) => (
                  <div
                    key={img.id}
                    className="relative group rounded overflow-hidden h-14 w-14 flex-shrink-0 border"
                  >
                    <img src={img.src} alt={img.altText} className="w-full h-full object-cover" />
                    <button
                      onClick={() => removeImage(img.id)}
                      className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                    >
                      <X className="h-3.5 w-3.5 text-foreground" />
                    </button>
                  </div>
                ))}
                {images.length === 0 && (
                  <p className="text-xs text-muted-foreground py-2 px-1">No images selected</p>
                )}
              </div>
            </div>

            <div>
              <Label className="text-xs text-muted-foreground">Recipient Email(s)</Label>
              <Input
                value={emails}
                onChange={(e) => setEmails(e.target.value)}
                placeholder="email@example.com, another@example.com"
                className="mt-1"
              />
            </div>

            <div>
              <Label className="text-xs text-muted-foreground">Expiration Date</Label>
              <Input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="mt-1"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm">Allow original download</Label>
                <Switch checked={allowOriginal} onCheckedChange={setAllowOriginal} />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm">Allow web version download</Label>
                <Switch checked={allowWeb} onCheckedChange={setAllowWeb} />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>Cancel</Button>
              <Button onClick={handleGenerate} disabled={images.length === 0}>
                <Link className="h-4 w-4 mr-1.5" /> Generate Link
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <div className="space-y-4 text-center py-4">
            <CheckCircle2 className="h-12 w-12 text-success mx-auto" />
            <div>
              <p className="font-medium">Share link created!</p>
              <p className="text-sm text-muted-foreground mt-1">
                {images.length} image{images.length > 1 ? "s" : ""} · Expires {expiryDate}
              </p>
            </div>
            <div className="flex gap-2">
              <Input value={generatedLink} readOnly className="text-sm" />
              <Button variant="outline" size="icon" onClick={handleCopy}>
                {copied ? <CheckCircle2 className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <Button onClick={handleClose} className="w-full">Done</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
