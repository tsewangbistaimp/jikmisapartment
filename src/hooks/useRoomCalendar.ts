import * as React from "react";
import { supabase } from "@/lib/supabase";

export interface CalendarRange {
  start: string;
  end: string;
  status: "confirmed" | "pending";
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
 *  Live-updates via Supabase Realtime: subscribes to `bookings` filtered to
 *  this room, so the moment reception approves, rejects, creates, cancels,
 *  or reschedules a booking for this room, the calendar recolors itself with
 *  no page refresh. Confirmed/checked-in bookings and still-pending guest
 *  requests are both returned (with their own `status`) since both make a
 *  date unavailable to a new guest — only the color shown differs. */
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
      const { data } = await supabase
        .from("bookings")
        .select("check_in, check_out, booking_status")
        .eq("room_id", roomId)
        .in("booking_status", ["confirmed", "checked_in", "pending_approval"])
        .lt("check_in", toISO(end))
        .gt("check_out", toISO(start));

      const mapped: CalendarRange[] = (data ?? []).map((b) => ({
        start: b.check_in,
        end: b.check_out,
        status: b.booking_status === "pending_approval" ? "pending" : "confirmed",
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
        // rejected/created/cancelled/rescheduled it, or a new guest request
        // came in) — the cached months for this room may now be stale.
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
