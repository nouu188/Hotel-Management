import FeatureSectionLayout from "@/components/FeatureSectionLayout";
import React from "react";

export default function HealthCareLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <FeatureSectionLayout heroSrc="/images/5.jpg" heroAlt="Spa & Wellness">
      {children}
    </FeatureSectionLayout>
  );
}
