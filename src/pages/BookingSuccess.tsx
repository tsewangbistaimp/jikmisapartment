import { useLocation, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, Calendar, DoorClosed, Wallet, Phone } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { fadeUp } from "@/lib/motion";
import { SITE } from "@/data/content";
import type { PublicBookingResult } from "@/lib/database.types";
import { Container, Section } from "@/components/ui/layout-primitives";
import { Button } from "@/components/ui/button";
import { useSEO } from "@/hooks/useSEO";

export default function BookingSuccess() {
  useSEO("Booking Confirmed");
  const location = useLocation() as { state?: { booking?: PublicBookingResult } };
  const booking = location.state?.booking;

  if (!booking) {
    return <Navigate to="/rooms" replace />;
  }

  return (
    <Section className="py-24">
      <Container className="max-w-xl">
        <motion.div variants={fadeUp} initial="initial" animate="animate" className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="h-9 w-9" />
          </div>
          <h1 className="mt-6 font-display text-3xl font-semibold text-navy-900">Booking Confirmed!</h1>
          <p className="mt-2 text-slate-500">
            Thank you — we look forward to hosting you. A confirmation has been recorded under the booking number below.
          </p>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.1 }}
          className="mt-10 space-y-1.5 rounded-3xl border border-slate-100 p-6 shadow-lg"
        >
          <div className="flex items-center justify-between border-b border-dashed border-slate-200 pb-4">
            <span className="text-sm text-slate-400">Booking Number</span>
            <span className="font-mono text-base font-semibold text-navy-900">{booking.booking_number}</span>
          </div>

          <div className="flex items-center justify-between py-3">
            <span className="flex items-center gap-2 text-sm text-slate-500">
              <DoorClosed className="h-4 w-4 text-gold-500" /> Room
            </span>
            <span className="font-medium text-navy-800">
              Room {booking.room_number} · {booking.room_type}
            </span>
          </div>
          <div className="flex items-center justify-between py-3">
            <span className="flex items-center gap-2 text-sm text-slate-500">
              <Calendar className="h-4 w-4 text-gold-500" /> Check-in → Check-out
            </span>
            <span className="font-medium text-navy-800">
              {formatDate(booking.check_in)} → {formatDate(booking.check_out)}
            </span>
          </div>
          <div className="flex items-center justify-between py-3">
            <span className="text-sm text-slate-500">Nights</span>
            <span className="font-medium text-navy-800">{booking.nights}</span>
          </div>
          <div className="flex items-center justify-between border-t border-dashed border-slate-200 pt-4">
            <span className="flex items-center gap-2 text-base font-semibold text-navy-900">
              <Wallet className="h-4 w-4 text-gold-500" /> Total
            </span>
            <span className="font-display text-xl font-semibold text-navy-900">{formatCurrency(booking.total_amount)}</span>
          </div>
        </motion.div>

        <motion.div variants={fadeUp} initial="initial" animate="animate" transition={{ delay: 0.2 }} className="mt-8 text-center">
          <p className="flex items-center justify-center gap-1.5 text-sm text-slate-500">
            <Phone className="h-4 w-4" /> Questions about your stay? Call us at {SITE.phone}
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to="/">
              <Button variant="outline" className="w-full sm:w-auto">
                Back to Home
              </Button>
            </Link>
            <Link to="/rooms">
              <Button className="w-full sm:w-auto">Browse More Rooms</Button>
            </Link>
          </div>
        </motion.div>
      </Container>
    </Section>
  );
}
