import * as React from "react";
import { supabase } from "@/lib/supabase";
import type { CreatePublicBookingArgs, PublicBookingResult } from "@/lib/database.types";

/** Calls public.create_public_booking() — the ONLY way this site is allowed
 *  to create a booking. All price calculation, availability checking, and
 *  validation happens server-side inside that function; this hook never
 *  computes or sends a total_amount itself. See
 *  jikmis-apartment/supabase/migrations/20260801070000_public_booking_website.sql */
export function useCreateBooking() {
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const createBooking = async (args: CreatePublicBookingArgs): Promise<PublicBookingResult | null> => {
    setSubmitting(true);
    setError(null);
    const { data, error } = await supabase.rpc("create_public_booking", args);
    setSubmitting(false);

    if (error) {
      // Postgres exclusion-constraint violation code, surfaced as a friendly
      // message even if it somehow slips past the function's own pre-check
      // (e.g. another guest booked the same room a moment earlier).
      if (
        error.code === "23P01" ||
        error.message?.toLowerCase().includes("overlap") ||
        error.message?.toLowerCase().includes("no longer available")
      ) {
        setError("❌ Selected dates are no longer available. Please choose another date.");
      } else {
        setError(error.message);
      }
      return null;
    }

    const result = (Array.isArray(data) ? data[0] : data) as PublicBookingResult | null;

    if (result?.booking_id) {
      // Fire-and-forget: lets staff know a new request came in by email
      // (jikmisdonkhang@gmail.com), in addition to the admin dashboard's
      // realtime popup, in case nobody has it open. Deliberately not
      // awaited and errors are swallowed — the guest's booking already
      // succeeded and must never be affected by this notification failing.
      // See jikmis-apartment/supabase/functions/notify-new-booking.
      supabase.functions.invoke("notify-new-booking", { body: { booking_id: result.booking_id } }).catch(() => {});
    }

    return result ?? null;
  };

  return { createBooking, submitting, error, setError };
}
