/**
 * S3 API client – talks to Vercel Functions that proxy AWS S3.
 *
 * In production the functions live at /api/... on the same domain.
 * For local dev you can override via VITE_API_BASE_URL env var.
 */

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface PresignUploadRequest {
  fileName: string;
  contentType: string;
  /** Optional subfolder inside the bucket, e.g. "originals" */
  prefix?: string;
}

export interface PresignUploadResponse {
  /** Presigned PUT URL – upload the file body here */
  uploadUrl: string;
  /** The final public/presigned GET key for later retrieval */
  key: string;
}

export interface PresignDownloadRequest {
  key: string;
  /** Seconds until the URL expires (default 3600) */
  expiresIn?: number;
}

export interface PresignDownloadResponse {
  downloadUrl: string;
}

export interface DeleteObjectsRequest {
  keys: string[];
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

async function api<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "Unknown error");
    throw new Error(`API ${path} failed (${res.status}): ${text}`);
  }

  return res.json() as Promise<T>;
}

/* ------------------------------------------------------------------ */
/*  Public API                                                         */
/* ------------------------------------------------------------------ */

/**
 * Get a presigned PUT URL, then upload the file directly to S3.
 * Returns the S3 object key for later retrieval.
 */
export async function uploadFileToS3(
  file: File,
  prefix = "originals",
): Promise<string> {
  // 1. Get presigned URL from backend
  const { uploadUrl, key } = await api<PresignUploadResponse>(
    "/api/presign/upload",
    {
      fileName: file.name,
      contentType: file.type,
      prefix,
    } satisfies PresignUploadRequest,
  );

  // 2. PUT the file directly to S3
  const putRes = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });

  if (!putRes.ok) {
    throw new Error(`S3 upload failed (${putRes.status})`);
  }

  return key;
}

/**
 * Get a time-limited download/view URL for an S3 object.
 */
export async function getDownloadUrl(
  key: string,
  expiresIn = 3600,
): Promise<string> {
  const { downloadUrl } = await api<PresignDownloadResponse>(
    "/api/presign/download",
    { key, expiresIn } satisfies PresignDownloadRequest,
  );
  return downloadUrl;
}

/**
 * Delete one or more objects from S3.
 */
export async function deleteObjects(keys: string[]): Promise<void> {
  await api("/api/objects/delete", { keys } satisfies DeleteObjectsRequest);
}
