// ============================================================================
// SITE CONTENT
//
// None of this comes from the database — there is no "amenities",
// "attractions", "testimonials", or "contact info" table in the existing
// system, and this task's rules say not to invent new tables for content
// that's really just marketing copy. So it lives here as static data instead.
//
// The contact details, location, and amenities below were pulled directly
// from the real business info in github.com/tsewangbistaimp/Jikmis-Apartment
// (the property's AI-receptionist knowledge base, lib/site.ts, and README —
// all of which agree with each other on these facts). TESTIMONIALS are still
// sample placeholders (search "TODO") since no real guest reviews were found
// anywhere in that source — replace those with real ones when you have them.
// ============================================================================

import type { LucideIcon } from "lucide-react";
import { Wifi, UtensilsCrossed, Droplets, BedDouble, Table2, Armchair, ShirtIcon, Bike, ShieldCheck, Coffee, CalendarClock, Mountain } from "lucide-react";

export const SITE = {
  name: "Jikmis Apartment",
  tagline: "Serviced Studios & Family Apartments in Boudha",
  address: "Boudha, Kathmandu, Nepal — a 3-5 minute walk from Boudhanath Stupa",
  phone: "+977 9708538395",
  phoneAlt: "+977 9869035191",
  email: "jikmisdonkhang@gmail.com",
  // Exact coordinates resolved from the property's real Google Maps pin
  // (maps.app.goo.gl/C35rXNkd5Lxam5MT8 -> "Jikmi's apartment" @27.7223124,85.3668142).
  mapEmbedUrl: "https://www.google.com/maps?q=27.7223124,85.3668142&output=embed",
  mapLink: "https://maps.app.goo.gl/C35rXNkd5Lxam5MT8",
  openingHours: "Reach us anytime via WhatsApp or call",
  social: {
    facebook: "#",
    instagram: "#",
    whatsapp: "https://wa.me/9779708538395",
  },
};

export interface Amenity {
  icon: LucideIcon;
  label: string;
}

// Building-wide amenities (not the same as the `services` table, which is
// chargeable booking add-ons like Laundry/Breakfast/Airport Pickup — those
// are pulled live from the database on the Rooms/Room Details pages
// instead). These match the confirmed facility list from the property's own
// AI-receptionist knowledge base.
export const AMENITIES: Amenity[] = [
  { icon: Wifi, label: "Free Wi-Fi" },
  { icon: UtensilsCrossed, label: "Kitchen Access" },
  { icon: Droplets, label: "Hot Water" },
  { icon: BedDouble, label: "Comfortable Bed" },
  { icon: Table2, label: "Table" },
  { icon: Armchair, label: "Chair" },
  { icon: ShirtIcon, label: "Hanger" },
  { icon: Bike, label: "Bike Parking" },
  { icon: ShieldCheck, label: "CCTV Security" },
  { icon: Coffee, label: "On-Site Cafe" },
  { icon: CalendarClock, label: "Cleaning Twice a Week" },
  { icon: Mountain, label: "Rooftop View" },
];

export interface Attraction {
  name: string;
  distance: string;
  description: string;
}

export const NEARBY_ATTRACTIONS: Attraction[] = [
  { name: "Boudhanath Stupa", distance: "3-5 min walk", description: "One of the largest stupas in the world and a UNESCO World Heritage Site — the heart of the neighborhood." },
  { name: "Local Monasteries", distance: "Walking distance", description: "Several Tibetan Buddhist monasteries and gompas are scattered throughout Boudha." },
  { name: "Cafes & Restaurants", distance: "Walking distance", description: "Rooftop cafes and restaurants line the stupa circle, including our own on-site cafe." },
  { name: "Shops, Pharmacies & ATMs", distance: "Walking distance", description: "Souvenir shops, pharmacies, banks, grocery stores, and bakeries are all close by." },
  { name: "Tribhuvan International Airport", distance: "~5 km, 15-20 min drive", description: "Kathmandu's main airport, a short drive away depending on traffic." },
];

export interface Testimonial {
  name: string;
  origin: string;
  quote: string;
  rating: number;
}

// TODO: replace with real guest reviews.
export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Sarah M.",
    origin: "United Kingdom",
    quote: "Spotless apartment, incredibly comfortable bed, and the front desk team went out of their way to help us plan our trek. Would stay again in a heartbeat.",
    rating: 5,
  },
  {
    name: "Rajesh K.",
    origin: "India",
    quote: "Perfect location right by the stupa — walking distance to everything. The kitchen let us cook our own meals, which saved so much on a longer stay.",
    rating: 5,
  },
  {
    name: "Emma L.",
    origin: "Australia",
    quote: "Booked online in two minutes and check-in was seamless. The apartment was exactly as pictured, maybe even nicer.",
    rating: 5,
  },
];

export const WHY_CHOOSE_US = [
  { title: "Best Rate Guaranteed", description: "Book direct and always get our lowest available rate — no third-party markup." },
  { title: "Steps from Boudhanath Stupa", description: "A 3-5 minute walk from one of Kathmandu's most iconic landmarks, with cafes and monasteries all around." },
  { title: "Always Reachable", description: "WhatsApp or call us anytime with questions before, during, or after your stay." },
  { title: "Fully Equipped Apartments", description: "Kitchen access, hot water, Wi-Fi, and everyday comforts in every unit." },
];

