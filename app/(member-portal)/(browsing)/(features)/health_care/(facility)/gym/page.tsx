"use client";

import BookARoomButton from "@/components/BookARoomButton";
import ImagesCarousel from "@/components/ImageCarousel";
import { gymDetail } from "@/constants/spaWellness";

export default function GymPage() {
  const detail = gymDetail;

  return (
    <div className="flex-col justify-center lg:min-w-[1017px] w-full">
      {/* Header */}
      <section className="flex flex-grow items-center mb-6">
        <div className="flex-1" />
        <h1 className="playfair flex-shrink-0 text-[#081746] text-[34px]">
          Fitness Center
        </h1>
        <div className="flex-1 flex justify-end">
          <BookARoomButton />
        </div>
      </section>

      {/* Carousel + info panel */}
      <section className="relative">
        <div className="absolute max-w-[272px] h-[368px] translate-y-15 bg-gray-100 z-10 text-black font-light text-[14px] p-4">
          <h2 className="font-normal mb-3">{detail.tagline}</h2>
          <p className="mb-3">{detail.description}</p>
          <div className="space-y-1">
            <p>{detail.infoPanel.line1}</p>
            <p>{detail.infoPanel.line2}</p>
            <p>{detail.infoPanel.line3}</p>
            {detail.infoPanel.line4 && <p>{detail.infoPanel.line4}</p>}
          </div>
        </div>
        <ImagesCarousel
          imgUrl={detail.imgUrl}
          altText={detail.altText}
          height="h-120"
          width="max-w-205"
        />
      </section>

      {/* Features */}
      <section className="py-8 border-b-1">
        <h1 className="playfair text-[34px] text-[#081746] text-center pb-4">
          Features
        </h1>
      </section>
      <section className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mt-5">
        <div className="font-light text-[14px]">
          <h2 className="font-medium text-base mb-2">Equipment & Highlights</h2>
          <ul className="space-y-1 list-disc list-inside">
            {detail.highlights.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        </div>
        <div className="font-light text-[14px]">
          <h2 className="font-medium text-base mb-2">Amenities</h2>
          <ul className="space-y-1 list-disc list-inside">
            {detail.amenities.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* Policies */}
      {detail.policies && (
        <section className="mt-8 mb-8">
          <h2 className="playfair text-[24px] text-[#081746] mb-4">
            Fitness Center Policies
          </h2>
          <ul className="space-y-1 list-disc list-inside font-light text-[14px]">
            {detail.policies.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
