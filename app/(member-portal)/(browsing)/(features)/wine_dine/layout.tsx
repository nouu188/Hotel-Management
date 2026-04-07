import FeatureSectionLayout from "@/components/FeatureSectionLayout";
import React from "react";

export default function WineDineLayout({ children }: { children: React.ReactNode }) {
  return (
    <FeatureSectionLayout heroSrc="/images/3.jpg" heroAlt="Wine & Dine">
      {children}
    </FeatureSectionLayout>
  );
}
