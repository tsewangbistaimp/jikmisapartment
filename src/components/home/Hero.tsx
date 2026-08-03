import * as React from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/layout-primitives";

// Rooftop shot plus two real room photos, so the hero shows the property
// and the rooms guests are actually booking.
const HERO_IMAGES = [
  { src: "/images/jikmis/gallery/jikmis-rooftop-terrace-view.jpg", alt: "Rooftop terrace at Jikmis Apartment" },
  { src: "/images/jikmis/family-room-living.jpeg", alt: "Family Room living area at Jikmis Apartment" },
  { src: "/images/jikmis/double-studio-lounge.jpeg", alt: "Double Studio lounge at Jikmis Apartment" },
];

const SLIDE_INTERVAL_MS = 5000;

function HeroSlideshow() {
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % HERO_IMAGES.length), SLIDE_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="absolute inset-0">
      <AnimatePresence mode="sync">
        <motion.img
          key={HERO_IMAGES[index].src}
          src={HERO_IMAGES[index].src}
          alt={HERO_IMAGES[index].alt}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.45 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </AnimatePresence>
      <div className="absolute inset-x-0 bottom-8 z-10 flex justify-center gap-2">
        {HERO_IMAGES.map((img, i) => (
          <button
            key={img.src}
            onClick={() => setIndex(i)}
            aria-label={`Show slide ${i + 1}`}
            className={`h-1.5 rounded-full transition-all ${i === index ? "w-6 bg-gold-400" : "w-1.5 bg-white/40"}`}
          />
        ))}
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-navy-900">
      <HeroSlideshow />
      <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/70 to-navy-950/40" />
      <div className="pointer-events-none absolute -right-24 top-24 h-96 w-96 rounded-full bg-gold-500/10 blur-3xl" />

      <Container className="relative z-20 pt-24 text-white">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}>
          <div className="mb-6 flex items-center gap-2 text-gold-400">
            <MapPin className="h-4 w-4" />
            <span className="text-sm text-navy-200">Jikmis Apartment · Boudha, Kathmandu — steps from Boudhanath Stupa</span>
          </div>

          <h1 className="max-w-2xl font-display text-5xl font-semibold leading-[1.1] sm:text-6xl lg:text-7xl">
            Your Apartment in Boudha, <span className="text-gold-400">Steps From the Stupa</span>
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-navy-200">
            Jikmis Apartment offers fully-equipped serviced apartments in Boudha, Kathmandu, designed for comfort whether you're staying a night or a month. Book directly, always at our best rate.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link to="/rooms">
              <Button size="lg" className="w-full sm:w-auto">
                Check Availability <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/about">
              <Button size="lg" variant="outlineLight" className="w-full sm:w-auto">
                Discover More
              </Button>
            </Link>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
