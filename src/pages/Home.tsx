import { useSEO } from "@/hooks/useSEO";
import { Hero } from "@/components/home/Hero";
import { FeaturedRooms } from "@/components/home/FeaturedRooms";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { AmenitiesPreview } from "@/components/home/AmenitiesPreview";
import { Testimonials } from "@/components/home/Testimonials";
import { LocationSection } from "@/components/home/LocationSection";
import { CTASection } from "@/components/home/CTASection";

export default function Home() {
  useSEO("Premium Serviced Apartments", "Book your stay at Jikmis Apartment directly for the best rate, instant confirmation, and a prime city location.");
  return (
    <div>
      <Hero />
      <FeaturedRooms />
      <WhyChooseUs />
      <AmenitiesPreview />
      <Testimonials />
      <LocationSection />
      <CTASection />
    </div>
  );
}
