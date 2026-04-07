"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CloudinaryImage from "@/components/CloudinaryImage";
import { galleryImages, type GalleryCategory } from "@/constants/gallery";

const TABS: { value: GalleryCategory; label: string }[] = [
  { value: "all", label: "All" },
  { value: "rooms", label: "Rooms" },
  { value: "dining", label: "Dining" },
  { value: "spa", label: "Spa" },
  { value: "pool", label: "Pool" },
  { value: "exterior", label: "Exterior" },
  { value: "events", label: "Events" },
];

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState<GalleryCategory>("all");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filtered =
    activeCategory === "all"
      ? galleryImages
      : galleryImages.filter((img) => img.category === activeCategory);

  const currentImage = lightboxIndex !== null ? filtered[lightboxIndex] : null;

  return (
    <div className="w-full">
      <h1 className="playfair text-3xl py-6 text-center">GALLERY</h1>

      <Tabs
        value={activeCategory}
        onValueChange={(v) => setActiveCategory(v as GalleryCategory)}
        className="w-full"
      >
        <TabsList className="flex justify-center flex-wrap h-auto gap-1 mb-6 bg-transparent">
          {TABS.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="data-[state=active]:border-b-2 data-[state=active]:border-[#BF882E] rounded-none"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {filtered.length === 0 ? (
        <div className="min-h-[200px] flex items-center justify-center">
          <p className="font-light text-[14px] text-gray-500">
            No images in this category yet.
          </p>
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 w-full px-4 md:px-8">
          {filtered.map((img, idx) => (
            <div
              key={idx}
              className="break-inside-avoid mb-4 cursor-pointer"
              onClick={() => setLightboxIndex(idx)}
            >
              <CloudinaryImage
                localSrc={img.src}
                alt={img.altText}
                width={600}
                height={400}
                className="w-full h-auto"
              />
              {img.caption && (
                <p className="text-[12px] font-light text-gray-500 mt-1 px-1">
                  {img.caption}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      <Dialog
        open={lightboxIndex !== null}
        onOpenChange={(open) => {
          if (!open) setLightboxIndex(null);
        }}
      >
        <DialogContent className="max-w-4xl w-full bg-black border-none p-4">
          {currentImage && (
            <div className="flex flex-col items-center">
              <div className="relative w-full h-[70vh]">
                <CloudinaryImage
                  localSrc={currentImage.src}
                  alt={currentImage.altText}
                  fill
                  className="object-contain"
                />

                <button
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full transition-colors"
                  onClick={() =>
                    setLightboxIndex(
                      (lightboxIndex! - 1 + filtered.length) % filtered.length
                    )
                  }
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                <button
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full transition-colors"
                  onClick={() =>
                    setLightboxIndex((lightboxIndex! + 1) % filtered.length)
                  }
                  aria-label="Next image"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>

              {currentImage.caption && (
                <p className="text-[13px] font-light text-gray-300 mt-3 text-center">
                  {currentImage.caption}
                </p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
