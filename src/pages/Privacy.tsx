import { SITE } from "@/data/content";
import { Container, Section } from "@/components/ui/layout-primitives";
import { useSEO } from "@/hooks/useSEO";

export default function Privacy() {
  useSEO("Privacy Policy");
  return (
    <div>
      <div className="bg-navy-900 pb-16 pt-32 text-center text-white sm:pt-40">
        <Container>
          <h1 className="font-display text-4xl font-semibold sm:text-5xl">Privacy Policy</h1>
        </Container>
      </div>
      <Section>
        <Container className="max-w-3xl space-y-6 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-navy-900 [&_h2]:mt-8 [&_p]:mt-3 [&_p]:leading-relaxed [&_p]:text-slate-600">
          {/* TODO: replace this placeholder policy with one reviewed by a
              lawyer for your jurisdiction — it is not legal advice. */}
          <p className="text-sm text-slate-400">Last updated: {new Date().toLocaleDateString()}</p>

          <div>
            <h2>Information We Collect</h2>
            <p>
              When you make a booking through this website, we collect your full name, phone number, nationality, passport/ID
              number (if provided), and any special requests you share with us. This information is stored securely in our
              reservation system and used solely to manage your stay.
            </p>
          </div>

          <div>
            <h2>How We Use Your Information</h2>
            <p>
              Your information is used to confirm and manage your booking, communicate with you about your stay, and comply
              with local guest registration requirements. We do not sell or share your personal information with third
              parties for marketing purposes.
            </p>
          </div>

          <div>
            <h2>Data Security</h2>
            <p>
              Booking data is stored in an access-controlled database. Only authorized staff can view guest records, and
              sensitive documents (such as ID photos) are stored separately with restricted access.
            </p>
          </div>

          <div>
            <h2>Your Rights</h2>
            <p>You may request a copy of the information we hold about you, or ask us to correct or delete it, by contacting us at {SITE.email}.</p>
          </div>

          <div>
            <h2>Contact</h2>
            <p>Questions about this policy can be directed to {SITE.email} or {SITE.phone}.</p>
          </div>
        </Container>
      </Section>
    </div>
  );
}
