import FeatureSectionLayout from "@/components/FeatureSectionLayout";
import React from "react";

export default function LoyalGuestLayout({ children }: { children: React.ReactNode }) {
  return (
    <FeatureSectionLayout heroSrc="/images/1.jpg" heroAlt="Loyal Guest Program">
      {children}
    </FeatureSectionLayout>
  );
}
