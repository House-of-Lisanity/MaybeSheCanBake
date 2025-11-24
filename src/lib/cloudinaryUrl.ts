// maybeshecanbake/src/lib/cloudinaryUrl.ts

/**
 * Build a Cloudinary transformation URL from an existing image URL.
 * If the URL is not a Cloudinary upload URL, the original is returned.
 */
export function buildCloudinaryUrl(
  originalUrl: string,
  width: number,
  height: number
): string {
  // Only transform Cloudinary upload URLs
  const uploadMarker = "/upload/";
  const hasUploadSegment = originalUrl.includes(uploadMarker);

  if (!hasUploadSegment) {
    return originalUrl;
  }

  const [prefix, rest] = originalUrl.split(uploadMarker);

  // c_fill = crop to fill, g_auto = auto-gravity (subject aware)
  const transformation = `c_fill,w_${width},h_${height},g_auto`;

  return `${prefix}${uploadMarker}${transformation}/${rest}`;
}
