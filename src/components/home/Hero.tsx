import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/layout-primitives";

const HERO_IMAGE = "/images/jikmis/gallery/jikmis-rooftop-terrace-view.jpg";

export function Hero() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-navy-900">
      <img src={HERO_IMAGE} alt="Rooftop terrace at Jikmis Apartment" className="absolute inset-0 h-full w-full object-cover opacity-45" />
      <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/70 to-navy-950/40" />
      <div className="pointer-events-none absolute -right-24 top-24 h-96 w-96 rounded-full bg-gold-500/10 blur-3xl" />

      <Container className="relative pt-24 text-white">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}>
          <div className="mb-6 flex items-center gap-2 text-gold-400">
            <MapPin className="h-4 w-4" />
            <span className="text-sm text-navy-200">Boudha, Kathmandu — steps from Boudhanath Stupa</span>
          </div>

          <h1 className="max-w-2xl font-display text-5xl font-semibold leading-[1.1] sm:text-6xl lg:text-7xl">
            A Refined Stay, <span className="text-gold-400">Steps From the Stupa</span>
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-navy-200">
            Fully-equipped serviced apartments designed for comfort, whether you're staying a night or a month. Book directly, always at our best rate.
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
