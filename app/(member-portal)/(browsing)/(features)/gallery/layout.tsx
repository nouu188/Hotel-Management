import FeatureSectionLayout from "@/components/FeatureSectionLayout";
import React from "react";

export default function GalleryLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <FeatureSectionLayout heroSrc="/images/14.jpg" heroAlt="Hotel Gallery">
      {children}
    </FeatureSectionLayout>
  );
}
