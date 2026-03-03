import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { FileImage, FileType } from "lucide-react";

export interface AssetFormatSelection {
  includeOriginal: boolean;
  pixelFormats: string[];
  pixelSizes: string[];
}

const PIXEL_FORMATS = ["WebP", "PNG", "JPG"];
const PIXEL_SIZES = [
  { key: "S", label: "S — 512px" },
  { key: "L", label: "L — 1024px" },
  { key: "XL", label: "XL — 2048px" },
];

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: (selection: AssetFormatSelection) => void;
  assetName?: string;
}

export function AssetFormatPickerModal({ open, onClose, onConfirm, assetName }: Props) {
  const [includeOriginal, setIncludeOriginal] = useState(true);
  const [includePixel, setIncludePixel] = useState(false);
  const [formats, setFormats] = useState<Set<string>>(new Set());
  const [sizes, setSizes] = useState<Set<string>>(new Set());

  const toggleSet = (set: Set<string>, value: string): Set<string> => {
    const next = new Set(set);
    next.has(value) ? next.delete(value) : next.add(value);
    return next;
  };

  const isValid = includeOriginal || (includePixel && formats.size > 0 && sizes.size > 0);

  const handleConfirm = () => {
    onConfirm({
      includeOriginal,
      pixelFormats: includePixel ? Array.from(formats) : [],
      pixelSizes: includePixel ? Array.from(sizes) : [],
    });
    // reset
    setIncludeOriginal(true);
    setIncludePixel(false);
    setFormats(new Set());
    setSizes(new Set());
  };

  const handleClose = () => {
    setIncludeOriginal(true);
    setIncludePixel(false);
    setFormats(new Set());
    setSizes(new Set());
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileImage className="h-5 w-5" />
            Delivery Options
          </DialogTitle>
        </DialogHeader>

        {assetName && (
          <p className="text-sm text-muted-foreground">
            Choose formats for <span className="font-medium text-foreground">{assetName}</span>
          </p>
        )}

        <div className="space-y-4">
          {/* Original vector */}
          <div className="flex items-center gap-2.5">
            <Checkbox
              id="include-original"
              checked={includeOriginal}
              onCheckedChange={(v) => setIncludeOriginal(!!v)}
            />
            <Label htmlFor="include-original" className="flex items-center gap-1.5 text-sm cursor-pointer">
              <FileType className="h-3.5 w-3.5 text-muted-foreground" />
              Include original vector file
            </Label>
          </div>

          {/* Pixel versions */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <Checkbox
                id="include-pixel"
                checked={includePixel}
                onCheckedChange={(v) => setIncludePixel(!!v)}
              />
              <Label htmlFor="include-pixel" className="text-sm cursor-pointer">
                Include pixel versions
              </Label>
            </div>

            {includePixel && (
              <div className="pl-7 space-y-3">
                {/* Formats */}
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1.5">Format</p>
                  <div className="flex gap-1.5">
                    {PIXEL_FORMATS.map((fmt) => (
                      <Badge
                        key={fmt}
                        variant={formats.has(fmt) ? "default" : "outline"}
                        className="cursor-pointer select-none"
                        onClick={() => setFormats(toggleSet(formats, fmt))}
                      >
                        {fmt}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Sizes */}
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1.5">Size</p>
                  <div className="flex gap-1.5">
                    {PIXEL_SIZES.map((s) => (
                      <Badge
                        key={s.key}
                        variant={sizes.has(s.key) ? "default" : "outline"}
                        className="cursor-pointer select-none"
                        onClick={() => setSizes(toggleSet(sizes, s.key))}
                      >
                        {s.label}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>Cancel</Button>
          <Button onClick={handleConfirm} disabled={!isValid}>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
