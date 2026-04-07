"use client";

import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import BookARoomButton from "@/components/BookARoomButton";
import { Button } from "@/components/ui/button";
import ImagesCarousel from "@/components/ImageCarousel";

export interface FeatureCardProps {
  name: string;
  badge?: string;
  imgUrl?: string[];
  altText?: string;
  tagline?: string;
  description: string;
  href: string;
  ctaLabel?: string;
  badges?: string[];
  onCtaClick?: () => void;
}

const FeatureCard = ({
  name,
  badge,
  imgUrl,
  altText,
  tagline,
  description,
  href,
  ctaLabel = "More Info",
  badges,
  onCtaClick,
}: FeatureCardProps) => {
  const router = useRouter();

  return (
    <div className="flex-1 max-w-125">
      <ImagesCarousel imgUrl={imgUrl} altText={altText} height="h-80" width="max-w-125" />

      <div className="flex justify-center">
        <div className="border-b-1 text-center border-[#BF882E] p-3 px-12">
          <h2 className="font-semibold text-[16px]">{name}</h2>
          {tagline && <h3 className="text-[14px]">{tagline}</h3>}
        </div>
      </div>

      <p className="text-center text-[14px] pt-3">{description}</p>

      {badges && badges.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2 px-3 py-2">
          {badges.map((badge) => (
            <span
              key={badge}
              className="border border-gray-300 px-2 py-0.5 text-[12px] text-gray-600"
            >
              {badge}
            </span>
          ))}
        </div>
      )}

      <div className="flex justify-center gap-5 mt-3 mb-3">
        <BookARoomButton />
        <Button
          onClick={onCtaClick ?? (() => router.push(href))}
          className="hover:text-white hover:bg-[#bf882e] hover:border-[#bf882e] text-[12px] max-h-[32px] cursor-pointer rounded-none bg-transparent text-gray-700 border-1 border-black"
        >
          {ctaLabel}
          <ArrowRight />
        </Button>
      </div>
    </div>
  );
};

export default FeatureCard;
