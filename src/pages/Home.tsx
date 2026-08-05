import { useSEO } from "@/hooks/useSEO";
import { Hero } from "@/components/home/Hero";
import { StoryIntro } from "@/components/home/StoryIntro";
import { VideoTour } from "@/components/home/VideoTour";
import { PropertyShowcase } from "@/components/home/PropertyShowcase";
import { FeaturedRooms } from "@/components/home/FeaturedRooms";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { AmenitiesPreview } from "@/components/home/AmenitiesPreview";
import { NearbyAttractionsPreview } from "@/components/home/NearbyAttractionsPreview";
import { Testimonials } from "@/components/home/Testimonials";
import { LocationSection } from "@/components/home/LocationSection";
import { CTASection } from "@/components/home/CTASection";

export default function Home() {
  useSEO("Apartment in Boudha, Kathmandu", "Jikmis Apartment is a serviced apartment in Boudha, Kathmandu, steps from Boudhanath Stupa. Book your stay directly for the best rate and instant confirmation.");
  return (
    <div>
      <Hero />
      <StoryIntro />
      <VideoTour />
      <PropertyShowcase />
      <FeaturedRooms />
      <WhyChooseUs />
      <AmenitiesPreview />
      <NearbyAttractionsPreview />
      <Testimonials />
      <LocationSection />
      <CTASection />
    </div>
  );
}
