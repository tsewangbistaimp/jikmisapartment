import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { DoorClosed, Users, ArrowRight } from "lucide-react";
import { formatCurrency, cn } from "@/lib/utils";
import { staggerItem } from "@/lib/motion";
import { maxGuestsFor } from "@/data/content";
import type { Room } from "@/lib/database.types";
import type { AvailabilityBadge } from "@/hooks/useRooms";
import { Button } from "@/components/ui/button";

const BADGE_CONFIG: Record<AvailabilityBadge, { label: string; dot: string; pill: string }> = {
  available: { label: "Available", dot: "bg-green-500", pill: "bg-green-50 text-green-700" },
  limited: { label: "Limited Availability", dot: "bg-amber-500", pill: "bg-amber-50 text-amber-700" },
  full: { label: "Fully Booked", dot: "bg-red-500", pill: "bg-red-50 text-red-700" },
};

export function RoomCard({ room, badge }: { room: Room; badge?: AvailabilityBadge }) {
  const unavailable = room.status === "maintenance";
  const maxGuests = maxGuestsFor(room.room_type);
  const badgeConfig = badge ? BADGE_CONFIG[badge] : null;

  return (
    <motion.div
      variants={staggerItem}
      className="group flex flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition-shadow hover:shadow-xl"
    >
      <div className="relative h-56 w-full overflow-hidden">
        {room.image_url ? (
          <img
            src={room.image_url}
            alt={`${room.room_type} — Room ${room.room_number}`}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-navy-50 to-navy-100 text-navy-300">
            <DoorClosed className="h-10 w-10" />
          </div>
        )}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/50 to-transparent" />
        <p className="absolute bottom-3 left-4 font-display text-lg font-semibold text-white drop-shadow">Room {room.room_number}</p>
        {unavailable ? (
          <span className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-600">
            Temporarily Unavailable
          </span>
        ) : (
          badgeConfig && (
            <span className={cn("absolute right-3 top-3 flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold", badgeConfig.pill)}>
              <span className={cn("h-1.5 w-1.5 rounded-full", badgeConfig.dot)} /> {badgeConfig.label}
            </span>
          )
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-gold-600">{room.room_type}</p>
        <p className="mt-2 flex items-center gap-1.5 text-sm text-slate-500">
          <Users className="h-4 w-4" />
          {maxGuests ? `Fits up to ${maxGuests} guest${maxGuests === 1 ? "" : "s"}` : "Ask us about guest capacity"}
        </p>

        <div className="mt-4 flex items-baseline gap-1">
          <span className="font-display text-2xl font-semibold text-navy-900">{formatCurrency(room.price)}</span>
          <span className="text-sm text-slate-400">/ night</span>
        </div>

        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <Link to={`/rooms/${room.id}`} className="flex-1">
            <Button variant="outline" className="w-full">
              View Details
            </Button>
          </Link>
          <Link to={`/booking?room=${room.id}`} className={cn("flex-1", unavailable && "pointer-events-none")}>
            <Button
              variant="primary"
              className={cn("w-full", unavailable && "pointer-events-none opacity-60")}
              disabled={unavailable}
            >
              Book Now <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
