"use client";

import FeatureRelatedStrip from "@/components/FeatureRelatedStrip";
import { venuesInBrief } from "@/constants/wineDine";
import { usePathname } from "next/navigation";
import React from "react";

export default function VenueLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const slug = pathname.split("/").at(-1) ?? "";

  return (
    <div className="w-full">
      {children}
      <FeatureRelatedStrip items={venuesInBrief} currentSlug={slug} />
    </div>
  );
}
