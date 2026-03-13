import { useState, useRef, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, FileUp, Loader2 } from "lucide-react";
import { addLogo } from "@/stores/logoStore";
import { toast } from "sonner";

const ACCEPTED_EXTENSIONS = [".svg", ".ai", ".pdf", ".eps"];
const ACCEPT_STRING = ACCEPTED_EXTENSIONS.join(",");

interface Props {
  open: boolean;
  onClose: () => void;
}

export function LogoUploadModal({ open, onClose }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const isValidExt = (f: File) => {
    const ext = "." + f.name.split(".").pop()?.toLowerCase();
    return ACCEPTED_EXTENSIONS.includes(ext);
  };

  const handleFile = (f: File) => {
    if (!isValidExt(f)) {
      toast.error("Invalid format. Accepted: SVG, AI, PDF, EPS");
      return;
    }
    setFile(f);
    if (!name) {
      const baseName = f.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ");
      setName(baseName);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }, [name]);

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    try {
      await addLogo(file, name || file.name);
      toast.success(`Logo "${name || file.name}" uploaded`);
      handleClose();
    } catch (err) {
      console.error("Logo upload failed:", err);
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setName("");
    setDragging(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" /> Upload Logo
          </DialogTitle>
          <DialogDescription>
            Upload vector source files (SVG, AI, PDF, EPS). Pixel formats can be generated on download.
          </DialogDescription>
        </DialogHeader>

        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            dragging ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"
          }`}
        >
          <FileUp className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          {file ? (
            <p className="text-sm font-medium">{file.name}</p>
          ) : (
            <>
              <p className="text-sm font-medium">Drop a vector file here or click to browse</p>
              <p className="text-xs text-muted-foreground mt-1">SVG, AI, PDF, EPS</p>
            </>
          )}
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPT_STRING}
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
            }}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="logo-name">Name</Label>
          <Input
            id="logo-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Primary Logo, Icon Only, White Version…"
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={uploading}>Cancel</Button>
          <Button onClick={handleUpload} disabled={!file || uploading}>
            {uploading ? (
              <><Loader2 className="h-4 w-4 animate-spin mr-1.5" /> Uploading…</>
            ) : (
              "Upload"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
