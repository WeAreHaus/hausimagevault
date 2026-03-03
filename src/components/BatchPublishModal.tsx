import { useState, useEffect, useCallback } from "react";
import type { ImageItem } from "@/data/mockData";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle2, Globe, ImageDown, FileText, Loader2, X } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  images: ImageItem[];
}

type Phase = "confirm" | "processing" | "done";

const stepLabels = [
  "Resizing…",
  "Optimizing…",
  "Metadata…",
  "Publishing…",
];

export function BatchPublishModal({ open, onClose, images }: Props) {
  const [phase, setPhase] = useState<Phase>("confirm");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());

  const reset = useCallback(() => {
    setPhase("confirm");
    setCurrentIndex(0);
    setCurrentStep(0);
    setCompletedIds(new Set());
  }, []);

  useEffect(() => {
    if (phase !== "processing") return;

    const totalSteps = stepLabels.length;
    let step = 0;

    const interval = setInterval(() => {
      step++;
      if (step < totalSteps) {
        setCurrentStep(step);
      } else {
        // Mark current image done, move to next
        setCompletedIds((prev) => {
          const next = new Set(prev);
          next.add(images[currentIndex]?.id);
          return next;
        });

        const nextIdx = currentIndex + 1;
        if (nextIdx >= images.length) {
          clearInterval(interval);
          setTimeout(() => setPhase("done"), 400);
        } else {
          setCurrentIndex(nextIdx);
          setCurrentStep(0);
          step = 0;
        }
      }
    }, 350);

    return () => clearInterval(interval);
  }, [phase, currentIndex, images]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const overallProgress =
    phase === "done"
      ? 100
      : phase === "confirm"
      ? 0
      : ((completedIds.size + currentStep / stepLabels.length) / images.length) * 100;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {phase === "confirm" && `Publish ${images.length} image${images.length !== 1 ? "s" : ""} to WordPress`}
            {phase === "processing" && "Publishing…"}
            {phase === "done" && "All published!"}
          </DialogTitle>
        </DialogHeader>

        {phase === "confirm" && (
          <div className="space-y-4">
            <ScrollArea className="max-h-[200px]">
              <div className="flex flex-wrap gap-2">
                {images.map((img) => (
                  <img
                    key={img.id}
                    src={img.src}
                    alt={img.altText}
                    className="h-14 w-18 rounded border object-cover"
                  />
                ))}
              </div>
            </ScrollArea>
            <p className="text-sm text-muted-foreground">
              Each image will be resized, optimized, have metadata attached, and be pushed to WordPress.
            </p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleClose} className="flex-1">Cancel</Button>
              <Button onClick={() => setPhase("processing")} className="flex-1 gap-1.5">
                <Globe className="h-4 w-4" /> Publish All
              </Button>
            </div>
          </div>
        )}

        {phase === "processing" && (
          <div className="space-y-4 py-2">
            <Progress value={overallProgress} className="h-2" />
            <p className="text-xs text-muted-foreground text-center">
              {completedIds.size} of {images.length} complete
            </p>
            {images[currentIndex] && (
              <div className="flex gap-3 items-center border rounded-lg p-3">
                <img
                  src={images[currentIndex].src}
                  alt={images[currentIndex].altText}
                  className="h-12 w-16 rounded object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{images[currentIndex].title}</p>
                  <div className="flex items-center gap-1.5 mt-1 text-xs text-primary">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    {stepLabels[currentStep]}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {phase === "done" && (
          <div className="text-center space-y-4 py-4">
            <CheckCircle2 className="h-14 w-14 text-success mx-auto" />
            <div>
              <p className="font-medium">
                {images.length} image{images.length !== 1 ? "s" : ""} published to WordPress
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                All metadata has been synced.
              </p>
            </div>
            <Button onClick={handleClose} className="w-full">Done</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
