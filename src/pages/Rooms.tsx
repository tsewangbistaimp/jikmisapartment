import { motion } from "framer-motion";
import { useRooms, useRoomsAvailabilityBadges } from "@/hooks/useRooms";
import { useSEO } from "@/hooks/useSEO";
import { Container, Section } from "@/components/ui/layout-primitives";
import { RoomCard } from "@/components/rooms/RoomCard";
import { RoomCardSkeleton, EmptyState } from "@/components/ui/misc";
import { staggerContainer } from "@/lib/motion";

export default function Rooms() {
  useSEO("Rooms & Rates", "Browse our fully-equipped serviced apartments with live pricing and availability.");
  const { rooms, loading, error } = useRooms();
  const badges = useRoomsAvailabilityBadges();

  return (
    <div>
      <div className="bg-navy-900 pb-16 pt-32 text-center text-white sm:pt-40">
        <Container>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-400">Our Rooms</p>
          <h1 className="mt-3 font-display text-4xl font-semibold sm:text-5xl">Find Your Perfect Stay</h1>
          <p className="mx-auto mt-4 max-w-xl text-navy-200">
            Every apartment is fully equipped, freshly cleaned, and ready for you — book directly for the best available rate.
          </p>
        </Container>
      </div>

      <Section>
        <Container>
          {error && <EmptyState title="Couldn't load rooms" description={error} />}
          {loading ? (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <RoomCardSkeleton key={i} />
              ))}
            </div>
          ) : rooms.length === 0 ? (
            <EmptyState title="No rooms available right now" description="Please check back soon or contact us directly." />
          ) : (
            <motion.div
              variants={staggerContainer(80)}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-60px" }}
              className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
            >
              {rooms.map((room) => (
                <RoomCard key={room.id} room={room} badge={badges[room.id]} />
              ))}
            </motion.div>
          )}
        </Container>
      </Section>
    </div>
  );
}
