import { SITE } from "@/data/content";
import { Container, Section } from "@/components/ui/layout-primitives";
import { useSEO } from "@/hooks/useSEO";

export default function Terms() {
  useSEO("Terms & Conditions");
  return (
    <div>
      <div className="bg-navy-900 pb-16 pt-32 text-center text-white sm:pt-40">
        <Container>
          <h1 className="font-display text-4xl font-semibold sm:text-5xl">Terms & Conditions</h1>
        </Container>
      </div>
      <Section>
        <Container className="max-w-3xl space-y-6 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-navy-900 [&_h2]:mt-8 [&_p]:mt-3 [&_p]:leading-relaxed [&_p]:text-slate-600">
          {/* TODO: replace this placeholder with terms reviewed by a lawyer
              for your jurisdiction — it is not legal advice. */}
          <p className="text-sm text-slate-400">Last updated: {new Date().toLocaleDateString()}</p>

          <div>
            <h2>Booking & Payment</h2>
            <p>
              Bookings made through this website are confirmed instantly and recorded in our reservations system. Unless
              stated otherwise at the time of booking, payment is settled at the property using cash, eSewa, Khalti, or bank
              transfer.
            </p>
          </div>

          <div>
            <h2>Cancellations</h2>
            <p>
              {/* TODO: fill in your real cancellation policy — none is enforced automatically by the booking system today. */}
              Please contact us directly at {SITE.phone} or {SITE.email} to cancel or change a reservation. Cancellation terms
              will be confirmed with you at the time of booking.
            </p>
          </div>

          <div>
            <h2>Check-in & Check-out</h2>
            <p>
              Standard check-in and check-out times will be confirmed in your booking communication. Early check-in or late
              check-out may be arranged in advance, subject to availability.
            </p>
          </div>

          <div>
            <h2>Guest Conduct</h2>
            <p>
              Guests are expected to treat the apartment and building with care and respect other residents. Any damages
              beyond normal wear and tear may be charged to the guest.
            </p>
          </div>

          <div>
            <h2>Contact</h2>
            <p>Questions about these terms can be directed to {SITE.email} or {SITE.phone}.</p>
          </div>
        </Container>
      </Section>
    </div>
  );
}
