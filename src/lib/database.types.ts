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
 *  jikmis-apartment/supabase/migrations/20260801070000_public_booking_website.sql). */
export interface PublicBookingResult {
  booking_id: string;
  booking_number: string;
  room_number: string;
  room_type: string;
  check_in: string;
  check_out: string;
  nights: number;
  total_amount: number;
  booking_status: string;
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
}
