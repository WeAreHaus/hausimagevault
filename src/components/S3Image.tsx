import { useS3Url } from "@/hooks/useS3Url";
import { Skeleton } from "@/components/ui/skeleton";

interface S3ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  s3Key?: string;
}

/**
 * Drop-in replacement for <img> that automatically resolves S3 keys
 * to presigned download URLs. Falls back to the original src if no s3Key.
 */
export function S3Image({ src, s3Key, alt, className, ...props }: S3ImageProps) {
  const { url, loading } = useS3Url(src, s3Key);

  if (loading) {
    return <Skeleton className={className} />;
  }

  return <img src={url} alt={alt} className={className} {...props} />;
}
