import { useState } from "react";
import type { ImageItem } from "@/data/mockData";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, ImageDown, FileText, Globe } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  image: ImageItem;
}

type Step = "confirm" | "processing" | "done";

const steps = [
  { icon: ImageDown, label: "Resizing to max 2000px…" },
  { icon: FileText, label: "Converting to web-optimized format…" },
  { icon: FileText, label: "Attaching metadata…" },
  { icon: Globe, label: "Publishing to WordPress…" },
];

export function PublishModal({ open, onClose, image }: Props) {
  const [step, setStep] = useState<Step>("confirm");
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const handlePublish = () => {
    setStep("processing");
    setProgress(0);
    setCurrentStep(0);

    const total = steps.length;
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setCurrentStep(Math.min(i, total - 1));
      setProgress(Math.min((i / total) * 100, 100));
      if (i >= total) {
        clearInterval(interval);
        setTimeout(() => setStep("done"), 600);
      }
    }, 800);
  };

  const handleClose = () => {
    setStep("confirm");
    setProgress(0);
    setCurrentStep(0);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {step === "confirm" && "Publish to Website"}
            {step === "processing" && "Publishing…"}
            {step === "done" && "Published!"}
          </DialogTitle>
        </DialogHeader>

        {step === "confirm" && (
          <div className="space-y-4">
            <div className="flex gap-3 items-start">
              <img src={image.src} alt={image.altText} className="h-16 w-20 rounded object-cover" />
              <div>
                <p className="font-medium text-sm">{image.title}</p>
                <p className="text-xs text-muted-foreground">{image.width} × {image.height}px · {image.fileSize}</p>
              </div>
            </div>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>This will:</p>
              <ul className="list-disc pl-5 space-y-0.5">
                <li>Resize to max 2000px width</li>
                <li>Convert to web-optimized JPEG</li>
                <li>Attach all metadata (alt text, copyright, etc.)</li>
                <li>Upload to WordPress media library</li>
              </ul>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleClose} className="flex-1">Cancel</Button>
              <Button onClick={handlePublish} className="flex-1 gap-1.5">
                <Globe className="h-4 w-4" /> Publish
              </Button>
            </div>
          </div>
        )}

        {step === "processing" && (
          <div className="space-y-4 py-4">
            <Progress value={progress} className="h-2" />
            <div className="space-y-2">
              {steps.map((s, i) => {
                const Icon = s.icon;
                const isDone = i < currentStep;
                const isCurrent = i === currentStep;
                return (
                  <div key={i} className={`flex items-center gap-2 text-sm ${isCurrent ? "text-foreground" : isDone ? "text-success" : "text-muted-foreground/40"}`}>
                    {isDone ? <CheckCircle2 className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                    {s.label}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {step === "done" && (
          <div className="text-center space-y-4 py-4">
            <CheckCircle2 className="h-14 w-14 text-success mx-auto" />
            <div>
              <p className="font-medium">Image successfully published to WordPress</p>
              <p className="text-sm text-muted-foreground mt-1">
                "{image.title}" is now live on your website.
              </p>
            </div>
            <Button onClick={handleClose} className="w-full">Done</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
