import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { DoorClosed, Users, ArrowRight } from "lucide-react";
import { formatCurrency, cn } from "@/lib/utils";
import { staggerItem } from "@/lib/motion";
import type { Room } from "@/lib/database.types";
import { Button } from "@/components/ui/button";

export function RoomCard({ room }: { room: Room }) {
  const unavailable = room.status === "maintenance";

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
        {unavailable && (
          <span className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-600">
            Temporarily Unavailable
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-gold-600">{room.room_type}</p>
        <p className="mt-2 flex items-center gap-1.5 text-sm text-slate-500">
          <Users className="h-4 w-4" /> Comfortably fits up to 3 guests
        </p>

        <div className="mt-4 flex items-baseline gap-1">
          <span className="font-display text-2xl font-semibold text-navy-900">{formatCurrency(room.price)}</span>
          <span className="text-sm text-slate-400">/ night</span>
        </div>

        <Link to={`/rooms/${room.id}`} className="mt-5">
          <Button
            variant={unavailable ? "outline" : "primary"}
            className={cn("w-full", unavailable && "pointer-events-none opacity-60")}
            disabled={unavailable}
          >
            View Details <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}
