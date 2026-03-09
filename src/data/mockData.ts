import fjord1 from "@/assets/mock/fjord-1.jpg";
import aurora1 from "@/assets/mock/aurora-1.jpg";
import church1 from "@/assets/mock/church-1.jpg";
import hiking1 from "@/assets/mock/hiking-1.jpg";
import whale1 from "@/assets/mock/whale-1.jpg";
import village1 from "@/assets/mock/village-1.jpg";
import midnightSun1 from "@/assets/mock/midnight-sun-1.jpg";
import glacier1 from "@/assets/mock/glacier-1.jpg";

export type ImageStatus = "archived" | "shared" | "published";
export type MediaType = "image" | "video";

export interface ImageItem {
  id: string;
  src: string;
  title: string;
  photographer: string;
  copyright: string;
  tourDate: string;
  description: string;
  altText: string;
  tags: string[];
  status: ImageStatus[];
  width: number;
  height: number;
  fileSize: string;
  uploadedAt: string;
  wpPublishedAt?: string;
  wpSyncDirty?: boolean;
  mediaType: MediaType;
  duration?: string;
}

export interface ShareLink {
  id: string;
  imageIds: string[];
  recipientEmails: string[];
  expiresAt: string;
  createdAt: string;
  allowOriginalDownload: boolean;
  allowWebDownload: boolean;
  url: string;
}

const baseSources = [fjord1, aurora1, church1, hiking1, whale1, village1, midnightSun1, glacier1];

const titles = [
  "Fjord Panorama", "Northern Lights Display", "Stave Church in Autumn", "Mountain Trail Group",
  "Whale Watching Moment", "Lofoten Fishing Village", "Midnight Sun Seascape", "Blue Ice Cave",
  "Coastal Cliff Walk", "Reindeer Herd", "Glacier Hike", "Bergen Harbour", "Arctic Fox Close-up",
  "Tundra Wildflowers", "Snowmobile Adventure", "Viking Museum Visit", "Waterfall Rappelling",
  "Fjord Kayaking", "Northern Village Dawn", "Ice Hotel Interior",
];

const photographerList = ["Erik Nordmann", "Sven Larsen", "Anna Bjørnstad", "Marte Ødegaard", "Lars Kjeldsen"];
const tagPool = [
  "fjord", "landscape", "cabin", "summer", "aurora", "winter", "arctic", "night", "church",
  "architecture", "autumn", "heritage", "hiking", "group", "mountain", "activity", "whale",
  "wildlife", "sea", "village", "lofoten", "colorful", "midnight sun", "sunset", "glacier",
  "ice", "adventure", "cave", "coast", "reindeer", "tundra", "flowers", "snowmobile",
  "museum", "waterfall", "kayaking", "dawn", "hotel", "fox", "harbour",
];

const statusOptions: ImageStatus[][] = [
  ["archived"],
  ["archived", "shared"],
  ["archived", "published"],
  ["archived", "shared", "published"],
];

function generateMockImages(count: number): ImageItem[] {
  const images: ImageItem[] = [];
  for (let i = 0; i < count; i++) {
    const src = baseSources[i % baseSources.length];
    const title = titles[i % titles.length] + (i >= titles.length ? ` #${Math.floor(i / titles.length) + 1}` : "");
    const photographer = photographerList[i % photographerList.length];
    const month = (i % 12) + 1;
    const day = (i % 28) + 1;
    const tourDate = `2025-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    // Pick 2-5 random tags
    const shuffled = [...tagPool].sort(() => 0.5 - Math.random());
    const tags = shuffled.slice(0, 2 + (i % 4));

    const isPortrait = i % 5 === 2;
    const isVideo = i % 10 === 5; // ~10% are videos

    images.push({
      id: `img-${String(i + 1).padStart(4, "0")}`,
      src,
      title,
      photographer,
      copyright: "© 2025 Nordic Tours AS",
      tourDate,
      groupId: `GRP-2025-${groupNum}`,
      description: `Tour photo ${i + 1}: ${title.toLowerCase()} captured on a guided Nordic tour.`,
      altText: `${title} – scenic Nordic tour photography`,
      tags,
      status: statusOptions[i % statusOptions.length],
      width: isPortrait ? 4000 : (isVideo ? 1920 : 6000),
      height: isPortrait ? 6000 : (isVideo ? 1080 : 4000),
      fileSize: isVideo ? `${(80 + (i % 60)).toFixed(0)} MB` : `${(14 + (i % 12)).toFixed(1)} MB`,
      uploadedAt: tourDate,
      mediaType: isVideo ? "video" : "image",
      duration: isVideo ? `${1 + (i % 4)}:${String(10 + (i % 50)).padStart(2, "0")}` : undefined,
      wpPublishedAt: i % 4 === 3 ? tourDate : undefined,
      wpSyncDirty: i % 4 === 3 && i % 8 === 3,
      ...(i % 7 === 0 ? { description: "", altText: "" } : {}),
    });
  }
  return images;
}

export const mockImages: ImageItem[] = generateMockImages(240);

export const mockShareLinks: ShareLink[] = [
  {
    id: "share-001",
    imageIds: ["img-0002", "img-0007"],
    recipientEmails: ["customer@example.com"],
    expiresAt: "2025-08-15",
    createdAt: "2025-07-25",
    allowOriginalDownload: false,
    allowWebDownload: true,
    url: "https://share.nordictours.com/s/abc123def",
  },
  {
    id: "share-002",
    imageIds: ["img-0004"],
    recipientEmails: ["group48@example.com", "travel@blog.com"],
    expiresAt: "2025-09-01",
    createdAt: "2025-08-06",
    allowOriginalDownload: true,
    allowWebDownload: true,
    url: "https://share.nordictours.com/s/xyz789ghi",
  },
];

export const photographers = [...new Set(mockImages.map((i) => i.photographer))];
export const groupIds = [...new Set(mockImages.map((i) => i.groupId))];
export const allTags = [...new Set(mockImages.flatMap((i) => i.tags))].sort();
