import { useState, useMemo, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { MetadataEntryForm, countFilledFields, totalFields, type UploadedFile } from "@/components/MetadataEntryForm";
import { Upload, CheckCircle2, ArrowLeft, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { imageStore } from "@/stores/imageStore";

// Mock images for simulated upload
import fjord1 from "@/assets/mock/fjord-1.jpg";
import aurora1 from "@/assets/mock/aurora-1.jpg";
import church1 from "@/assets/mock/church-1.jpg";
import hiking1 from "@/assets/mock/hiking-1.jpg";
import whale1 from "@/assets/mock/whale-1.jpg";
import village1 from "@/assets/mock/village-1.jpg";

const mockPreviews = [fjord1, aurora1, church1, hiking1, whale1, village1];

function createMockFiles(count: number): UploadedFile[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `upload-${i}`,
    name: `IMG_${String(4200 + i).padStart(4, "0")}.jpg`,
    previewUrl: mockPreviews[i % mockPreviews.length],
    title: "",
    photographer: "",
     copyright: "",
     license: "",
    description: "",
    altText: "",
    tags: "",
  }));
}

function filesToUploaded(fileList: FileList): UploadedFile[] {
  return Array.from(fileList).map((file, i) => ({
    id: `upload-real-${Date.now()}-${i}`,
    name: file.name,
    previewUrl: URL.createObjectURL(file),
    title: "",
    photographer: "",
    copyright: "",
    description: "",
    altText: "",
    tags: "",
  }));
}

export default function UploadFlow() {
  const [step, setStep] = useState<"dropzone" | "metadata" | "done">("dropzone");
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalFilledFields = useMemo(() => files.reduce((sum, f) => sum + countFilledFields(f), 0), [files]);
  const totalPossibleFields = files.length * totalFields;
  const progressPercent = totalPossibleFields > 0 ? (totalFilledFields / totalPossibleFields) * 100 : 0;

  const handleRealFiles = useCallback((fileList: FileList) => {
    const imageFiles = Array.from(fileList).filter((f) => f.type.startsWith("image/"));
    if (imageFiles.length === 0) {
      toast.error("No image files selected");
      return;
    }
    const dt = new DataTransfer();
    imageFiles.forEach((f) => dt.items.add(f));
    setFiles(filesToUploaded(dt.files));
    setStep("metadata");
    toast.success(`${imageFiles.length} image${imageFiles.length !== 1 ? "s" : ""} added`);
  }, []);

  const handleSimulateUpload = (count: number) => {
    setFiles(createMockFiles(count));
    setStep("metadata");
  };

  const handleFileChange = (index: number, updated: UploadedFile) => {
    setFiles((prev) => prev.map((f, i) => (i === index ? updated : f)));
  };

  const handleFinalize = () => {
    imageStore.addImages(files);
    setStep("done");
    toast.success(`${files.length} images uploaded`);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files.length > 0) {
      handleRealFiles(e.dataTransfer.files);
    }
  }, [handleRealFiles]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
  }, []);

  if (step === "done") {
    return (
      <div className="p-6 lg:p-8 animate-fade-in">
        <div className="max-w-md mx-auto text-center space-y-6 py-20">
          <CheckCircle2 className="h-20 w-20 text-success mx-auto" />
          <h1 className="text-2xl font-semibold">Upload Complete</h1>
          <p className="text-muted-foreground">
            {files.length} image{files.length !== 1 ? "s" : ""} uploaded.
            They are now available in the Image Library.
          </p>
          <Button onClick={() => { setStep("dropzone"); setFiles([]); }}>
            Upload More
          </Button>
        </div>
      </div>
    );
  }

  if (step === "metadata") {
    return (
      <div className="p-6 lg:p-8 space-y-4 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Fill Metadata</h1>
            <p className="text-muted-foreground mt-1">
              Add metadata to your images. You can finalize at any time.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => setStep("dropzone")} className="gap-1.5">
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {totalFilledFields} of {totalPossibleFields} fields filled
            </span>
            <span className="font-medium text-primary">{Math.round(progressPercent)}%</span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>

        {/* Forms — native scroll */}
        <div className="space-y-4">
          {files.map((file, idx) => (
            <MetadataEntryForm
              key={file.id}
              file={file}
              onChange={(updated) => handleFileChange(idx, updated)}
            />
          ))}
        </div>

        {/* Finalize */}
        <div className="flex items-center justify-between pt-2 border-t">
          <p className="text-sm text-muted-foreground">
            {Math.round(progressPercent) === 100
              ? "All metadata filled — ready to finalize!"
              : `${Math.round(progressPercent)}% of metadata filled.`}
          </p>
          <Button onClick={handleFinalize} className="gap-1.5">
            <CheckCircle2 className="h-4 w-4" /> Finalize Upload
          </Button>
        </div>
      </div>
    );
  }

  // Dropzone step
  return (
    <div className="p-6 lg:p-8 animate-fade-in">
      <h1 className="text-2xl font-semibold tracking-tight">Upload Images</h1>
      <p className="text-muted-foreground mt-1">
        Drag &amp; drop or select files to upload. You'll fill in metadata in the next step.
      </p>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        onChange={(e) => e.target.files && handleRealFiles(e.target.files)}
      />

      <div className="mt-8 max-w-xl mx-auto">
        <div
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`border-2 border-dashed rounded-xl p-16 text-center transition-colors cursor-pointer ${
            dragging
              ? "border-primary bg-primary/10"
              : "hover:border-primary/50 hover:bg-accent/30"
          }`}
        >
          <Upload className={`h-12 w-12 mx-auto mb-4 ${dragging ? "text-primary" : "text-muted-foreground"}`} />
          <p className="text-lg font-medium">{dragging ? "Drop images here" : "Drop images here"}</p>
          <p className="text-sm text-muted-foreground mt-1">or click to browse</p>
        </div>

        <div className="mt-6 text-center space-y-2">
          <p className="text-xs text-muted-foreground">Simulated upload:</p>
          <div className="flex gap-2 justify-center">
            {[3, 6, 12].map((n) => (
              <Button key={n} variant="outline" size="sm" onClick={() => handleSimulateUpload(n)}>
                <ImageIcon className="h-3.5 w-3.5 mr-1.5" /> {n} images
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
