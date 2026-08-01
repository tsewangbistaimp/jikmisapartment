import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useRooms } from "@/hooks/useRooms";
import { staggerContainer } from "@/lib/motion";
import { Container, Section, SectionHeading } from "@/components/ui/layout-primitives";
import { RoomCard } from "@/components/rooms/RoomCard";
import { RoomCardSkeleton } from "@/components/ui/misc";
import { Button } from "@/components/ui/button";

export function FeaturedRooms() {
  const { rooms, loading } = useRooms();
  const featured = rooms.slice(0, 3);

  return (
    <Section>
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow="Featured Rooms" title="Live Rates, Real Availability" description="Pulled directly from our reservations system — what you see is what's actually free." />
          <Link to="/rooms" className="hidden sm:block">
            <Button variant="outline">
              View All Rooms <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <RoomCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <motion.div
            variants={staggerContainer(100)}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-80px" }}
            className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
          >
            {featured.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </motion.div>
        )}

        <div className="mt-8 text-center sm:hidden">
          <Link to="/rooms">
            <Button variant="outline" className="w-full">
              View All Rooms <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </Container>
    </Section>
  );
}
