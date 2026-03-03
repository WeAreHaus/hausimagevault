import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle } from "lucide-react";

export interface UploadedFile {
  id: string;
  name: string;
  previewUrl: string;
  photographer: string;
  copyright: string;
  description: string;
  altText: string;
  tags: string;
}

interface Props {
  file: UploadedFile;
  onChange: (updated: UploadedFile) => void;
}

const requiredFields: (keyof UploadedFile)[] = ["photographer", "copyright", "description", "altText"];

export function isFileComplete(file: UploadedFile): boolean {
  return requiredFields.every((f) => file[f].trim() !== "");
}

export function MetadataEntryForm({ file, onChange }: Props) {
  const complete = isFileComplete(file);
  const missing = requiredFields.filter((f) => file[f].trim() === "");

  const update = (field: keyof UploadedFile, value: string) => {
    onChange({ ...file, [field]: value });
  };

  return (
    <div className={`border rounded-lg p-4 space-y-3 transition-colors ${complete ? "border-success/50 bg-success/5" : "border-destructive/30 bg-destructive/5"}`}>
      <div className="flex items-start gap-3">
        <img src={file.previewUrl} alt="" className="h-16 w-20 rounded object-cover border flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium truncate">{file.name}</p>
            {complete ? (
              <CheckCircle2 className="h-4 w-4 text-success flex-shrink-0" />
            ) : (
              <Badge variant="destructive" className="text-[10px] flex-shrink-0">
                {missing.length} field{missing.length !== 1 ? "s" : ""} missing
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label className="text-xs text-muted-foreground">
            Photographer <span className="text-destructive">*</span>
          </Label>
          <Input
            value={file.photographer}
            onChange={(e) => update("photographer", e.target.value)}
            placeholder="Name…"
            className={`mt-1 ${!file.photographer.trim() ? "border-destructive/50" : ""}`}
          />
        </div>
        <div>
          <Label className="text-xs text-muted-foreground">
            Copyright <span className="text-destructive">*</span>
          </Label>
          <Input
            value={file.copyright}
            onChange={(e) => update("copyright", e.target.value)}
            placeholder="© 2025 …"
            className={`mt-1 ${!file.copyright.trim() ? "border-destructive/50" : ""}`}
          />
        </div>
      </div>

      <div>
        <Label className="text-xs text-muted-foreground">
          Description <span className="text-destructive">*</span>
        </Label>
        <Textarea
          value={file.description}
          onChange={(e) => update("description", e.target.value)}
          placeholder="Describe this image…"
          rows={2}
          className={`mt-1 resize-none ${!file.description.trim() ? "border-destructive/50" : ""}`}
        />
      </div>

      <div>
        <Label className="text-xs text-muted-foreground">
          Alt Text <span className="text-destructive">*</span>
        </Label>
        <Textarea
          value={file.altText}
          onChange={(e) => update("altText", e.target.value)}
          placeholder="Accessible image description…"
          rows={2}
          className={`mt-1 resize-none ${!file.altText.trim() ? "border-destructive/50" : ""}`}
        />
      </div>

      <div>
        <Label className="text-xs text-muted-foreground">Tags (comma separated)</Label>
        <Input
          value={file.tags}
          onChange={(e) => update("tags", e.target.value)}
          placeholder="landscape, fjord, summer…"
          className="mt-1"
        />
      </div>
    </div>
  );
}
