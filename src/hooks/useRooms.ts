import * as React from "react";
import { supabase } from "@/lib/supabase";
import type { Room } from "@/lib/database.types";

/** Loads every room the public "rooms_public_select" policy allows (see
 *  20260801070000_public_booking_website.sql) — i.e. the exact same `rooms`
 *  table the admin app uses, read-only. Rooms under maintenance are excluded
 *  from what guests can book, but shown as "temporarily unavailable" rather
 *  than hidden, so the room list doesn't look incomplete. */
export function useRooms() {
  const [rooms, setRooms] = React.useState<Room[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    setLoading(true);
    supabase
      .from("rooms")
      .select("*")
      .order("price", { ascending: true })
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) setError(error.message);
        setRooms((data as Room[]) ?? []);
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { rooms, loading, error };
}

export function useRoom(roomId: string | undefined) {
  const [room, setRoom] = React.useState<Room | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!roomId) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    supabase
      .from("rooms")
      .select("*")
      .eq("id", roomId)
      .single()
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) setError(error.message);
        setRoom((data as Room) ?? null);
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [roomId]);

  return { room, loading, error };
}

/** Checks whether a room has any confirmed/checked-in booking overlapping the
 *  given date range — the same "half-open range" overlap rule the database's
 *  own exclusion constraint enforces, checked here first purely for instant
 *  UI feedback. The database (via create_public_booking / the exclusion
 *  constraint) is still the real, final authority — this can never be
 *  trusted as the sole guard against double-booking. */
export function useRoomAvailability(roomId: string | undefined, checkIn: string, checkOut: string) {
  const [available, setAvailable] = React.useState<boolean | null>(null);
  const [checking, setChecking] = React.useState(false);

  React.useEffect(() => {
    if (!roomId || !checkIn || !checkOut || new Date(checkOut) <= new Date(checkIn)) {
      setAvailable(null);
      return;
    }
    let cancelled = false;
    setChecking(true);
    supabase
      .from("bookings")
      .select("check_in, check_out")
      .eq("room_id", roomId)
      .in("booking_status", ["confirmed", "checked_in"])
      .lt("check_in", checkOut)
      .gt("check_out", checkIn)
      .then(({ data }) => {
        if (cancelled) return;
        setAvailable((data?.length ?? 0) === 0);
        setChecking(false);
      });
    return () => {
      cancelled = true;
    };
  }, [roomId, checkIn, checkOut]);

  return { available, checking };
}
