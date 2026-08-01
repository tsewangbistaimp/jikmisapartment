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
 *  page open, the list updates on its own — no refresh needed. */
export function useRooms() {
  const [rooms, setRooms] = React.useState<Room[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

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
      .channel("public-rooms-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "rooms" }, () => load())
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [load]);

  return { rooms, loading, error };
}

export function useRoom(roomId: string | undefined) {
  const [room, setRoom] = React.useState<Room | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

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
    const channel = supabase
      .channel(`public-room-${roomId}-live`)
      .on("postgres_changes", { event: "*", schema: "public", table: "rooms", filter: `id=eq.${roomId}` }, () => load())
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId, load]);

  return { room, loading, error };
}

export type BookingBlockStatus = "confirmed" | "pending";
export type BookedRange = { start: string; end: string; status: BookingBlockStatus };

/** Final, targeted availability check for the exact [checkIn, checkOut)
 *  range the guest has picked — run right before enabling the submit
 *  button, independent of whatever the calendar grid is currently showing.
 *  Treats BOTH a confirmed/checked-in booking AND another guest's still-
 *  pending request as blocking, matching the rule enforced server-side in
 *  create_public_booking(): once a date is requested, nobody else can
 *  request it until staff approve or reject that request. This can never be
 *  trusted as the sole guard against double-booking — the database is. */
export function useDateRangeAvailability(roomId: string | undefined, checkIn: string, checkOut: string) {
  // blockedBy: null once a check has completed and found nothing blocking;
  // undefined before any dates are picked / mid-check (i.e. "unknown yet").
  const [blockedBy, setBlockedBy] = React.useState<BookingBlockStatus | null | undefined>(undefined);
  const [checking, setChecking] = React.useState(false);

  React.useEffect(() => {
    if (!roomId || !checkIn || !checkOut || new Date(checkOut) <= new Date(checkIn)) {
      setBlockedBy(undefined);
      return;
    }
    let cancelled = false;
    setChecking(true);
    setBlockedBy(undefined);
    supabase
      .from("bookings")
      .select("booking_status")
      .eq("room_id", roomId)
      .in("booking_status", ["confirmed", "checked_in", "pending_approval"])
      .lt("check_in", checkOut)
      .gt("check_out", checkIn)
      .then(({ data }) => {
        if (cancelled) return;
        const rows = data ?? [];
        if (rows.some((r) => r.booking_status === "confirmed" || r.booking_status === "checked_in")) {
          setBlockedBy("confirmed");
        } else if (rows.some((r) => r.booking_status === "pending_approval")) {
          setBlockedBy("pending");
        } else {
          setBlockedBy(null);
        }
        setChecking(false);
      });
    return () => {
      cancelled = true;
    };
  }, [roomId, checkIn, checkOut]);

  const available = blockedBy === undefined ? null : blockedBy === null;

  return { available, blockedBy, checking };
}
