import { Badge } from "@/components/ui/badge";
import type { ImageStatus } from "@/data/mockData";
import { Archive, Share2, Globe } from "lucide-react";

const config: Record<ImageStatus, { label: string; icon: React.ElementType; className: string }> = {
  archived: {
    label: "Archived",
    icon: Archive,
    className: "bg-muted text-muted-foreground border-border",
  },
  shared: {
    label: "Shared",
    icon: Share2,
    className: "bg-info/10 text-info border-info/20",
  },
  published: {
    label: "Published",
    icon: Globe,
    className: "bg-success/10 text-success border-success/20",
  },
};

export function StatusBadge({ status }: { status: ImageStatus }) {
  const c = config[status];
  const Icon = c.icon;
  return (
    <Badge variant="outline" className={`gap-1 text-xs font-normal ${c.className}`}>
      <Icon className="h-3 w-3" />
      {c.label}
    </Badge>
  );
}
