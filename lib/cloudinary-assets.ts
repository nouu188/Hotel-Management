const CLOUDINARY_PREFIX = 'hotel-assets';

/**
 * Converts a local public path to a Cloudinary public_id.
 * "/room/deluxe-room/Deluxe_2-2000.jpg" -> "hotel-assets/room/deluxe-room/Deluxe_2-2000"
 */
export function getCloudinaryPublicId(localPath: string): string {
  const normalized = localPath.startsWith('/') ? localPath.slice(1) : localPath;
  const lastDot = normalized.lastIndexOf('.');
  const withoutExt = lastDot > 0 ? normalized.slice(0, lastDot) : normalized;
  return `${CLOUDINARY_PREFIX}/${withoutExt}`;
}

export function isCloudinaryEnabled(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME);
}
