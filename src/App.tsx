import { Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { SiteLayout } from "@/components/layout/SiteLayout";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Rooms from "@/pages/Rooms";
import RoomDetails from "@/pages/RoomDetails";
import Gallery from "@/pages/Gallery";
import Amenities from "@/pages/Amenities";
import NearbyAttractions from "@/pages/NearbyAttractions";
import Contact from "@/pages/Contact";
import Booking from "@/pages/Booking";
import BookingSuccess from "@/pages/BookingSuccess";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";
import NotFound from "@/pages/NotFound";

export default function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route element={<SiteLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/rooms/:id" element={<RoomDetails />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/amenities" element={<Amenities />} />
          <Route path="/nearby" element={<NearbyAttractions />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/booking-success" element={<BookingSuccess />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </ErrorBoundary>
  );
}
