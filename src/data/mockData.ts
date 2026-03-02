import fjord1 from "@/assets/mock/fjord-1.jpg";
import aurora1 from "@/assets/mock/aurora-1.jpg";
import church1 from "@/assets/mock/church-1.jpg";
import hiking1 from "@/assets/mock/hiking-1.jpg";
import whale1 from "@/assets/mock/whale-1.jpg";
import village1 from "@/assets/mock/village-1.jpg";
import midnightSun1 from "@/assets/mock/midnight-sun-1.jpg";
import glacier1 from "@/assets/mock/glacier-1.jpg";

export type ImageStatus = "archived" | "shared" | "published";

export interface ImageItem {
  id: string;
  src: string;
  title: string;
  photographer: string;
  copyright: string;
  tourDate: string;
  groupId: string;
  guide: string;
  description: string;
  altText: string;
  tags: string[];
  status: ImageStatus[];
  width: number;
  height: number;
  fileSize: string;
  uploadedAt: string;
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

export const mockImages: ImageItem[] = [
  {
    id: "img-001",
    src: fjord1,
    title: "Fjord Panorama",
    photographer: "Erik Nordmann",
    copyright: "© 2025 Nordic Tours AS",
    tourDate: "2025-07-15",
    groupId: "GRP-2025-042",
    guide: "Ingrid Solberg",
    description: "Panoramic view of the Geirangerfjord with traditional red cabin on the shore.",
    altText: "Red cabin on fjord shore with snow-capped mountains",
    tags: ["fjord", "landscape", "cabin", "summer"],
    status: ["archived", "published"],
    width: 6000,
    height: 4000,
    fileSize: "24.3 MB",
    uploadedAt: "2025-07-16",
  },
  {
    id: "img-002",
    src: aurora1,
    title: "Northern Lights Display",
    photographer: "Sven Larsen",
    copyright: "© 2025 Nordic Tours AS",
    tourDate: "2025-01-22",
    groupId: "GRP-2025-008",
    guide: "Olav Hansen",
    description: "Spectacular aurora borealis over the Arctic tundra near Tromsø.",
    altText: "Vivid green and purple northern lights over snowy landscape",
    tags: ["aurora", "winter", "arctic", "night"],
    status: ["archived", "shared"],
    width: 6000,
    height: 4000,
    fileSize: "18.7 MB",
    uploadedAt: "2025-01-23",
  },
  {
    id: "img-003",
    src: church1,
    title: "Stave Church in Autumn",
    photographer: "Anna Bjørnstad",
    copyright: "© 2025 Nordic Tours AS",
    tourDate: "2025-09-28",
    groupId: "GRP-2025-061",
    guide: "Ingrid Solberg",
    description: "Historic wooden stave church surrounded by golden autumn foliage.",
    altText: "Dark wooden stave church with autumn trees",
    tags: ["church", "architecture", "autumn", "heritage"],
    status: ["archived"],
    width: 4000,
    height: 6000,
    fileSize: "21.1 MB",
    uploadedAt: "2025-09-29",
  },
  {
    id: "img-004",
    src: hiking1,
    title: "Mountain Trail Group",
    photographer: "Erik Nordmann",
    copyright: "© 2025 Nordic Tours AS",
    tourDate: "2025-08-05",
    groupId: "GRP-2025-048",
    guide: "Magnus Vik",
    description: "Tour group hiking along a panoramic mountain ridge trail.",
    altText: "Hikers on mountain trail with valley panorama",
    tags: ["hiking", "group", "mountain", "summer", "activity"],
    status: ["archived", "shared", "published"],
    width: 6000,
    height: 4000,
    fileSize: "19.8 MB",
    uploadedAt: "2025-08-06",
  },
  {
    id: "img-005",
    src: whale1,
    title: "Whale Watching Moment",
    photographer: "Sven Larsen",
    copyright: "© 2025 Nordic Tours AS",
    tourDate: "2025-06-12",
    groupId: "GRP-2025-035",
    guide: "Olav Hansen",
    description: "Humpback whale tail above the calm Nordic waters.",
    altText: "Whale tail breaching calm sea with misty mountains",
    tags: ["whale", "wildlife", "sea", "summer"],
    status: ["archived"],
    width: 6000,
    height: 4000,
    fileSize: "15.2 MB",
    uploadedAt: "2025-06-13",
  },
  {
    id: "img-006",
    src: village1,
    title: "Lofoten Fishing Village",
    photographer: "Anna Bjørnstad",
    copyright: "© 2025 Nordic Tours AS",
    tourDate: "2025-07-20",
    groupId: "GRP-2025-042",
    guide: "Ingrid Solberg",
    description: "Colorful traditional fishing village in the Lofoten Islands.",
    altText: "Colorful wooden houses along waterfront with boats",
    tags: ["village", "lofoten", "colorful", "summer", "architecture"],
    status: ["archived", "published"],
    width: 6000,
    height: 4000,
    fileSize: "22.5 MB",
    uploadedAt: "2025-07-21",
  },
  {
    id: "img-007",
    src: midnightSun1,
    title: "Midnight Sun Seascape",
    photographer: "Erik Nordmann",
    copyright: "© 2025 Nordic Tours AS",
    tourDate: "2025-06-21",
    groupId: "GRP-2025-038",
    guide: "Magnus Vik",
    description: "The midnight sun casting golden light over the Norwegian Sea.",
    altText: "Dramatic sunset over calm ocean with clouds",
    tags: ["midnight sun", "sea", "sunset", "summer"],
    status: ["archived", "shared"],
    width: 6000,
    height: 4000,
    fileSize: "16.9 MB",
    uploadedAt: "2025-06-22",
  },
  {
    id: "img-008",
    src: glacier1,
    title: "Blue Ice Cave",
    photographer: "Sven Larsen",
    copyright: "© 2025 Nordic Tours AS",
    tourDate: "2025-03-10",
    groupId: "GRP-2025-018",
    guide: "Olav Hansen",
    description: "Interior of a glacier ice cave with ethereal blue light.",
    altText: "Blue ice cave interior with turquoise light",
    tags: ["glacier", "ice", "winter", "adventure", "cave"],
    status: ["archived"],
    width: 4000,
    height: 6000,
    fileSize: "20.4 MB",
    uploadedAt: "2025-03-11",
  },
];

export const mockShareLinks: ShareLink[] = [
  {
    id: "share-001",
    imageIds: ["img-002", "img-007"],
    recipientEmails: ["customer@example.com"],
    expiresAt: "2025-08-15",
    createdAt: "2025-07-25",
    allowOriginalDownload: false,
    allowWebDownload: true,
    url: "https://share.nordictours.com/s/abc123def",
  },
  {
    id: "share-002",
    imageIds: ["img-004"],
    recipientEmails: ["group48@example.com", "travel@blog.com"],
    expiresAt: "2025-09-01",
    createdAt: "2025-08-06",
    allowOriginalDownload: true,
    allowWebDownload: true,
    url: "https://share.nordictours.com/s/xyz789ghi",
  },
];

export const photographers = [...new Set(mockImages.map((i) => i.photographer))];
export const guides = [...new Set(mockImages.map((i) => i.guide))];
export const groupIds = [...new Set(mockImages.map((i) => i.groupId))];
export const allTags = [...new Set(mockImages.flatMap((i) => i.tags))];
