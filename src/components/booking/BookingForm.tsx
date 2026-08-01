import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { CalendarDays, Users, ShieldCheck } from "lucide-react";
import { publicBookingFormSchema, type PublicBookingFormValues } from "@/lib/schemas";
import { formatCurrency, nightsBetween } from "@/lib/utils";
import { maxGuestsFor } from "@/data/content";
import { useRooms, useRoomBookedRanges } from "@/hooks/useRooms";
import { useCreateBooking } from "@/hooks/useCreateBooking";
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
  } = useForm<PublicBookingFormValues & { room_id: string }>({
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
  const { ranges: bookedRanges, loading: rangesLoading } = useRoomBookedRanges(roomId);
  const guestCount = watch("guest_count");
  const maxGuests = selectedRoom ? maxGuestsFor(selectedRoom.room_type) : undefined;
  const overCapacity = !!maxGuests && guestCount > maxGuests;
  const datesSelected = !!checkIn && !!checkOut;
  // The calendar only lets guests tap open dates, so a fully-picked range is
  // available by construction — this just guards the moment right before
  // submit (e.g. someone else booked it in the last few seconds).
  const available = datesSelected ? !bookedRanges.some((r) => checkIn < r.end && checkOut > r.start) : null;

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
        </div>

        <div className="mt-6 rounded-2xl border border-slate-100 bg-white p-4 sm:p-5">
          {!roomId ? (
            <p className="py-6 text-center text-sm text-slate-400">Select a room above to see its live availability calendar.</p>
          ) : (
            <AvailabilityCalendar
              checkIn={checkIn}
              checkOut={checkOut}
              bookedRanges={bookedRanges}
              loading={rangesLoading}
              onChange={(ci, co) => {
                setValue("check_in", ci, { shouldValidate: true });
                setValue("check_out", co, { shouldValidate: true });
              }}
            />
          )}
        </div>
        <FieldError message={errors.check_in?.message ?? errors.check_out?.message} />

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
            {roomId && nights > 0 && (
              <div className="w-full rounded-xl bg-slate-50 px-4 py-2.5 text-sm">
                <span className="text-slate-400">{nights} night{nights === 1 ? "" : "s"} · </span>
                {available === false ? (
                  <span className="font-semibold text-red-500">Not available for these dates</span>
                ) : selectedRoom ? (
                  <span className="font-semibold text-navy-800">{formatCurrency(selectedRoom.price * nights)} total</span>
                ) : null}
              </div>
            )}
          </div>
        </div>
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
        disabled={!roomId || !datesSelected || available === false || overCapacity}
      >
        {!roomId ? "Select a Room to Continue" : !datesSelected ? "Select Your Dates to Continue" : submitting ? "Confirming your booking…" : "Book Now"}
      </Button>

      <p className="flex items-center justify-center gap-1.5 text-center text-xs text-slate-400">
        <ShieldCheck className="h-3.5 w-3.5" /> Your booking is confirmed instantly and appears in our reservations system right away.
      </p>
    </form>
  );
}
