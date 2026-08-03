import { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { PageSpinner } from "@/components/ui/misc";
import { lazyWithRetry } from "@/lib/lazy-retry";

// lazyWithRetry (not React.lazy directly) so a stale chunk right after a new
// deploy triggers one automatic reload instead of a blank screen — see
// src/lib/lazy-retry.ts. Splitting these out of the main bundle means a
// first-time visitor to the homepage no longer downloads the entire site
// (booking form, calendar logic, every other page) before seeing anything —
// same routes, same components, same behavior, just loaded on demand.
const Home = lazyWithRetry(() => import("@/pages/Home"));
const About = lazyWithRetry(() => import("@/pages/About"));
const Rooms = lazyWithRetry(() => import("@/pages/Rooms"));
const RoomDetails = lazyWithRetry(() => import("@/pages/RoomDetails"));
const Gallery = lazyWithRetry(() => import("@/pages/Gallery"));
const Amenities = lazyWithRetry(() => import("@/pages/Amenities"));
const NearbyAttractions = lazyWithRetry(() => import("@/pages/NearbyAttractions"));
const JimkisFarmDonkhang = lazyWithRetry(() => import("@/pages/JimkisFarmDonkhang"));
const Contact = lazyWithRetry(() => import("@/pages/Contact"));
const Booking = lazyWithRetry(() => import("@/pages/Booking"));
const BookingSuccess = lazyWithRetry(() => import("@/pages/BookingSuccess"));
const Privacy = lazyWithRetry(() => import("@/pages/Privacy"));
const Terms = lazyWithRetry(() => import("@/pages/Terms"));
const NotFound = lazyWithRetry(() => import("@/pages/NotFound"));

export default function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<PageSpinner />}>
        <Routes>
          <Route element={<SiteLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/rooms/:id" element={<RoomDetails />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/amenities" element={<Amenities />} />
            <Route path="/nearby" element={<NearbyAttractions />} />
            <Route path="/jimkis-farm-donkhang" element={<JimkisFarmDonkhang />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/booking-success" element={<BookingSuccess />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}
