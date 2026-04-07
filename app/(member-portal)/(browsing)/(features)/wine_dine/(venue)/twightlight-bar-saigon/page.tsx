"use client";

import BookARoomButton from "@/components/BookARoomButton";
import ImagesCarousel from "@/components/ImageCarousel";
import { twilightBarDetail } from "@/constants/wineDine";

export default function TwilightBarSaigonPage() {
  const detail = twilightBarDetail;

  return (
    <div className="flex-col justify-center lg:min-w-[1017px] w-full">
      <section className="flex flex-grow items-center mb-6">
        <div className="flex-1" />
        <h1 className="playfair flex-shrink-0 text-[#081746] text-[34px]">
          Twilight Bar Saigon
        </h1>
        <div className="flex-1 flex justify-end">
          <BookARoomButton />
        </div>
      </section>

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

      <section className="py-8 border-b-1">
        <h1 className="playfair text-[34px] text-[#081746] text-center pb-4">
          Features
        </h1>
        <p className="font-light text-[14px]">{detail.description}</p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mt-5 mb-8">
        <div className="font-light text-[14px]">
          <h2 className="font-medium text-base mb-2">Highlights</h2>
          <ul className="space-y-1 list-disc list-inside">
            {detail.highlights.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        </div>

        <div className="font-light text-[14px]">
          <h2 className="font-medium text-base mb-2">Menu Highlights</h2>
          <ul className="space-y-1 list-disc list-inside">
            {detail.menuHighlights.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        </div>

        <div className="font-light text-[14px]">
          <h2 className="font-medium text-base mb-2">Atmosphere</h2>
          <ul className="space-y-1 list-disc list-inside">
            {detail.atmosphere.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
