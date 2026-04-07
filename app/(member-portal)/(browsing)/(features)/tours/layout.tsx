import FeatureSectionLayout from "@/components/FeatureSectionLayout";
import React from "react";

export default function ToursLayout({ children }: { children: React.ReactNode }) {
  return (
    <FeatureSectionLayout heroSrc="/images/7.jpg" heroAlt="Tours & Services">
      {children}
    </FeatureSectionLayout>
  );
}
