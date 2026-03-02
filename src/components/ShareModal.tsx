import { useState } from "react";
import { mockImages } from "@/data/mockData";
import type { ImageItem } from "@/data/mockData";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Copy, CheckCircle2, Link } from "lucide-react";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onClose: () => void;
  preselectedImages?: ImageItem[];
}

export function ShareModal({ open, onClose, preselectedImages }: Props) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    new Set(preselectedImages?.map((i) => i.id) ?? [])
  );
  const [emails, setEmails] = useState("");
  const [expiryDate, setExpiryDate] = useState("2025-10-01");
  const [allowOriginal, setAllowOriginal] = useState(false);
  const [allowWeb, setAllowWeb] = useState(true);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const toggle = (id: string) => {
    const next = new Set(selectedIds);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelectedIds(next);
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
            {/* Image selection */}
            <div>
              <Label className="text-xs text-muted-foreground mb-2 block">Select Images</Label>
              <div className="grid grid-cols-4 gap-2 max-h-[200px] overflow-y-auto border rounded-lg p-2">
                {mockImages.map((img) => (
                  <button
                    key={img.id}
                    onClick={() => toggle(img.id)}
                    className={`relative rounded overflow-hidden aspect-square border-2 transition-colors ${
                      selectedIds.has(img.id) ? "border-primary" : "border-transparent"
                    }`}
                  >
                    <img src={img.src} alt={img.altText} className="w-full h-full object-cover" />
                    {selectedIds.has(img.id) && (
                      <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-1">{selectedIds.size} selected</p>
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
              <Button onClick={handleGenerate} disabled={selectedIds.size === 0}>
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
                {selectedIds.size} image{selectedIds.size > 1 ? "s" : ""} · Expires {expiryDate}
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
