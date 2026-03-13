import { useSyncExternalStore } from "react";
import { imageStore } from "@/stores/imageStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Images, Share2, Globe, Archive } from "lucide-react";
import { S3Image } from "@/components/S3Image";

export default function Dashboard() {
  const images = useSyncExternalStore(imageStore.subscribe, imageStore.getSnapshot);

  const stats = [
    { label: "Total Images", value: images.length, icon: Images, color: "text-primary" },
    { label: "Archived", value: images.filter((i) => i.status.includes("archived")).length, icon: Archive, color: "text-muted-foreground" },
    { label: "Shared", value: images.filter((i) => i.status.includes("shared")).length, icon: Share2, color: "text-info" },
    { label: "Published", value: images.filter((i) => i.status.includes("published")).length, icon: Globe, color: "text-success" },
  ];

  return (
    <div className="p-6 lg:p-8 space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Overview of your image library</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{s.label}</CardTitle>
              <s.icon className={`h-4 w-4 ${s.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{s.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {images.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Uploads</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {images.slice(0, 4).map((img) => (
              <div key={img.id} className="flex items-center gap-3">
                <S3Image src={img.src} s3Key={img.s3Key} alt={img.altText} className="h-10 w-14 rounded object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{img.title}</p>
                  <p className="text-xs text-muted-foreground">{img.photographer} · {img.tourDate}</p>
                </div>
                <span className="text-xs text-muted-foreground">{img.fileSize}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {images.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <Images className="h-10 w-10 mx-auto mb-3 opacity-40" />
          <p>No images in this vault yet.</p>
        </div>
      )}
    </div>
  );
}
