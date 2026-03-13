import { getCdnUrl, type ImageSize } from "@/lib/cdnUrl";
import { Skeleton } from "@/components/ui/skeleton";

interface S3ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  s3Key?: string;
  /** Thumbnail size preset – defaults to "medium" */
  size?: ImageSize;
}

/**
 * Drop-in replacement for <img> that resolves S3 keys to CloudFront CDN
 * URLs with automatic resize and WebP conversion. Falls back to the
 * original src if no s3Key is provided.
 */
export function S3Image({ src, s3Key, size = "medium", alt, className, ...props }: S3ImageProps) {
  // If we have an s3Key, use the CDN URL directly – no async presigned fetching needed
  const resolvedUrl = s3Key ? getCdnUrl(s3Key, size) : src;

  // Don't render broken images for empty src without s3Key
  if (!resolvedUrl) {
    return <Skeleton className={className} />;
  }

  return <img src={resolvedUrl} alt={alt} className={className} loading="lazy" {...props} />;
}
