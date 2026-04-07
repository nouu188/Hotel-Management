"use client";

import BookARoomButton from "@/components/BookARoomButton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { inRoomDiningDetail } from "@/constants/wineDine";

export default function InRoomDiningPage() {
  const detail = inRoomDiningDetail;
  const defaultValues = detail.menuCategories.map((c) => c.name);

  return (
    <div className="flex-col justify-center lg:min-w-[1017px] w-full">
      <section className="flex flex-grow items-center mb-6">
        <div className="flex-1" />
        <h1 className="playfair flex-shrink-0 text-[#081746] text-[34px]">
          In-Room Dining
        </h1>
        <div className="flex-1 flex justify-end">
          <BookARoomButton />
        </div>
      </section>

      <section className="py-8 border-b-1">
        <h1 className="playfair text-[34px] text-[#081746] text-center pb-4">
          In-Room Dining
        </h1>
        <p className="font-light text-[14px] text-center max-w-2xl mx-auto">
          {detail.description}
        </p>
      </section>

      <section className="mt-8 mb-4">
        <h2 className="playfair text-[24px] text-[#081746] mb-4 text-center">
          Our Menu
        </h2>
        <Accordion type="multiple" defaultValue={defaultValues} className="w-full">
          {detail.menuCategories.map((category) => (
            <AccordionItem key={category.name} value={category.name}>
              <AccordionTrigger className="playfair text-[20px] text-[#081746] hover:text-[#BF882E]">
                {category.name}
              </AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-1 list-disc list-inside font-light text-[14px] py-2">
                  {category.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <p className="font-light text-[13px] text-center italic text-gray-500 mt-4 mb-8">
        {detail.orderNote}
      </p>
    </div>
  );
}
