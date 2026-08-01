import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { DoorClosed, Users, CheckCircle2 } from "lucide-react";
import { useRoom, useRooms } from "@/hooks/useRooms";
import { useSEO } from "@/hooks/useSEO";
import { formatCurrency, cn } from "@/lib/utils";
import { fadeUp } from "@/lib/motion";
import { AMENITIES } from "@/data/content";
import { staggerContainer } from "@/lib/motion";
import { Container, Section } from "@/components/ui/layout-primitives";
import { PageSpinner, EmptyState } from "@/components/ui/misc";
import { RoomCard } from "@/components/rooms/RoomCard";
import { BookingForm } from "@/components/booking/BookingForm";
import { Button } from "@/components/ui/button";

// The `rooms` table has no free-text description column — this generates a
// tasteful, honest generic description from the room_type instead of
// inventing per-room copy that doesn't exist in the database.
function describeRoom(roomType: string) {
  return `Our ${roomType} apartment blends comfort and practicality — a private, fully-equipped space with everything you need for a short stay or an extended one. Freshly cleaned and ready before every check-in.`;
}

export default function RoomDetails() {
  const { id } = useParams<{ id: string }>();
  const { room, loading } = useRoom(id);
  const { rooms } = useRooms();
  useSEO(room ? `Room ${room.room_number} — ${room.room_type}` : "Room Details", room ? describeRoom(room.room_type) : undefined);

  if (loading) return <PageSpinner />;
  if (!room) {
    return (
      <Container className="py-24">
        <EmptyState title="Room not found" description="This room may no longer be listed." />
        <div className="mt-6 text-center">
          <Link to="/rooms">
            <Button variant="outline">Back to Rooms</Button>
          </Link>
        </div>
      </Container>
    );
  }

  const related = rooms.filter((r) => r.id !== room.id).slice(0, 3);

  return (
    <div>
      <div className="relative h-[45vh] min-h-80 w-full overflow-hidden bg-navy-900">
        {room.image_url ? (
          <img src={room.image_url} alt={`${room.room_type} — Room ${room.room_number}`} className="h-full w-full object-cover opacity-90" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-navy-600">
            <DoorClosed className="h-16 w-16" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-navy-950/20 to-transparent" />
        <Container className="absolute inset-x-0 bottom-8 text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-400">{room.room_type}</p>
          <h1 className="mt-2 font-display text-3xl font-semibold sm:text-5xl">Room {room.room_number}</h1>
        </Container>
      </div>

      <Section className="py-12 sm:py-16">
        <Container className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          <motion.div variants={fadeUp} initial="initial" animate="animate" className="lg:col-span-2">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-6">
              <div>
                <p className="flex items-center gap-1.5 text-sm text-slate-500">
                  <Users className="h-4 w-4" /> Comfortably fits up to 3 guests
                </p>
              </div>
              <div className="text-right">
                <p className="font-display text-3xl font-semibold text-navy-900">{formatCurrency(room.price)}</p>
                <p className="text-xs text-slate-400">per night</p>
              </div>
            </div>

            <p className="mt-6 text-base leading-relaxed text-slate-600">{describeRoom(room.room_type)}</p>

            <p className="mt-10 text-sm font-semibold uppercase tracking-wide text-navy-800">What's Included</p>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {AMENITIES.slice(0, 9).map((a) => (
                <div key={a.label} className="flex items-center gap-2 text-sm text-slate-600">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-gold-500" /> {a.label}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={fadeUp} initial="initial" animate="animate" className="lg:col-span-1">
            <div className={cn("sticky top-28 rounded-3xl border border-slate-100 p-6 shadow-lg", room.status === "maintenance" && "opacity-60")}>
              <p className="mb-4 font-display text-lg font-semibold text-navy-900">Reserve This Room</p>
              {room.status === "maintenance" ? (
                <EmptyState title="Currently unavailable" description="This room is temporarily out of service. Please choose another room." />
              ) : (
                <BookingForm initialRoomId={room.id} />
              )}
            </div>
          </motion.div>
        </Container>
      </Section>

      {related.length > 0 && (
        <Section className="bg-slate-50 py-16">
          <Container>
            <p className="mb-8 font-display text-2xl font-semibold text-navy-900">You May Also Like</p>
            <motion.div
              variants={staggerContainer(80)}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
            >
              {related.map((r) => (
                <RoomCard key={r.id} room={r} />
              ))}
            </motion.div>
          </Container>
        </Section>
      )}
    </div>
  );
}
