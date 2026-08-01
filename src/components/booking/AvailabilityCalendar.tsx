import * as React from "react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BookedRange } from "@/hooks/useRooms";

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

/** True if the given day (start of day) falls within any booked [start, end)
 *  range — i.e. the room is occupied that night. */
function isBooked(dateISO: string, ranges: BookedRange[]) {
  return ranges.some((r) => dateISO >= r.start && dateISO < r.end);
}

/** True if a candidate [checkIn, checkOut) stay overlaps any booked range. */
function rangeConflicts(checkIn: string, checkOut: string, ranges: BookedRange[]) {
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
  checkIn: string;
  checkOut: string;
  bookedRanges: BookedRange[];
  loading?: boolean;
  disabled?: boolean;
  onChange: (checkIn: string, checkOut: string) => void;
}

export function AvailabilityCalendar({ checkIn, checkOut, bookedRanges, loading, disabled, onChange }: AvailabilityCalendarProps) {
  const today = React.useMemo(() => toISO(new Date()), []);
  const currentMonthStart = React.useMemo(() => startOfMonth(new Date()), []);
  const [viewMonth, setViewMonth] = React.useState(() => startOfMonth(checkIn ? fromISO(checkIn) : new Date()));
  const [warning, setWarning] = React.useState<string | null>(null);

  const grid = React.useMemo(() => buildMonthGrid(viewMonth), [viewMonth]);
  const canGoPrev = !isSameMonth(viewMonth, currentMonthStart);

  function handleDayClick(dateISO: string) {
    if (disabled) return;
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

    if (rangeConflicts(checkIn, dateISO, bookedRanges)) {
      setWarning("Another booking starts before that date. Pick an earlier check-out or a different check-in.");
      return;
    }

    onChange(checkIn, dateISO);
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
            const booked = isBooked(dateISO, bookedRanges);
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
                  title={booked ? "Not available" : past ? undefined : "Available"}
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full text-sm transition-colors",
                    unavailable && "cursor-not-allowed text-slate-300",
                    booked && "bg-red-50 text-red-300 line-through",
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
          <span className="h-2.5 w-2.5 rounded-full bg-gold-500" /> Selected
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full border border-slate-300 bg-white" /> Available
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-100" /> Booked
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
