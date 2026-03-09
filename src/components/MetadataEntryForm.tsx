import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Sparkles } from "lucide-react";
import { toast } from "sonner";

export interface UploadedFile {
  id: string;
  name: string;
  previewUrl: string;
  title: string;
  photographer: string;
  copyright: string;
  license: string;
  description: string;
  altText: string;
  tags: string;
}

interface Props {
  file: UploadedFile;
  onChange: (updated: UploadedFile) => void;
}

const metadataFields: (keyof UploadedFile)[] = ["title", "photographer", "copyright", "license", "description", "altText"];

export function countFilledFields(file: UploadedFile): number {
  return metadataFields.filter((f) => file[f].trim() !== "").length;
}

export const totalFields = metadataFields.length;

export function MetadataEntryForm({ file, onChange }: Props) {
  const [aiLoading, setAiLoading] = useState(false);
  const filled = countFilledFields(file);
  const allFilled = filled === totalFields;

  const update = (field: keyof UploadedFile, value: string) => {
    onChange({ ...file, [field]: value });
  };

  const handleGenerateAlt = () => {
    setAiLoading(true);
    setTimeout(() => {
      const mockAlt = `A scenic view captured in Norway, showing ${file.tags || "natural landscape"}. ${file.description || ""}`.trim();
      update("altText", mockAlt);
      setAiLoading(false);
      toast.success("AI alt text generated");
    }, 1500);
  };

  return (
    <div className={`border rounded-lg p-4 space-y-3 transition-colors ${allFilled ? "border-success/50 bg-success/5" : "border-border"}`}>
      <div className="flex items-start gap-3">
        <img src={file.previewUrl} alt="" className="h-16 w-20 rounded object-cover border flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium truncate">{file.name}</p>
            {allFilled ? (
              <CheckCircle2 className="h-4 w-4 text-success flex-shrink-0" />
            ) : (
              <Badge variant="secondary" className="text-[10px] flex-shrink-0">
                {filled}/{totalFields} fields
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div>
        <Label className="text-xs text-muted-foreground">Title</Label>
        <Input
          value={file.title}
          onChange={(e) => update("title", e.target.value)}
          placeholder="Image title…"
          className="mt-1"
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label className="text-xs text-muted-foreground">Photographer</Label>
          <Input
            value={file.photographer}
            onChange={(e) => update("photographer", e.target.value)}
            placeholder="Name…"
            className="mt-1"
          />
        </div>
        <div>
          <Label className="text-xs text-muted-foreground">Copyright</Label>
          <Input
            value={file.copyright}
            onChange={(e) => update("copyright", e.target.value)}
            placeholder="© 2025 …"
            className="mt-1"
          />
        </div>
      </div>

      <div>
        <Label className="text-xs text-muted-foreground">License</Label>
        <Input
          value={file.license}
          onChange={(e) => update("license", e.target.value)}
          placeholder="All rights reserved…"
          className="mt-1"
        />
      </div>

      <div>
        <Label className="text-xs text-muted-foreground">Description</Label>
        <Textarea
          value={file.description}
          onChange={(e) => update("description", e.target.value)}
          placeholder="Describe this image…"
          rows={2}
          className="mt-1 resize-none"
        />
      </div>

      <div>
        <div className="flex items-center justify-between">
          <Label className="text-xs text-muted-foreground">Alt Text</Label>
          <Button variant="ghost" size="sm" onClick={handleGenerateAlt} disabled={aiLoading} className="text-xs gap-1 h-7">
            <Sparkles className="h-3 w-3" />
            {aiLoading ? "Generating…" : "Generate AI Alt Text"}
          </Button>
        </div>
        <Textarea
          value={file.altText}
          onChange={(e) => update("altText", e.target.value)}
          placeholder="Accessible image description…"
          rows={2}
          className="mt-1 resize-none"
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
