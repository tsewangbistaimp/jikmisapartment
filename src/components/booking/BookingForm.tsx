import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { CalendarDays, Users, ShieldCheck, TrendingDown, Clock, CheckCircle2, AlertTriangle } from "lucide-react";
import { publicBookingFormSchema, type PublicBookingFormValues } from "@/lib/schemas";
import { formatCurrency, nightsBetween, cn } from "@/lib/utils";
import { maxGuestsFor } from "@/data/content";
import { useRooms, useDateRangeAvailability } from "@/hooks/useRooms";
import { useCreateBooking } from "@/hooks/useCreateBooking";
import { useBookingPrice } from "@/hooks/useBookingPrice";
import { Label, Input, Textarea, Select, FieldError } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AvailabilityCalendar } from "@/components/booking/AvailabilityCalendar";

export function BookingForm({ initialRoomId }: { initialRoomId?: string }) {
  const navigate = useNavigate();
  const { rooms, loading: roomsLoading } = useRooms();
  const { createBooking, submitting, error } = useCreateBooking();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<PublicBookingFormValues>({
    resolver: zodResolver(publicBookingFormSchema) as never,
    defaultValues: {
      room_id: initialRoomId ?? "",
      guest_count: 1,
      check_in: "",
      check_out: "",
    },
  });

  const roomId = watch("room_id");
  const checkIn = watch("check_in");
  const checkOut = watch("check_out");
  const nights = nightsBetween(checkIn, checkOut);
  const selectedRoom = rooms.find((r) => r.id === roomId);
  const { quote: priceQuote } = useBookingPrice(roomId, checkIn, checkOut);
  // The calendar only lets guests tap open dates, so a fully-picked range is
  // available by construction — this is the final check right before
  // submit (e.g. someone else's confirmed booking landed in the last few
  // seconds). Only a confirmed booking blocks; another guest's still-
  // pending request never does.
  const { available } = useDateRangeAvailability(roomId, checkIn, checkOut);
  const guestCount = watch("guest_count");
  const maxGuests = selectedRoom ? maxGuestsFor(selectedRoom.room_type) : undefined;
  const overCapacity = !!maxGuests && guestCount > maxGuests;
  const datesSelected = !!checkIn && !!checkOut;

  // Picking a different room resets the date selection, since availability
  // is per-room.
  function handleRoomChange(newRoomId: string) {
    setValue("room_id", newRoomId, { shouldValidate: true });
    setValue("check_in", "");
    setValue("check_out", "");
  }

  const onSubmit = handleSubmit(async (values) => {
    if (!values.room_id) {
      toast.error("Please select a room");
      return;
    }
    const result = await createBooking({
      p_room_id: values.room_id,
      p_check_in: values.check_in,
      p_check_out: values.check_out,
      p_guest_count: values.guest_count,
      p_full_name: values.full_name,
      p_phone: values.phone,
      p_nationality: values.nationality || null,
      p_passport_number: values.passport_number || null,
      p_notes: values.notes || null,
    });

    if (result) {
      navigate("/booking-success", { state: { booking: result } });
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="rounded-3xl border border-slate-100 bg-slate-50/60 p-6">
        <p className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-navy-800">
          <CalendarDays className="h-4 w-4 text-gold-600" /> Stay Details
        </p>

        <div>
          <Label htmlFor="room_id">Room</Label>
          <Controller
            control={control}
            name="room_id"
            render={({ field }) => (
              <Select
                id="room_id"
                name={field.name}
                ref={field.ref}
                value={field.value}
                onBlur={field.onBlur}
                onChange={(e) => handleRoomChange(e.target.value)}
                disabled={roomsLoading}
              >
                <option value="">{roomsLoading ? "Loading rooms…" : "Select a room"}</option>
                {rooms
                  .filter((r) => r.status !== "maintenance")
                  .map((r) => (
                    <option key={r.id} value={r.id}>
                      Room {r.room_number} — {r.room_type} ({formatCurrency(r.price)}/night)
                    </option>
                  ))}
              </Select>
            )}
          />
          <FieldError message={errors.room_id?.message} />
        </div>

        <div className="mt-6 rounded-2xl border border-slate-100 bg-white p-4 sm:p-5">
          {!roomId ? (
            <p className="py-6 text-center text-sm text-slate-400">Select a room above to see its live availability calendar.</p>
          ) : (
            <AvailabilityCalendar
              // Remounts the calendar (and its internal availability hook)
              // whenever the selected room changes, instead of reusing the
              // same instance with a new roomId prop. Without this, the
              // previous room's cached booked/pending ranges stay on screen
              // for the brief moment before the new room's data has loaded,
              // which could let a guest tap a date that looks open (because
              // it was open for the OLD room) but is actually unavailable
              // for the room they just switched to.
              key={roomId}
              roomId={roomId}
              roomStatus={selectedRoom?.status}
              checkIn={checkIn}
              checkOut={checkOut}
              onChange={(ci, co) => {
                setValue("check_in", ci, { shouldValidate: true });
                setValue("check_out", co, { shouldValidate: true });
              }}
            />
          )}
        </div>
        <FieldError message={errors.check_in?.message ?? errors.check_out?.message} />

        {datesSelected && (
          <div
            className={cn(
              "mt-3 flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm",
              available === false ? "bg-red-50 text-red-600" : available === true ? "bg-emerald-50 text-emerald-700" : "bg-slate-50 text-slate-500"
            )}
          >
            {available === false ? (
              <>
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>This room is unavailable for the selected dates. Please choose different dates.</span>
              </>
            ) : available === true ? (
              <>
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>Selected room is available.</span>
              </>
            ) : (
              <span>Checking availability…</span>
            )}
          </div>
        )}

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="guest_count">Guests{maxGuests ? ` (max ${maxGuests})` : ""}</Label>
            <Input id="guest_count" type="number" min={1} max={maxGuests} {...register("guest_count", { valueAsNumber: true })} />
            {overCapacity ? (
              <p className="mt-1.5 text-xs font-medium text-red-500">This room fits up to {maxGuests} guests.</p>
            ) : (
              <FieldError message={errors.guest_count?.message} />
            )}
          </div>

          <div className="flex items-end">
            {roomId && nights > 0 && available !== false && priceQuote && (
              <div className="w-full rounded-xl bg-slate-50 px-4 py-2.5 text-sm">
                <span className="text-slate-400">{nights} night{nights === 1 ? "" : "s"} · </span>
                <span className="font-semibold text-navy-800">{formatCurrency(priceQuote.total_amount)} total</span>
              </div>
            )}
          </div>
        </div>

        {priceQuote && available !== false && (
          <div className="mt-4 rounded-2xl border border-slate-100 bg-white p-4 sm:p-5">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Price Breakdown</p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between text-slate-500">
                <span>Room Type</span>
                <span className="font-medium text-navy-800">{selectedRoom?.room_type}</span>
              </div>
              <div className="flex items-center justify-between text-slate-500">
                <span>Daily Rate</span>
                <span>{formatCurrency(priceQuote.daily_rate)}/night</span>
              </div>
              {priceQuote.monthly_rate != null && (
                <div className="flex items-center justify-between text-slate-500">
                  <span>Monthly Apartment Rate</span>
                  <span>{formatCurrency(priceQuote.monthly_rate)}</span>
                </div>
              )}
              {priceQuote.long_term_daily_rate != null && (
                <div className="flex items-center justify-between text-slate-500">
                  <span>Long-Term Daily Rate</span>
                  <span>{formatCurrency(priceQuote.long_term_daily_rate)}/night</span>
                </div>
              )}
              <div className="flex items-center justify-between text-slate-500">
                <span>Nights</span>
                <span>{priceQuote.nights}</span>
              </div>
              <div className="flex items-center justify-between text-slate-500">
                <span>Pricing Method</span>
                <span className="font-medium text-navy-800">
                  {priceQuote.pricing_method === "monthly" ? "Monthly Apartment Rate" : "Daily Rate"}
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-dashed border-slate-200 pt-2.5 text-base font-semibold text-navy-900">
                <span>Grand Total</span>
                <span>{formatCurrency(priceQuote.total_amount)}</span>
              </div>
            </div>

            {priceQuote.pricing_method === "monthly" && (
              <div className="mt-3 flex items-start gap-2 rounded-xl bg-emerald-50 px-3 py-2.5 text-xs text-emerald-700">
                <TrendingDown className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                <span>
                  <span className="font-semibold">Long-Term Apartment Pricing Applied.</span> Stays of 30 nights or more are charged at
                  the prorated long-term daily rate ({formatCurrency(priceQuote.long_term_daily_rate ?? 0)}/night = monthly rate ÷ 30)
                  instead of the regular nightly rate — automatically, no need to ask.
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="rounded-3xl border border-slate-100 bg-slate-50/60 p-6">
        <p className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-navy-800">
          <Users className="h-4 w-4 text-gold-600" /> Your Details
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label htmlFor="full_name">Full Name</Label>
            <Input id="full_name" placeholder="As it appears on your ID" {...register("full_name")} />
            <FieldError message={errors.full_name?.message} />
          </div>
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" placeholder="98XXXXXXXX" {...register("phone")} />
            <FieldError message={errors.phone?.message} />
          </div>
          <div>
            <Label htmlFor="nationality">Nationality (optional)</Label>
            <Input id="nationality" {...register("nationality")} />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="passport_number">Passport / ID Number (optional)</Label>
            <Input id="passport_number" {...register("passport_number")} />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="notes">Special Requests (optional)</Label>
            <Textarea id="notes" rows={3} placeholder="Late check-in, extra bed, etc." {...register("notes")} />
          </div>
        </div>
      </div>

      <FieldError message={error ?? undefined} />

      <Button
        type="submit"
        size="lg"
        className="w-full"
        loading={submitting}
        // Require an explicit "available === true" rather than merely
        // "not false" — while the final safety check is still in flight
        // (available === null), submitting must stay blocked, otherwise a
        // guest who taps the button quickly could squeeze a request through
        // before the database-backed check has actually confirmed the dates
        // are free. The database's own overlap guard in create_public_booking()
        // is still the ultimate authority, but the button shouldn't invite
        // guests to race it.
        disabled={!roomId || !datesSelected || available !== true || overCapacity}
      >
        {!roomId
          ? "Select a Room to Continue"
          : !datesSelected
            ? "Select Your Dates to Continue"
            : submitting
              ? "Submitting your request…"
              : available === null
                ? "Checking availability…"
                : "Request to Book"}
      </Button>

      <p className="flex items-center justify-center gap-1.5 text-center text-xs text-slate-400">
        <Clock className="h-3.5 w-3.5" /> Your request is reviewed by our team and confirmed shortly — you'll be notified once it's approved.
      </p>
      <p className="flex items-center justify-center gap-1.5 text-center text-xs text-slate-300">
        <ShieldCheck className="h-3 w-3" /> No payment is collected now — pricing is calculated securely on our end.
      </p>
    </form>
  );
}
