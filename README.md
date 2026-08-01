# Jikmis Apartment — Guest Booking Website

Public, guest-facing booking site for Jikmis Apartment. This is a **separate app** from
the admin dashboard (`jikmis-apartment/`) but connects to the **same Supabase project** —
no new backend, no duplicate tables. It only reads `rooms`/`services` and writes bookings
through one new database function, `create_public_booking()`.

## 1. Before you deploy: run the migration

The admin repo's `supabase/migrations/20260801070000_public_booking_website.sql` must be
run against your real Supabase project first. It is 100% additive:

- Adds two `select`-only RLS policies so anonymous visitors can read `rooms` and active
  `services`. Existing staff policies on those tables are untouched (Postgres combines
  multiple permissive policies with OR).
- Adds `create_public_booking(...)`, a `SECURITY DEFINER` function — the only way this
  site can create a booking. It re-validates guest info and dates server-side, computes
  the total from the room's real price in the database (the frontend never calculates
  price), sets `booking_source = 'website'`, and relies on the existing
  `no_overlapping_room_bookings` exclusion constraint as the final double-booking guard.
- Grants `execute` on that function to `anon`/`authenticated` only — no direct `insert`
  grant on `bookings` or `guests` is given to the public.

Run it via the Supabase SQL editor or `supabase db push`. Nothing in the admin app changes.

## 2. Environment variables

Copy `.env.example` to `.env` and fill in:

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

These **must be the same project** as the admin app's `.env` — this site reads/writes the
same database, just through the restricted anonymous policies above.

## 3. Install & run

```
npm install
npm run dev       # local dev server
npm run build     # tsc -b && vite build — verified clean, 0 errors/warnings
npm run lint      # oxlint — 0 warnings
```

## 4. Placeholder content to replace before launch

Everything below is realistic sample content, not real business data. There are no
`amenities`/`nearby_attractions`/`testimonials`/`contact` tables in the schema, so these
live in `src/data/content.ts` as static data (per the "don't add tables for marketing
copy" rule) — search that file for `TODO` to find every spot:

- `SITE.address`, `SITE.phone`, `SITE.email` — currently Thamel/placeholder values
- `SITE.mapEmbedUrl` — currently a generic Google Maps search embed for Thamel
- `SITE.social.facebook` / `.instagram` / `.whatsapp` — currently `#`
- `NEARBY_ATTRACTIONS` — 5 sample Kathmandu/Thamel entries
- `TESTIMONIALS` — 3 sample guest reviews
- Hero/About imagery — currently pulled from `room-images` storage bucket; add
  dedicated marketing photos if you want imagery beyond actual room photos
- `Terms.tsx` cancellation policy — the system has no automated cancellation logic;
  the copy asks guests to contact the property directly. Replace with your real policy.

Everything else — rooms, prices, availability, booking creation — is live data from the
real database, same as the admin dashboard sees.

## 5. Deploy to Vercel

Create a **new** Vercel project pointed at this `jikmis-website/` folder (do not reuse the
admin app's Vercel project). `vercel.json` already has the SPA rewrite. Add the two env
vars from step 2 in the Vercel project settings.

## 6. What was verified

- `npx tsc -b` — 0 errors
- `npx vite build` — succeeds (single warning about the main JS chunk being ~230KB
  gzipped, which is normal for a framer-motion + react-router + supabase-js bundle and
  not an error; code-splitting can be added later with `React.lazy` per route if desired)
- `npx oxlint` — 0 warnings, 0 errors
- Admin app (`jikmis-apartment/`) — confirmed no source files were modified during this
  build; only the new additive migration file was added; admin app still compiles clean
- **Not yet verified**: an actual live booking end-to-end against a real Supabase
  database, since no live credentials exist in the build environment. Once you add real
  `.env` values and run the migration, test one real booking on the `/booking` page and
  confirm it appears in the admin Bookings table with `booking_source = website`.

## Project structure

```
src/
  components/    layout (Navbar/Footer/SiteLayout), ui primitives, home sections,
                 rooms (RoomCard), booking (BookingForm)
  data/          content.ts — static marketing content (see section 4)
  hooks/         useRooms, useServices, useCreateBooking, useSEO
  lib/           supabase client, database.types (public-safe subset only),
                 schemas (zod), motion (framer-motion variants), utils
  pages/         Home, About, Rooms, RoomDetails, Gallery, Amenities,
                 NearbyAttractions, Contact, Booking, BookingSuccess,
                 Privacy, Terms, NotFound
```
