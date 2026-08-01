import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { CalendarDays, Users, ShieldCheck } from "lucide-react";
import { publicBookingFormSchema, type PublicBookingFormValues } from "@/lib/schemas";
import { formatCurrency, nightsBetween, todayISO, addDaysISO } from "@/lib/utils";
import { maxGuestsFor } from "@/data/content";
import { useRooms, useRoomAvailability } from "@/hooks/useRooms";
import { useCreateBooking } from "@/hooks/useCreateBooking";
import { Label, Input, Textarea, Select, FieldError } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function BookingForm({ initialRoomId }: { initialRoomId?: string }) {
  const navigate = useNavigate();
  const { rooms, loading: roomsLoading } = useRooms();
  const { createBooking, submitting, error } = useCreateBooking();

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<PublicBookingFormValues & { room_id: string }>({
    resolver: zodResolver(publicBookingFormSchema) as never,
    defaultValues: {
      room_id: initialRoomId ?? "",
      guest_count: 1,
      check_in: todayISO(),
      check_out: addDaysISO(todayISO(), 1),
    },
  });

  const roomId = watch("room_id");
  const checkIn = watch("check_in");
  const checkOut = watch("check_out");
  const nights = nightsBetween(checkIn, checkOut);
  const selectedRoom = rooms.find((r) => r.id === roomId);
  const { available, checking } = useRoomAvailability(roomId, checkIn, checkOut);
  const guestCount = watch("guest_count");
  const maxGuests = selectedRoom ? maxGuestsFor(selectedRoom.room_type) : undefined;
  const overCapacity = !!maxGuests && guestCount > maxGuests;

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

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label htmlFor="room_id">Room</Label>
            <Controller
              control={control}
              name="room_id"
              render={({ field }) => (
                <Select id="room_id" {...field} disabled={roomsLoading}>
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

          <div>
            <Label htmlFor="check_in">Check-in</Label>
            <Input id="check_in" type="date" min={todayISO()} {...register("check_in")} />
            <FieldError message={errors.check_in?.message} />
          </div>
          <div>
            <Label htmlFor="check_out">Check-out</Label>
            <Input id="check_out" type="date" min={addDaysISO(checkIn || todayISO(), 1)} {...register("check_out")} />
            <FieldError message={errors.check_out?.message} />
          </div>

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
              <div className="w-full rounded-xl bg-white px-4 py-2.5 text-sm">
                <span className="text-slate-400">{nights} night{nights === 1 ? "" : "s"} · </span>
                {checking ? (
                  <span className="text-slate-400">Checking availability…</span>
                ) : available === false ? (
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

      <Button type="submit" size="lg" className="w-full" loading={submitting} disabled={available === false || overCapacity}>
        {submitting ? "Confirming your booking…" : "Book Now"}
      </Button>

      <p className="flex items-center justify-center gap-1.5 text-center text-xs text-slate-400">
        <ShieldCheck className="h-3.5 w-3.5" /> Your booking is confirmed instantly and appears in our reservations system right away.
      </p>
    </form>
  );
}
