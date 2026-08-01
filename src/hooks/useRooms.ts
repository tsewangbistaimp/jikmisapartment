import * as React from "react";
import { supabase } from "@/lib/supabase";
import type { Room } from "@/lib/database.types";

/** Loads every room the public "rooms_public_select" policy allows (see
 *  20260801070000_public_booking_website.sql) — i.e. the exact same `rooms`
 *  table the admin app uses, read-only. Rooms under maintenance are excluded
 *  from what guests can book, but shown as "temporarily unavailable" rather
 *  than hidden, so the room list doesn't look incomplete.
 *
 *  Subscribes to Supabase Realtime on `rooms` so that if reception marks a
 *  room under maintenance (or back to available) while a guest has this
 *  page open, the list updates on its own — no refresh needed.
 *
 *  Some pages mount more than one instance of this hook at once (e.g.
 *  RoomDetails.tsx calls it directly for "related rooms" AND renders
 *  <BookingForm>, which also calls it) — a shared hardcoded channel name
 *  meant the second instance tried to attach a postgres_changes listener to
 *  a channel the first had already subscribed, which supabase-js throws on,
 *  crashing the whole page to a blank screen. useId() gives every instance
 *  its own channel so they never collide. */
export function useRooms() {
  const [rooms, setRooms] = React.useState<Room[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const instanceId = React.useId();

  const load = React.useCallback(async () => {
    const { data, error } = await supabase.from("rooms").select("*").order("price", { ascending: true });
    if (error) setError(error.message);
    setRooms((data as Room[]) ?? []);
    setLoading(false);
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  React.useEffect(() => {
    const channel = supabase
      .channel(`public-rooms-live-${instanceId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "rooms" }, () => load())
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [load, instanceId]);

  return { rooms, loading, error };
}

export function useRoom(roomId: string | undefined) {
  const [room, setRoom] = React.useState<Room | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const instanceId = React.useId();

  const load = React.useCallback(async () => {
    if (!roomId) {
      setLoading(false);
      return;
    }
    const { data, error } = await supabase.from("rooms").select("*").eq("id", roomId).single();
    if (error) setError(error.message);
    setRoom((data as Room) ?? null);
    setLoading(false);
  }, [roomId]);

  React.useEffect(() => {
    load();
  }, [load]);

  React.useEffect(() => {
    if (!roomId) return;
    // instanceId keeps this collision-proof if the same room is ever
    // rendered by two mounted components at once (see useRooms() above for
    // the crash this pattern otherwise causes).
    const channel = supabase
      .channel(`public-room-${roomId}-${instanceId}-live`)
      .on("postgres_changes", { event: "*", schema: "public", table: "rooms", filter: `id=eq.${roomId}` }, () => load())
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId, load, instanceId]);

  return { room, loading, error };
}

export type AvailabilityBadge = "available" | "limited" | "full";

/** Live 🟢/🟡/🔴 availability badge per room for the room cards, computed
 *  from confirmed/checked-in bookings over the next 14 days via the
 *  get_rooms_availability_badges() RPC (SECURITY DEFINER — public.bookings
 *  itself has no anon SELECT policy, so this can't be a direct table
 *  query). Recomputes whenever any booking changes, since an approval,
 *  rejection, or cancellation anywhere can shift a room's badge. */
export function useRoomsAvailabilityBadges() {
  const [badges, setBadges] = React.useState<Record<string, AvailabilityBadge>>({});
  const instanceId = React.useId();

  const load = React.useCallback(async () => {
    const { data } = await supabase.rpc("get_rooms_availability_badges", { p_days: 14 });
    const map: Record<string, AvailabilityBadge> = {};
    for (const row of (data as { room_id: string; badge: AvailabilityBadge }[]) ?? []) {
      map[row.room_id] = row.badge;
    }
    setBadges(map);
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  React.useEffect(() => {
    const channel = supabase
      .channel(`rooms-availability-badges-live-${instanceId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "bookings" }, () => load())
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [load, instanceId]);

  return badges;
}

export type BookedRange = { start: string; end: string };

/** Final, targeted availability check for the exact [checkIn, checkOut)
 *  range the guest has picked — run right before enabling the submit
 *  button, independent of whatever the calendar grid is currently showing.
 *  Calls is_room_range_available() (a SECURITY DEFINER RPC) rather than
 *  querying `bookings` directly, since public.bookings has no anon SELECT
 *  policy at all — a direct query here would always silently return zero
 *  rows and this "final safety check" would always (wrongly) say available.
 *
 *  Only a CONFIRMED/checked-in booking blocks — a still-pending request
 *  from another guest never blocks a new request for the same dates; staff
 *  decide which (if any) to approve. This can never be trusted as the sole
 *  guard against double-booking on its own — the database's authoritative
 *  check inside create_public_booking() is. */
export function useDateRangeAvailability(roomId: string | undefined, checkIn: string, checkOut: string) {
  // null once a check has completed; undefined before any dates are picked
  // or while a check is in flight (i.e. "unknown yet").
  const [available, setAvailable] = React.useState<boolean | undefined>(undefined);
  const [checking, setChecking] = React.useState(false);

  React.useEffect(() => {
    if (!roomId || !checkIn || !checkOut || new Date(checkOut) <= new Date(checkIn)) {
      setAvailable(undefined);
      return;
    }
    let cancelled = false;
    setChecking(true);
    setAvailable(undefined);
    supabase
      .rpc("is_room_range_available", { p_room_id: roomId, p_check_in: checkIn, p_check_out: checkOut })
      .then(({ data }) => {
        if (cancelled) return;
        setAvailable(data === true);
        setChecking(false);
      });
    return () => {
      cancelled = true;
    };
  }, [roomId, checkIn, checkOut]);

  return { available: available === undefined ? null : available, checking };
}
