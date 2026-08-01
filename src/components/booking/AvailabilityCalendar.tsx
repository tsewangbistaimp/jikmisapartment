import * as React from "react";
import { ChevronLeft, ChevronRight, Loader2, Ban } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRoomCalendarMonth, type CalendarRange } from "@/hooks/useRoomCalendar";

const WEEKDAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function toISO(date: Date) {
  return date.toISOString().slice(0, 10);
}

function fromISO(iso: string) {
  return new Date(`${iso}T00:00:00`);
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function isSameMonth(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

function isBooked(dateISO: string, ranges: CalendarRange[]) {
  return ranges.some((r) => dateISO >= r.start && dateISO < r.end);
}

/** True if a candidate [checkIn, checkOut) stay overlaps any confirmed
 *  booking. Only confirmed/checked-in bookings ever appear in `ranges` (see
 *  useRoomCalendarMonth) — a still-pending request from another guest never
 *  blocks a new request for the same dates. */
function rangeConflicts(checkIn: string, checkOut: string, ranges: CalendarRange[]) {
  return ranges.some((r) => checkIn < r.end && checkOut > r.start);
}

function buildMonthGrid(viewMonth: Date) {
  const first = startOfMonth(viewMonth);
  const startWeekday = first.getDay();
  const daysInMonth = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 0).getDate();

  const cells: (Date | null)[] = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(viewMonth.getFullYear(), viewMonth.getMonth(), d));
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

interface AvailabilityCalendarProps {
  roomId: string;
  roomStatus?: string;
  checkIn: string;
  checkOut: string;
  disabled?: boolean;
  onChange: (checkIn: string, checkOut: string) => void;
}

export function AvailabilityCalendar({ roomId, roomStatus, checkIn, checkOut, disabled, onChange }: AvailabilityCalendarProps) {
  const today = React.useMemo(() => toISO(new Date()), []);
  const currentMonthStart = React.useMemo(() => startOfMonth(new Date()), []);
  const [viewMonth, setViewMonth] = React.useState(() => startOfMonth(checkIn ? fromISO(checkIn) : new Date()));
  const [warning, setWarning] = React.useState<string | null>(null);

  const { ranges, loading } = useRoomCalendarMonth(roomId, viewMonth);
  const grid = React.useMemo(() => buildMonthGrid(viewMonth), [viewMonth]);
  const canGoPrev = !isSameMonth(viewMonth, currentMonthStart);
  const roomUnderMaintenance = roomStatus === "maintenance";

  function handleDayClick(dateISO: string) {
    if (disabled || roomUnderMaintenance) return;
    setWarning(null);

    if (!checkIn || (checkIn && checkOut)) {
      onChange(dateISO, "");
      return;
    }

    // check-in already picked, this click is the check-out attempt
    if (dateISO <= checkIn) {
      onChange(dateISO, "");
      return;
    }

    if (rangeConflicts(checkIn, dateISO, ranges)) {
      setWarning("Please choose another date — this room is already booked inside that range.");
      return;
    }

    onChange(checkIn, dateISO);
  }

  if (roomUnderMaintenance) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-xl bg-slate-50 py-10 text-center">
        <Ban className="h-5 w-5 text-slate-400" />
        <p className="text-sm font-medium text-slate-500">This room is temporarily unavailable (under maintenance).</p>
        <p className="text-xs text-slate-400">Please choose another room.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => canGoPrev && setViewMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1))}
          disabled={!canGoPrev}
          aria-label="Previous month"
          className="flex h-9 w-9 items-center justify-center rounded-full text-navy-600 transition-colors hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <p className="text-sm font-semibold text-navy-900">
          {viewMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </p>
        <button
          type="button"
          onClick={() => setViewMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1))}
          aria-label="Next month"
          className="flex h-9 w-9 items-center justify-center rounded-full text-navy-600 transition-colors hover:bg-slate-100"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className={cn("relative mt-3", disabled && "pointer-events-none opacity-40")}>
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center gap-2 rounded-xl bg-white/70 text-xs font-medium text-slate-500">
            <Loader2 className="h-3.5 w-3.5 animate-spin" /> Loading availability…
          </div>
        )}

        <div className="grid grid-cols-7 gap-y-1 text-center text-[11px] font-semibold uppercase tracking-wide text-slate-400">
          {WEEKDAY_LABELS.map((w) => (
            <div key={w}>{w}</div>
          ))}
        </div>

        <div className="mt-1 grid grid-cols-7 gap-y-1">
          {grid.map((date, i) => {
            if (!date) return <div key={i} />;
            const dateISO = toISO(date);
            const past = dateISO < today;
            const booked = isBooked(dateISO, ranges);
            const isCheckIn = dateISO === checkIn;
            const isCheckOut = dateISO === checkOut;
            const inRange = !!checkIn && !!checkOut && dateISO > checkIn && dateISO < checkOut;
            const unavailable = past || booked;

            return (
              <div key={i} className="flex justify-center py-0.5">
                <button
                  type="button"
                  disabled={unavailable}
                  onClick={() => handleDayClick(dateISO)}
                  title={booked ? "Already Booked" : past ? "Room Not Available" : "Selected room is available."}
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full text-sm transition-colors",
                    past && "cursor-not-allowed text-slate-300",
                    booked && "cursor-not-allowed bg-red-50 text-red-400 line-through",
                    !unavailable && !isCheckIn && !isCheckOut && !inRange && "text-navy-700 hover:bg-gold-50",
                    inRange && "rounded-none bg-gold-100 text-navy-800",
                    (isCheckIn || isCheckOut) && "bg-gold-500 font-semibold text-white hover:bg-gold-500"
                  )}
                >
                  {date.getDate()}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-green-500" /> Available
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400" /> Booked
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-slate-300" /> Past Dates
        </span>
      </div>

      {warning && <p className="mt-2 text-xs font-medium text-red-500">{warning}</p>}

      {!disabled && (
        <p className="mt-3 text-xs text-slate-500">
          {!checkIn
            ? "Tap a date to choose your check-in."
            : !checkOut
              ? "Now tap your check-out date."
              : `Check-in ${checkIn} → Check-out ${checkOut}`}
        </p>
      )}
    </div>
  );
}
