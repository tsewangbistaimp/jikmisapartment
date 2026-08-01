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
      if (error.code === "23P01" || error.message?.toLowerCase().includes("overlap")) {
        setError("This room was just booked for an overlapping date range. Please choose another room or different dates.");
      } else {
        setError(error.message);
      }
      return null;
    }

    const result = Array.isArray(data) ? data[0] : data;
    return (result as PublicBookingResult) ?? null;
  };

  return { createBooking, submitting, error, setError };
}