// ============================================================================
// REAL PHOTOS & VIDEO — pulled from github.com/tsewangbistaimp/Jikmis-Apartment
// ============================================================================

export interface PhotoItem {
  url: string;
  caption: string;
}

// Common-area / property photos not tied to a specific room record in the
// database — shown on the Gallery page alongside the live per-room photos.
export const PROPERTY_GALLERY: PhotoItem[] = [
  { url: "/images/jikmis/gallery/jikmis-rooftop-stupa-sunset.jpg", caption: "Rooftop view of Boudhanath Stupa at sunset" },
  { url: "/images/jikmis/gallery/jikmis-rooftop-terrace-view.jpg", caption: "Rooftop terrace" },
  { url: "/images/jikmis/gallery/jikmis-rooftop-yoga-view.jpg", caption: "Rooftop, a quiet spot for morning yoga" },
  { url: "/images/jikmis/gallery/jikmis-gallery-1736.jpg", caption: "Around Jikmis Apartment" },
  { url: "/images/jikmis/gallery/jikmis-gallery-1737.jpg", caption: "Around Jikmis Apartment" },
  { url: "/images/jikmis/gallery/jikmis-gallery-1738.jpg", caption: "Around Jikmis Apartment" },
  { url: "/images/jikmis/cafe/jikmis-cafe-main.jpg", caption: "Our on-site cafe" },
  { url: "/images/jikmis/cafe/jikmis-cafe-lounge.jpg", caption: "Cafe lounge seating" },
  { url: "/images/jikmis/cafe/jikmis-cafe-cozy-seating.jpg", caption: "Cozy cafe corner" },
  { url: "/images/jikmis/cafe/jikmis-cafe-counter.jpg", caption: "Cafe counter" },
  { url: "/images/jikmis/cafe/jikmis-cafe-window.jpg", caption: "Cafe window seating" },
  { url: "/images/jikmis/cafe/jikmis-cafe-table-corner.jpg", caption: "Cafe table corner" },
  { url: "/images/jikmis/cafe/jikmis-cafe-iced-coffee.jpg", caption: "Iced coffee at the cafe" },
  { url: "/images/jikmis/cafe/jikmis-cafe-orange-coffee.jpg", caption: "Orange coffee at the cafe" },
  { url: "/images/jikmis/cafe/jikmis-cafe-berry-drink.jpg", caption: "Berry drink at the cafe" },
  { url: "/images/jikmis/cafe/jikmis-cafe-mango-drink.jpg", caption: "Mango drink at the cafe" },
];

// Supplementary photos keyed by a lowercase substring match against a room's
// `room_type` from the live database (e.g. a room typed "Single Studio" in
// the admin app matches the "single" key). Purely additive — the room's own
// `image_url` from the database is always the primary photo; these are
// extra real photos of that room type when the admin hasn't uploaded a full
// set yet.
export const ROOM_TYPE_PHOTOS: Record<string, PhotoItem[]> = {
  single: [
    { url: "/images/jikmis/single-studio-bedroom.jpeg", caption: "Single Studio — bedroom" },
    { url: "/images/jikmis/single-studio-kitchen.jpeg", caption: "Single Studio — kitchen" },
  ],
  double: [
    { url: "/images/jikmis/double-studio-bedroom.jpeg", caption: "Double Studio — bedroom" },
    { url: "/images/jikmis/double-studio-bathroom.jpeg", caption: "Double Studio — bathroom" },
    { url: "/images/jikmis/double-studio-lounge.jpeg", caption: "Double Studio — lounge" },
  ],
  family: [
    { url: "/images/jikmis/family-room-bedroom.jpeg", caption: "Family Room — bedroom" },
    { url: "/images/jikmis/family-room-second-bedroom.jpeg", caption: "Family Room — second bedroom" },
    { url: "/images/jikmis/family-room-living.jpeg", caption: "Family Room — living area" },
    { url: "/images/jikmis/family-room-sunroom.jpeg", caption: "Family Room — sunroom" },
  ],
};

export interface TourVideo {
  src: string;
  title: string;
}

export const TOUR_VIDEOS: TourVideo[] = [
  { src: "/videos/jikmis-apartment-tour-1.mp4", title: "2BHK Family Room" },
  { src: "/videos/jikmis-apartment-tour-2.mp4", title: "Single Studio Room" },
  { src: "/videos/jikmis-apartment-tour-3.mp4", title: "Double Studio Room" },
];

// Matches a room's `room_type` text (e.g. "Single Studio") against a known
// key ("single") — shared by ROOM_TYPE_PHOTOS and ROOM_TYPE_MAX_GUESTS below
// so both stay in sync with the same matching rule.
export function getRoomTypeKey(roomType: string): string | undefined {
  return Object.keys(ROOM_TYPE_MAX_GUESTS).find((k) => roomType.toLowerCase().includes(k));
}

// The `rooms` table has no max-guests column, so this is confirmed real
// capacity per room type (not pulled from the database). Prices are never
// hardcoded here — those always come from the live `room.price` field.
export const ROOM_TYPE_MAX_GUESTS: Record<string, number> = {
  single: 2,
  double: 3,
  family: 5,
};

export function maxGuestsFor(roomType: string): number | undefined {
  const key = getRoomTypeKey(roomType);
  return key ? ROOM_TYPE_MAX_GUESTS[key] : undefined;
}
