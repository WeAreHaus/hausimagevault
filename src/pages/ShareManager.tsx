import { useState } from "react";
import { mockShareLinks, mockImages } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Share2, Plus, ExternalLink, Download, Globe } from "lucide-react";
import { ShareModal } from "@/components/ShareModal";

export default function ShareManager() {
  const [showCreate, setShowCreate] = useState(false);

  const getImages = (ids: string[]) => mockImages.filter((i) => ids.includes(i.id));

  return (
    <div className="p-6 lg:p-8 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Share Manager</h1>
          <p className="text-muted-foreground mt-1">Manage expiring share links</p>
        </div>
        <Button onClick={() => setShowCreate(true)} className="gap-1.5">
          <Plus className="h-4 w-4" /> New Share Link
        </Button>
      </div>

      <div className="grid gap-4">
        {mockShareLinks.map((link) => {
          const images = getImages(link.imageIds);
          return (
            <Card key={link.id}>
              <CardContent className="p-5">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex gap-2">
                    {images.map((img) => (
                      <img key={img.id} src={img.src} alt={img.altText} className="h-16 w-20 rounded object-cover" />
                    ))}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <Share2 className="h-4 w-4 text-info" />
                      <span className="text-sm font-medium">{link.imageIds.length} image{link.imageIds.length > 1 ? "s" : ""}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      To: {link.recipientEmails.join(", ")}
                    </p>
                    <div className="flex flex-wrap gap-2 text-xs">
                      <Badge variant="outline" className="font-normal">Created {link.createdAt}</Badge>
                      <Badge variant="outline" className="font-normal">Expires {link.expiresAt}</Badge>
                      {link.allowOriginalDownload && (
                        <Badge variant="secondary" className="gap-1 font-normal">
                          <Download className="h-3 w-3" /> Original
                        </Badge>
                      )}
                      {link.allowWebDownload && (
                        <Badge variant="secondary" className="gap-1 font-normal">
                          <Globe className="h-3 w-3" /> Web
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground font-mono truncate">{link.url}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <ShareModal open={showCreate} onClose={() => setShowCreate(false)} />
    </div>
  );
}
