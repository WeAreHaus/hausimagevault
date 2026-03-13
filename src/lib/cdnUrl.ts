/**
 * CloudFront image transformation URL builder.
 *
 * Generates URLs with on-the-fly resize, format conversion and quality settings
 * using the CloudFront image handler service.
 */

const CDN_BASE = "https://d2xl9ufqmflyyf.cloudfront.net";

export type ImageSize = "thumb" | "medium" | "large" | "original";

const SIZE_PRESETS: Record<Exclude<ImageSize, "original">, { width: number }> = {
  /** Small thumbnails – dashboard lists, tiny previews (~56-100px displayed) */
  thumb: { width: 150 },
  /** Grid cards, share previews (~200-400px displayed) */
  medium: { width: 480 },
  /** Detail modals, large previews */
  large: { width: 960 },
};

/**
 * Build a CloudFront CDN URL with image transformations.
 *
 * @param s3Key  The S3 object key, e.g. "kiruna-tu340i/originals/abc.png"
 * @param size   Preset size or "original" for no resize
 * @returns      Full CDN URL with query params
 */
export function getCdnUrl(s3Key: string, size: ImageSize = "medium"): string {
  const params = new URLSearchParams();

  params.set("format", "webp");
  params.set("quality", "80");

  if (size !== "original") {
    const preset = SIZE_PRESETS[size];
    params.set("resize.width", String(preset.width));
  }

  return `${CDN_BASE}/${s3Key}?${params.toString()}`;
}
