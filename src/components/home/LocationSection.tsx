import { MapPin, Phone, Clock } from "lucide-react";
import { SITE } from "@/data/content";
import { Container, Section, SectionHeading } from "@/components/ui/layout-primitives";

export function LocationSection() {
  return (
    <Section>
      <Container className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <SectionHeading eyebrow="Location" title="Right Where You Want to Be" description="In the middle of it all, with easy access to shopping, dining, and the city's biggest attractions." />
          <ul className="mt-6 space-y-4 text-sm text-slate-600">
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-gold-500" /> {SITE.address}
            </li>
            <li className="flex items-center gap-3">
              <Phone className="h-5 w-5 shrink-0 text-gold-500" /> {SITE.phone}
            </li>
            <li className="flex items-center gap-3">
              <Clock className="h-5 w-5 shrink-0 text-gold-500" /> {SITE.openingHours}
            </li>
          </ul>
        </div>
        <div className="overflow-hidden rounded-3xl border border-slate-100 shadow-lg">
          <iframe
            title="Map"
            src={SITE.mapEmbedUrl}
            className="h-80 w-full lg:h-96"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </Container>
    </Section>
  );
}
