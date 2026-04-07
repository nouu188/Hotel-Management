"use client";

import FeatureRelatedStrip from "@/components/FeatureRelatedStrip";
import { facilitiesInBrief } from "@/constants/spaWellness";
import { usePathname } from "next/navigation";

export default function FacilityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const slug = pathname.split("/").at(-1) ?? "";

  return (
    <div className="w-full">
      {children}
      <FeatureRelatedStrip items={facilitiesInBrief} currentSlug={slug} />
    </div>
  );
}
