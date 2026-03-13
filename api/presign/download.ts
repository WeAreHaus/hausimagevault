import type { VercelRequest, VercelResponse } from "@vercel/node";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const BUCKET = process.env.S3_BUCKET!;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { key, expiresIn = 3600 } = req.body ?? {};
  if (!key) return res.status(400).json({ error: "key is required" });

  const command = new GetObjectCommand({ Bucket: BUCKET, Key: key });
  const downloadUrl = await getSignedUrl(s3, command, { expiresIn });

  return res.status(200).json({ downloadUrl });
}
