import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-NP", {
    style: "currency",
    currency: "NPR",
    maximumFractionDigits: 0,
  }).format(amount || 0);
}

export function formatDate(date: string | Date) {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(d);
}

export function nightsBetween(checkIn: string, checkOut: string) {
  if (!checkIn || !checkOut) return 0;
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diff = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 0;
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function addDaysISO(dateISO: string, days: number) {
  const d = new Date(dateISO + "T00:00:00");
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

/** Normalizes a guest-typed phone number toward E.164
 *  (https://en.wikipedia.org/wiki/E.164 — a leading '+', country code, up
 *  to 15 digits total, no spaces/dashes/parens) and reports whether the
 *  result is valid. Nepali guests overwhelmingly type a bare 10-digit local
 *  number (e.g. "9841234567") without the country code, so this assumes
 *  Nepal (+977) when no '+' or country code is present, rather than
 *  rejecting the number outright — the property IS in Nepal, so this
 *  matches real guest input instead of demanding a format nobody types by
 *  hand. A number that already starts with '+' is normalized (whitespace/
 *  dashes stripped) and validated as-is, so international guests who do
 *  type their own country code still work correctly. */
export function normalizePhoneE164(raw: string): { value: string; valid: boolean } {
  const stripped = raw.trim().replace(/[\s\-()]/g, "");
  let candidate = stripped;
  if (!candidate.startsWith("+")) {
    candidate = candidate.startsWith("977") ? `+${candidate}` : `+977${candidate.replace(/^0+/, "")}`;
  }
  const valid = /^\+[1-9]\d{6,14}$/.test(candidate);
  return { value: candidate, valid };
}

