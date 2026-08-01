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
              Bookings made through this website are confirmed instantly and recorded in our reservations system. A 50%
              advance payment is required to confirm your booking, with the remaining 50% due within 2 days of check-in.
              Accepted payment methods are cash, bank transfer, eSewa, and Khalti. Payment is never collected through this
              website or in chat — you'll be contacted directly to arrange it.
            </p>
          </div>

          <div>
            <h2>Cancellations</h2>
            <p>
              {/* TODO: fill in a formal refund percentage/timeline policy if you adopt one — the source material only
                  confirms that terms are set case-by-case, not a fixed refund schedule. */}
              Please contact us directly at {SITE.phone} or {SITE.email} to cancel or change a reservation. Cancellation and
              refund terms depend on your specific booking and will be confirmed with you directly.
            </p>
          </div>

          <div>
            <h2>Check-in & Check-out</h2>
            <p>
              Check-in is from 2:00 PM onwards, and check-out is before 12:00 PM (noon). Early check-in or late check-out may
              be arranged in advance, subject to availability. All guests must present a valid government ID, citizenship
              card, or passport at check-in, as required by Nepal regulations.
            </p>
          </div>

          <div>
            <h2>Guest Conduct</h2>
            <p>
              Quiet hours are observed from 10:00 PM to 7:00 AM. Smoking is not permitted inside the apartment, and pets are
              not allowed. Guests are expected to treat the apartment and building with care and respect other residents; any
              damages beyond normal wear and tear may be charged to the guest.
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
