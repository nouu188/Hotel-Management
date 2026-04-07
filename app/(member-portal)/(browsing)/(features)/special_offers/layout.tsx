import FeatureSectionLayout from "@/components/FeatureSectionLayout";
import React from "react";

export default function SpecialOffersLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <FeatureSectionLayout heroSrc="/images/5.jpg" heroAlt="Special Offers">
      {children}
    </FeatureSectionLayout>
  );
}
