import { useState, useEffect } from "react";
import { getDownloadUrl } from "@/lib/s3Client";

/**
 * Cache presigned URLs in memory so we don't re-fetch on every render.
 * URLs are valid for 1 hour; cache for 50 minutes to be safe.
 */
const urlCache = new Map<string, { url: string; expires: number }>();
const CACHE_TTL = 50 * 60 * 1000; // 50 minutes

function isBlob(src: string) {
  return src.startsWith("blob:");
}

/**
 * Resolves an image source: if the image has an s3Key, fetches a presigned
 * download URL. Otherwise returns the original src.
 * Returns `{ url, loading }`.
 */
export function useS3Url(src: string, s3Key?: string) {
  const [url, setUrl] = useState<string>(() => {
    // If we have a cached S3 URL, use it immediately
    if (s3Key) {
      const cached = urlCache.get(s3Key);
      if (cached && cached.expires > Date.now()) return cached.url;
    }
    // If no s3Key or src isn't a stale blob, use src directly
    return src;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Nothing to resolve if no s3Key
    if (!s3Key) {
      setUrl(src);
      return;
    }

    // Check cache
    const cached = urlCache.get(s3Key);
    if (cached && cached.expires > Date.now()) {
      setUrl(cached.url);
      return;
    }

    // If src is a valid non-blob URL and we don't have s3Key issues, keep it
    // But if src is a blob (stale after refresh), we must fetch
    if (!isBlob(src) && src.startsWith("http")) {
      setUrl(src);
      return;
    }

    let cancelled = false;
    setLoading(true);

    getDownloadUrl(s3Key)
      .then((presignedUrl) => {
        if (cancelled) return;
        urlCache.set(s3Key, { url: presignedUrl, expires: Date.now() + CACHE_TTL });
        setUrl(presignedUrl);
      })
      .catch((err) => {
        console.warn("Failed to get S3 download URL:", err);
        if (!cancelled) setUrl(src); // fallback
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [src, s3Key]);

  return { url, loading };
}
