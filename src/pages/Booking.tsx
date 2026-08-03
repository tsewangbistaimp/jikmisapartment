import { useSearchParams } from "react-router-dom";
import { Container, Section } from "@/components/ui/layout-primitives";
import { BookingForm } from "@/components/booking/BookingForm";
import { useSEO } from "@/hooks/useSEO";

export default function Booking() {
  useSEO("Book Online", "Reserve your apartment in Boudha directly with Jikmis Apartment — instant confirmation, best rate guaranteed.");
  const [searchParams] = useSearchParams();
  const roomId = searchParams.get("room") ?? undefined;

  return (
    <div>
      <div className="bg-navy-900 pb-16 pt-32 text-center text-white sm:pt-40">
        <Container>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-400">Reserve Your Stay</p>
          <h1 className="mt-3 font-display text-4xl font-semibold sm:text-5xl">Book Online</h1>
          <p className="mx-auto mt-4 max-w-xl text-navy-200">Instant confirmation, best rate guaranteed, no booking fees.</p>
        </Container>
      </div>

      <Section>
        <Container className="max-w-2xl">
          <BookingForm initialRoomId={roomId} />
        </Container>
      </Section>
    </div>
  );
}
