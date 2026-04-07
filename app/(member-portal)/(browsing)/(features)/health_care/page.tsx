import FeatureCard from "@/components/FeatureCard";
import { facilitiesInBrief } from "@/constants/spaWellness";

export default function SpaWellnessPage() {
  return (
    <div>
      <h1 className="playfair text-3xl py-6 text-center">SPA & WELLNESS</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {facilitiesInBrief.map((facility) => (
          <FeatureCard key={facility.slug} {...facility} />
        ))}
      </div>
    </div>
  );
}
