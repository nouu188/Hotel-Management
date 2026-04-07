"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  travelGuideSections,
  hotelAddress,
  hotelMapEmbedUrl,
} from "@/constants/travelGuide";

export default function AboutUsPage() {
  return (
    <div className="w-full">
      <h1 className="playfair text-3xl py-6 text-center">SAIGON TRAVEL GUIDE</h1>

      <p className="font-light text-[14px] text-center max-w-2xl mx-auto mb-8 px-4">
        Ho Chi Minh City is a vibrant destination brimming with history, culture, and
        world-class cuisine. Use this guide to make the most of your stay just steps
        from our hotel.
      </p>

      <Accordion type="multiple" className="w-full max-w-4xl mx-auto px-4">
        {travelGuideSections.map((section) => (
          <AccordionItem key={section.id} value={section.id}>
            <AccordionTrigger className="hover:text-[#BF882E]">
              <span className="playfair text-[20px] text-[#081746]">
                {section.title}
              </span>
              <span className="text-[13px] font-light text-gray-500 ml-2 hidden md:inline">
                {section.description}
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 pb-4">
                {section.items.map((item) => (
                  <div key={item.name} className="border border-gray-200 p-3">
                    <p className="font-medium text-[14px]">{item.name}</p>
                    <p className="font-light text-[13px] text-gray-600 mt-1">
                      {item.detail}
                    </p>
                    {item.distance && (
                      <p className="font-light text-[12px] text-[#BF882E] mt-1">
                        📍 {item.distance}
                      </p>
                    )}
                    {item.tip && (
                      <p className="font-light text-[12px] text-gray-400 mt-1 italic">
                        Tip: {item.tip}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <section className="mt-12 mb-8 px-4 max-w-4xl mx-auto w-full">
        <h2 className="playfair text-[24px] text-[#081746] mb-4 text-center">
          Hotel Location
        </h2>
        <p className="font-light text-[14px] text-center mb-4">{hotelAddress}</p>
        <iframe
          src={hotelMapEmbedUrl}
          width="100%"
          height="400"
          className="border-0 w-full"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Hotel Location Map"
        />
      </section>
    </div>
  );
}
