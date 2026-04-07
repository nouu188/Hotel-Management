"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import FeatureCard from "@/components/FeatureCard";
import BookARoomButton from "@/components/BookARoomButton";
import { specialOffers, type SpecialOffer } from "@/constants/specialOffers";

export default function SpecialOffersPage() {
  const [selectedOffer, setSelectedOffer] = useState<SpecialOffer | null>(null);

  return (
    <div className="w-full">
      <h1 className="playfair text-3xl py-6 text-center">SPECIAL OFFERS</h1>

      {specialOffers.length === 0 ? (
        <div className="min-h-[200px] flex items-center justify-center">
          <p className="font-light text-[14px] text-gray-500">
            No special offers available at this time.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {specialOffers.map((offer) => (
            <div key={offer.id} className="flex justify-center text-center relative">
              {/* {offer.badge && (
                <span className="absolute z-10 bg-[#BF882E] text-white text-[11px] px-2 py-0.5 uppercase tracking-wide">
                  {offer.badge}
                </span>
              )}
               */}
              <FeatureCard
                name={offer.name}
                imgUrl={offer.imgUrl}
                altText={offer.altText}
                tagline={offer.tagline}
                description={offer.description}
                href="#"
                ctaLabel="View Offer"
                onCtaClick={() => setSelectedOffer(offer)}
              />
            </div>
          ))}
        </div>
      )}

      <Dialog
        open={selectedOffer !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedOffer(null);
        }}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="playfair text-[24px]">
              {selectedOffer?.name}
            </DialogTitle>
            <p className="text-[13px] text-gray-500">{selectedOffer?.tagline}</p>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-base mb-2">What&apos;s included</h4>
              <ul className="space-y-1 list-disc list-inside font-light text-[14px]">
                {selectedOffer?.includes.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-base mb-2">Terms &amp; Conditions</h4>
              <ul className="space-y-1 list-disc list-inside font-light text-[13px] text-gray-500">
                {selectedOffer?.terms.map((term) => (
                  <li key={term}>{term}</li>
                ))}
              </ul>
            </div>

            <div className="flex justify-center pt-2">
              <BookARoomButton />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
