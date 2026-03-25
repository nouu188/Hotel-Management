"use client";

import Image, { type ImageProps } from "next/image";
import { CldImage } from "next-cloudinary";
import {
  getCloudinaryPublicId,
  isCloudinaryEnabled,
} from "@/lib/cloudinary-assets";

type CloudinaryImageProps = Omit<ImageProps, "src"> & {
  localSrc: string;
};

export default function CloudinaryImage({
  localSrc,
  alt,
  width,
  height,
  fill,
  sizes,
  className,
  priority,
  placeholder,
  blurDataURL,
  ...rest
}: CloudinaryImageProps) {
  if (isCloudinaryEnabled()) {
    return (
      <CldImage
        src={getCloudinaryPublicId(localSrc)}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        sizes={sizes}
        className={className}
        priority={priority}
        format="auto"
        quality="auto"
        {...(placeholder === "blur" && blurDataURL
          ? { placeholder: "blur" as const, blurDataURL }
          : {})}
        {...rest}
      />
    );
  }

  return (
    <Image
      src={localSrc}
      alt={alt}
      width={width}
      height={height}
      fill={fill}
      sizes={sizes}
      className={className}
      priority={priority}
      placeholder={placeholder}
      blurDataURL={blurDataURL}
      {...rest}
    />
  );
}
