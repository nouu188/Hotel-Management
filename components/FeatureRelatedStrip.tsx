"use client";

import { useMemo } from "react";
import FeatureCard, { type FeatureCardProps } from "@/components/FeatureCard";

interface FeatureRelatedStripProps {
  items: FeatureCardProps[];
  currentSlug: string;
  sectionTitle?: string;
}

const FeatureRelatedStrip = ({
  items,
  currentSlug,
  sectionTitle = "You may also be interested",
}: FeatureRelatedStripProps) => {
  const two = useMemo(() => {
    const pool = items.filter(
      (item) => item.href.split("/").at(-1) !== currentSlug
    );
    if (pool.length < 2) return pool;
    const i1 = Math.floor(Math.random() * pool.length);
    let i2 = Math.floor(Math.random() * pool.length);
    while (i2 === i1) {
      i2 = Math.floor(Math.random() * pool.length);
    }
    return [pool[i1], pool[i2]];
  }, [items, currentSlug]);

  if (two.length === 0) return null;

  return (
    <section>
      <h1 className="playfair text-[34px] text-[#081746] text-center pb-4">
        {sectionTitle}
      </h1>
      <div className="flex gap-3 text-[13px] mb-8">
        {two.map((item) => (
          <FeatureCard key={item.href} {...item} />
        ))}
      </div>
    </section>
  );
};

export default FeatureRelatedStrip;
