"use client";

import Breadcrumbs from "@/components/Breadcrumbs";
import CloudinaryImage from "@/components/CloudinaryImage";
import { CircleUserRound, Gem, MapPin } from "lucide-react";
import Link from "next/link";
import React from "react";

interface FeatureSectionLayoutProps {
  heroSrc: string;
  heroAlt: string;
  children: React.ReactNode;
}

export default function FeatureSectionLayout({
  heroSrc,
  heroAlt,
  children,
}: FeatureSectionLayoutProps) {
  return (
    <div lang="en">
      <section className="relative w-full h-[510px]">
        <CloudinaryImage
          localSrc={heroSrc}
          fill
          className="object-cover"
          alt={heroAlt}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/36 to-black/40" />
      </section>

      <section className="flex justify-center text-[18px] mt-4">
        <Breadcrumbs />
      </section>

      <section className="flex justify-center py-6">
        <div className="flex max-lg:flex-col max-lg:space-y-4 items-center justify-between lg:space-x-16">
          <div className="flex justify-between items-center gap-2 lg:gap-10 xl:gap-14 py-3 md:py-5 text-[15px] border-t-1 border-b-1">
            <div className="flex gap-3 max-md:max-w-[115px]">
              <MapPin />
              City center location
            </div>
            <div className="flex gap-3 max-md:max-w-[140px]">
              <Gem />
              New dimension of luxury
            </div>
            <div className="flex gap-3 max-md:max-w-[115px]">
              <CircleUserRound />
              Personalized Service
            </div>
          </div>

          <div className="flex flex-col justify-center text-center">
            <Link
              className="hover:text-[#BF882E] transition-colors duration-300 cursor-pointer"
              href="https://www.tripadvisor.com/Hotel_Review-g293925-d25442757-Reviews-La_Siesta_Premium_Saigon-Ho_Chi_Minh_City.html"
            >
              TripAdvisor Traveler Rating
            </Link>
            <CloudinaryImage
              localSrc="/images/tripAdvisor.png"
              width={310}
              height={310}
              alt="trip-advisor"
            />
            <p>Based on 1,934 traveler reviews</p>
            <p>Read review</p>
          </div>
        </div>
      </section>

      <section className="flex justify-center">{children}</section>
    </div>
  );
}
