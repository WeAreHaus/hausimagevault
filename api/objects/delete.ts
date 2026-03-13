import type { VercelRequest, VercelResponse } from "@vercel/node";
import { S3Client, DeleteObjectsCommand } from "@aws-sdk/client-s3";

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

  const { keys } = req.body ?? {};
  if (!Array.isArray(keys) || keys.length === 0) return res.status(400).json({ error: "keys array required" });

  await s3.send(
    new DeleteObjectsCommand({
      Bucket: BUCKET,
      Delete: { Objects: keys.map((Key: string) => ({ Key })) },
    }),
  );

  return res.status(200).json({ deleted: keys.length });
}
