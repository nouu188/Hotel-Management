import FeatureCard from "@/components/FeatureCard";
import { tourServicesInBrief } from "@/constants/tours";

export default function ToursPage() {
  return (
    <div>
      <h1 className="playfair text-3xl py-6 text-center">TOURS & SERVICES</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {tourServicesInBrief.map((service) => (
          <FeatureCard key={service.slug} {...service} />
        ))}
      </div>
    </div>
  );
}
