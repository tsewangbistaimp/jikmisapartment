import { Link } from "react-router-dom";
import { Building2, MapPin, Phone, Mail, Clock } from "lucide-react";
import { SITE } from "@/data/content";
import { Container } from "@/components/ui/layout-primitives";

// lucide-react no longer ships brand/social icons, so these are small inline SVGs.
function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M13.5 21v-8h2.7l.4-3.2h-3.1V7.7c0-.9.3-1.6 1.6-1.6h1.7V3.2C16.5 3.1 15.4 3 14.2 3c-2.6 0-4.4 1.6-4.4 4.5v2.3H7v3.2h2.8v8h3.7Z" />
    </svg>
  );
}

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

const FOOTER_LINKS = [
  { to: "/about", label: "About Us" },
  { to: "/rooms", label: "Rooms" },
  { to: "/gallery", label: "Gallery" },
  { to: "/amenities", label: "Amenities" },
  { to: "/nearby", label: "Nearby Attractions" },
  { to: "/jimkis-farm-donkhang", label: "Jimki's Farm & Donkhang" },
  { to: "/contact", label: "Contact" },
];

const LEGAL_LINKS = [
  { to: "/privacy", label: "Privacy Policy" },
  { to: "/terms", label: "Terms & Conditions" },
];

export function Footer() {
  return (
    <footer className="bg-navy-900 text-navy-200">
      <Container className="grid grid-cols-1 gap-10 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link to="/" className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 text-navy-900">
              <Building2 className="h-5 w-5" />
            </span>
            <span className="font-display text-lg font-semibold text-white">{SITE.name}</span>
          </Link>
          <p className="mt-4 text-sm leading-relaxed text-navy-300">
            {SITE.tagline} in the heart of the city — comfortable, fully-equipped apartments with the personal service of a boutique hotel.
          </p>
          <div className="mt-5 flex gap-3">
            <a href={SITE.social.facebook} aria-label="Facebook" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20">
              <FacebookIcon className="h-4 w-4" />
            </a>
            <a href={SITE.social.instagram} aria-label="Instagram" className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20">
              <InstagramIcon className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-gold-300">Explore</p>
          <ul className="space-y-2.5 text-sm">
            {FOOTER_LINKS.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="text-navy-300 transition-colors hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-gold-300">Legal</p>
          <ul className="space-y-2.5 text-sm">
            {LEGAL_LINKS.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="text-navy-300 transition-colors hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-gold-300">Contact</p>
          <ul className="space-y-3 text-sm text-navy-300">
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold-400" /> {SITE.address}
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="h-4 w-4 shrink-0 text-gold-400" /> {SITE.phone}
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="h-4 w-4 shrink-0 text-gold-400" /> {SITE.email}
            </li>
            <li className="flex items-center gap-2.5">
              <Clock className="h-4 w-4 shrink-0 text-gold-400" /> {SITE.openingHours}
            </li>
          </ul>
        </div>
      </Container>

      <div className="border-t border-white/10 py-6">
        <Container className="flex flex-col items-center justify-between gap-2 text-xs text-navy-400 sm:flex-row">
          <p>© {new Date().getFullYear()} {SITE.name}. All rights reserved.</p>
          <p>Reservations powered by the Jikmis Apartment booking system.</p>
        </Container>
      </div>
    </footer>
  );
}
