import FeatureSectionLayout from "@/components/FeatureSectionLayout";
import React from "react";

export default function AboutUsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <FeatureSectionLayout heroSrc="/images/14.jpg" heroAlt="Saigon Travel Guide">
      {children}
    </FeatureSectionLayout>
  );
}
