// ============================================================================
// PLACEHOLDER CONTENT
//
// None of this file comes from the database — there is no "amenities",
// "attractions", "testimonials", or "contact info" table in the existing
// system, and this task's rules say not to invent new tables for content
// that's really just marketing copy. Everything here is realistic sample
// content so the site looks complete out of the box; replace it with your
// real details before going live. Search this file for "TODO" to find every
// spot that needs a real value.
// ============================================================================

import type { LucideIcon } from "lucide-react";
import { Wifi, UtensilsCrossed, Droplets, Fan, BedDouble, Table2, Armchair, ShirtIcon, ParkingCircle, ShieldCheck, Coffee, Sparkles } from "lucide-react";

export const SITE = {
  name: "Jikmis Apartment",
  tagline: "Premium Serviced Apartments",
  // TODO: replace with your real address
  address: "Thamel, Kathmandu, Nepal",
  // TODO: replace with your real phone number
  phone: "+977-98XXXXXXXX",
  // TODO: replace with your real email
  email: "reservations@jikmisapartment.com",
  // TODO: replace with your real map embed / coordinates
  mapEmbedUrl: "https://www.google.com/maps?q=Thamel,Kathmandu&output=embed",
  openingHours: "Front desk open 24/7",
  social: {
    facebook: "#",
    instagram: "#",
    whatsapp: "#",
  },
};

export interface Amenity {
  icon: LucideIcon;
  label: string;
}

// Matches the amenity list requested for the site. These are building-wide
// amenities (not the same as the `services` table, which is chargeable
// booking add-ons like Laundry/Breakfast/Airport Pickup — those are pulled
// live from the database on the Rooms/Room Details pages instead).
export const AMENITIES: Amenity[] = [
  { icon: Wifi, label: "Free Wi-Fi" },
  { icon: UtensilsCrossed, label: "Kitchen" },
  { icon: Droplets, label: "Solar Hot Water" },
  { icon: Droplets, label: "Geyser" },
  { icon: Fan, label: "Stand Fan" },
  { icon: BedDouble, label: "Comfortable Bed" },
  { icon: Table2, label: "Table" },
  { icon: Armchair, label: "Chair" },
  { icon: ShirtIcon, label: "Hanger" },
  { icon: ParkingCircle, label: "Parking" },
  { icon: ShieldCheck, label: "24/7 Security" },
  { icon: Coffee, label: "Cafe" },
  { icon: Sparkles, label: "Daily Cleaning" },
];

export interface Attraction {
  name: string;
  distance: string;
  description: string;
}

// TODO: replace with the real nearby attractions and walking/driving distances.
export const NEARBY_ATTRACTIONS: Attraction[] = [
  { name: "Thamel Market", distance: "5 min walk", description: "The city's busiest shopping and nightlife district." },
  { name: "Kathmandu Durbar Square", distance: "15 min walk", description: "UNESCO World Heritage royal palace complex." },
  { name: "Garden of Dreams", distance: "8 min walk", description: "A tranquil neo-classical garden in the heart of the city." },
  { name: "Swayambhunath (Monkey Temple)", distance: "20 min drive", description: "Ancient hilltop stupa with panoramic valley views." },
  { name: "Tribhuvan International Airport", distance: "30 min drive", description: "Kathmandu's main airport." },
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
    quote: "Perfect location in Thamel — walking distance to everything. The kitchen let us cook our own meals, which saved so much on a longer stay.",
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
  { title: "Prime Location", description: "Steps away from Kathmandu's best shopping, dining, and cultural sites." },
  { title: "24/7 Front Desk", description: "Our reception team is on hand around the clock for anything you need." },
  { title: "Fully Equipped Apartments", description: "Kitchen, hot water, Wi-Fi, and everyday comforts in every unit." },
];
