import { useLocation, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock3, Calendar, DoorClosed, Wallet, Phone, TrendingDown, MessageCircle, ShieldAlert } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { fadeUp } from "@/lib/motion";
import { SITE } from "@/data/content";
import type { PublicBookingResult } from "@/lib/database.types";
import { Container, Section } from "@/components/ui/layout-primitives";
import { Button } from "@/components/ui/button";
import { useSEO } from "@/hooks/useSEO";

export default function BookingSuccess() {
  useSEO("Booking Request Submitted");
  const location = useLocation() as { state?: { booking?: PublicBookingResult } };
  const booking = location.state?.booking;

  if (!booking) {
    return <Navigate to="/rooms" replace />;
  }

  const advanceAmount = booking.total_amount * 0.5;

  return (
    <Section className="py-24">
      <Container className="max-w-xl">
        <motion.div variants={fadeUp} initial="initial" animate="animate" className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 text-amber-600">
            <Clock3 className="h-9 w-9" />
          </div>
          <h1 className="mt-6 font-display text-3xl font-semibold text-navy-900">Booking Request Submitted!</h1>
          <p className="mt-2 text-slate-500">
            Thank you — your request has been sent to our team for review. We'll confirm your reservation shortly; you'll be notified
            as soon as it's approved.
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
            <span className="text-sm text-slate-500">Status</span>
            <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-700">
              Pending Confirmation
            </span>
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
          {booking.pricing_method && (
            <div className="flex items-center justify-between py-3">
              <span className="flex items-center gap-2 text-sm text-slate-500">
                <TrendingDown className="h-4 w-4 text-gold-500" /> Pricing Method
              </span>
              <span className="font-medium text-navy-800">
                {booking.pricing_method === "monthly" ? "Monthly Apartment Rate" : "Daily Rate"}
              </span>
            </div>
          )}
          <div className="flex items-center justify-between border-t border-dashed border-slate-200 pt-4">
            <span className="flex items-center gap-2 text-base font-semibold text-navy-900">
              <Wallet className="h-4 w-4 text-gold-500" /> Total
            </span>
            <span className="font-display text-xl font-semibold text-navy-900">{formatCurrency(booking.total_amount)}</span>
          </div>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.15 }}
          className="mt-8 rounded-3xl border border-amber-100 bg-amber-50/60 p-6"
        >
          <h2 className="font-display text-xl font-semibold text-navy-900">Booking Pending Confirmation</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Your booking request has been received successfully.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            To confirm your reservation, please complete the <strong>50% advance payment</strong> and send a screenshot of the
            payment receipt via WhatsApp to:
          </p>
          <a href={SITE.social.whatsapp} target="_blank" rel="noreferrer" className="mt-3 inline-block">
            <Button size="sm">
              <MessageCircle className="h-4 w-4" /> WhatsApp {SITE.phone}
            </Button>
          </a>

          <div className="mt-5 rounded-2xl border border-amber-200 bg-white p-5 text-center">
            <p className="text-sm font-semibold text-navy-900">Scan to pay via eSewa</p>
            <img
              src="/images/esewa-qr.png"
              alt="eSewa payment QR code — Tsewang Bista, 9862568506"
              className="mx-auto mt-3 h-48 w-48 rounded-lg border border-slate-100"
            />
            <div className="mt-4 space-y-1 border-t border-dashed border-slate-200 pt-3 text-sm">
              <p className="flex items-center justify-between text-slate-500">
                <span>Total Amount</span>
                <span className="font-semibold text-navy-800">{formatCurrency(booking.total_amount)}</span>
              </p>
              <p className="flex items-center justify-between text-slate-500">
                <span>50% Advance to Pay Now</span>
                <span className="font-semibold text-navy-800">{formatCurrency(advanceAmount)}</span>
              </p>
            </div>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-slate-600">
            Once we receive and verify your payment, we will confirm your booking and send you a confirmation email with your
            booking details.
          </p>
          <div className="mt-4 space-y-1.5 border-t border-dashed border-amber-200 pt-4 text-xs text-slate-500">
            <p className="flex items-start gap-1.5 font-semibold text-navy-800">
              <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-600" /> Please note:
            </p>
            <p>• Your room is not reserved until the advance payment has been verified.</p>
            <p>• Payment should be made as soon as possible to avoid losing room availability.</p>
            <p>• Once payment is verified, your booking status will automatically change from Pending Confirmation to Confirmed.</p>
            <p>• If payment is not received within the required time, the booking request may be cancelled automatically.</p>
            <p>• If you have any questions, please contact us via WhatsApp.</p>
          </div>
          <p className="mt-4 text-sm text-slate-600">
            Thank you for choosing Jikmis Apartment. We look forward to welcoming you.
          </p>
          <p className="mt-3 text-xs text-slate-400">We've also sent this to your email — check your inbox (and spam folder).</p>
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
