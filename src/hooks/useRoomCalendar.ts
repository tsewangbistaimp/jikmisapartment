import * as React from "react";
import { supabase } from "@/lib/supabase";

export interface CalendarRange {
  start: string;
  end: string;
}

function toISO(date: Date) {
  return date.toISOString().slice(0, 10);
}

// Module-level cache (not React state) so navigating back to a month already
// visited in this session renders instantly instead of re-querying — cleared
// per-room whenever a realtime change for that room comes in.
const monthCache = new Map<string, CalendarRange[]>();

function cacheKey(roomId: string, viewMonth: Date) {
  return `${roomId}|${viewMonth.getFullYear()}-${viewMonth.getMonth()}`;
}

/** Hotel-style calendar data for ONE room, ONE displayed month at a time —
 *  deliberately not "all future bookings for this room", so switching months
 *  only ever fetches the month being looked at (lazy loading) and revisiting
 *  a month already seen this session is instant (cached).
 *
 *  Reads through get_room_booked_ranges() (a SECURITY DEFINER RPC), not a
 *  direct `.from("bookings")` query — public.bookings has never had an anon
 *  SELECT policy (by design: it holds guest names, phones, totals, notes),
 *  so a direct query from this logged-out site always silently came back
 *  empty and the calendar showed every date as available regardless of
 *  real bookings. The RPC exposes only the two date columns, and only for
 *  rooms/dates that are actually reserved.
 *
 *  Only a CONFIRMED (or checked-in) booking blocks a date. A still-pending
 *  guest request never blocks another guest from requesting the same
 *  dates — staff decide which request (if any) to approve — so pending
 *  bookings are intentionally not represented on this calendar at all.
 *
 *  Live-updates via Supabase Realtime: subscribes to `bookings` filtered to
 *  this room, so the moment reception approves, rejects, cancels, or
 *  reschedules a booking for this room, the calendar recolors itself with
 *  no page refresh. */
export function useRoomCalendarMonth(roomId: string | undefined, viewMonth: Date) {
  const [ranges, setRanges] = React.useState<CalendarRange[]>([]);
  const [loading, setLoading] = React.useState(false);

  const year = viewMonth.getFullYear();
  const month = viewMonth.getMonth();

  const load = React.useCallback(
    async (skipCache = false) => {
      if (!roomId) {
        setRanges([]);
        return;
      }
      const start = new Date(year, month, 1);
      const end = new Date(year, month + 1, 1);
      const key = cacheKey(roomId, start);

      if (!skipCache && monthCache.has(key)) {
        setRanges(monthCache.get(key)!);
        return;
      }

      setLoading(true);
      const { data } = await supabase.rpc("get_room_booked_ranges", {
        p_room_id: roomId,
        p_from: toISO(start),
        p_to: toISO(end),
      });

      const mapped: CalendarRange[] = ((data as { check_in: string; check_out: string }[]) ?? []).map((b) => ({
        start: b.check_in,
        end: b.check_out,
      }));
      monthCache.set(key, mapped);
      setRanges(mapped);
      setLoading(false);
    },
    [roomId, year, month]
  );

  React.useEffect(() => {
    load();
  }, [load]);

  React.useEffect(() => {
    if (!roomId) return;
    const channel = supabase
      .channel(`room-calendar-${roomId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "bookings", filter: `room_id=eq.${roomId}` }, () => {
        // A booking for this room changed somewhere (admin approved/
        // rejected/created/cancelled/rescheduled it) — the cached months
        // for this room may now be stale.
        for (const k of Array.from(monthCache.keys())) {
          if (k.startsWith(`${roomId}|`)) monthCache.delete(k);
        }
        load(true);
      })
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId, load]);

  return { ranges, loading };
}
