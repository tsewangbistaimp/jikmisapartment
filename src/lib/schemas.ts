import { z } from "zod";

// Mirrors the guest/date validation rules already used by the admin app's
// bookingFormSchema (jikmis-apartment/src/lib/schemas.ts) — same minimums,
// same phone pattern — so the public site never accepts data the staff
// system would consider invalid.
export const publicBookingFormSchema = z
  .object({
    // Without this in the schema, zod's resolver strips room_id from the
    // parsed values on submit (since z.object() drops keys it doesn't know
    // about) even though the guest genuinely picked a room in the UI — that
    // silently turned into a false "Please select a room" error at submit
    // time. Declaring it here keeps it in the validated output AND gives a
    // real validation error if it's ever actually empty.
    room_id: z.string().min(1, "Please select a room"),
    full_name: z.string().trim().min(2, "Please enter your full name"),
    phone: z
      .string()
      .trim()
      .min(7, "Enter a valid phone number")
      .regex(/^[0-9+\-\s()]+$/, "Enter a valid phone number"),
    // Optional — but if the guest gives one, it's used to send the booking
    // confirmation/rejection email from Jikmis Apartment's Gmail account.
    // Empty string is allowed (no email given) without failing validation;
    // an actually-entered value must look like a real address.
    email: z.union([z.string().trim().email("Enter a valid email address"), z.literal("")]).optional(),
    nationality: z.string().trim().optional(),
    passport_number: z.string().trim().optional(),
    guest_count: z.number().int().min(1, "At least 1 guest"),
    check_in: z.string().min(1, "Check-in date is required"),
    check_out: z.string().min(1, "Check-out date is required"),
    notes: z.string().trim().optional(),
  })
  .refine((data) => new Date(data.check_out) > new Date(data.check_in), {
    message: "Check-out must be after check-in",
    path: ["check_out"],
  })
  .refine((data) => new Date(data.check_in) >= new Date(new Date().toDateString()), {
    message: "Check-in date cannot be in the past",
    path: ["check_in"],
  });

export type PublicBookingFormValues = z.infer<typeof publicBookingFormSchema>;

export const contactFormSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name"),
  email: z.string().trim().email("Enter a valid email"),
  phone: z.string().trim().optional(),
  message: z.string().trim().min(10, "Message should be at least 10 characters"),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
