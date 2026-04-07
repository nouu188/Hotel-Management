import FeatureCard from "@/components/FeatureCard";
import { venuesInBrief } from "@/constants/wineDine";

export default function WineDinePage() {
  return (
    <div>
      <h1 className="playfair text-3xl py-6 text-center">WINE & DINE</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {venuesInBrief.map((venue) => (
          <FeatureCard key={venue.slug} {...venue} />
        ))}
      </div>
    </div>
  );
}
