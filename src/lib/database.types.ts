// Mirrors the subset of jikmis-apartment/supabase/migrations that this public
// site actually reads/writes. This is the SAME database as the admin app —
// these types describe existing tables, not new ones. See
// jikmis-apartment/src/lib/database.types.ts for the full schema this app
// doesn't touch (guests, transactions, expenses, profiles, etc.).

export type RoomStatus = "available" | "occupied" | "cleaning" | "maintenance";

export interface Room {
  id: string;
  room_number: string;
  room_type: string;
  price: number;
  status: RoomStatus;
  image_url: string | null;
  created_at: string;
}

export type ServiceStatus = "active" | "inactive";

export interface Service {
  id: string;
  name: string;
  price: number;
  status: ServiceStatus;
  created_at: string;
}

/** Return shape of the public.create_public_booking() RPC (see
 *  jikmis-apartment/supabase/migrations/20260801080000_online_booking_approval_and_monthly_pricing.sql).
 *  booking_status now comes back as 'pending_approval' — the website no
 *  longer auto-confirms; a staff member reviews it in the admin dashboard. */
export interface PublicBookingResult {
  booking_id: string;
  booking_number: string;
  room_number: string;
  room_type: string;
  check_in: string;
  check_out: string;
  nights: number;
  total_amount: number;
  pricing_method: "daily" | "monthly";
  booking_status: string;
}

/** Return shape of the shared public.calculate_booking_price() RPC — the
 *  single place daily-vs-monthly pricing is decided, used here purely for a
 *  live quote while the guest is filling out the form. The database
 *  recalculates this same value again inside create_public_booking(), so
 *  the client-shown number is never trusted as the final charge. */
export interface BookingPriceQuote {
  nights: number;
  pricing_method: "daily" | "monthly";
  daily_rate: number;
  monthly_rate: number | null;
  /** Monthly rate ÷ 30, rounded to 2 decimals — the actual per-night charge
   *  once a stay reaches the long-stay threshold. Prorated, not a flat fee:
   *  a 45-night stay costs more than a 30-night one. */
  long_term_daily_rate: number | null;
  total_amount: number;
}

export interface CreatePublicBookingArgs {
  p_room_id: string;
  p_check_in: string;
  p_check_out: string;
  p_guest_count: number;
  p_full_name: string;
  p_phone: string;
  p_nationality?: string | null;
  p_passport_number?: string | null;
  p_notes?: string | null;
  /** Required — the payment-instructions and later approval/rejection/
   *  confirmation emails all go here (sent from Jikmis Apartment's Gmail
   *  account, never from the guest's own address). Must be an address the
   *  guest just verified via the 6-digit email code. */
  p_email: string;
  /** The verification_token returned by verify-email-otp after the guest
   *  successfully enters their code. create_public_booking() re-checks this
   *  server-side against email_otp_verifications — see
   *  jikmis-apartment/supabase/migrations/20260803000000_verification_and_payment_review.sql.
   *  A booking can't be created without a valid, recent one. */
  p_verification_token: string;
}
