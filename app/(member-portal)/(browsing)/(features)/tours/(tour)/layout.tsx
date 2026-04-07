"use client";

import FeatureRelatedStrip from "@/components/FeatureRelatedStrip";
import { tourServicesInBrief } from "@/constants/tours";
import { usePathname } from "next/navigation";
import React from "react";

export default function TourLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const slug = pathname.split("/").at(-1) ?? "";

  return (
    <div className="w-full">
      {children}
      <FeatureRelatedStrip items={tourServicesInBrief} currentSlug={slug} />
    </div>
  );
}
