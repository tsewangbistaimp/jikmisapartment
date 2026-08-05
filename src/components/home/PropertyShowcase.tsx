import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { PROPERTY_GALLERY } from "@/data/content";
import { staggerContainer, staggerItem } from "@/lib/motion";
import { Container, Section, SectionHeading } from "@/components/ui/layout-primitives";
import { Button } from "@/components/ui/button";

// A curated slice of the real property gallery — rooftop views and the
// surrounding property — so Home gives visitors a genuine feel for the
// place before asking anyone to book. The full set lives on the Gallery
// page; no new images or content, just reusing what's already there.
const SHOWCASE_PHOTOS = PROPERTY_GALLERY.slice(0, 6);

export function PropertyShowcase() {
  return (
    <Section>
      <Container>
        <SectionHeading
          eyebrow="Around Jikmis"
          title="Rooftop Views & Everyday Moments"
          description="A real look at the rooftop, the surrounding neighborhood, and life around the property."
          align="center"
        />
        <motion.div
          variants={staggerContainer(60)}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3"
        >
          {SHOWCASE_PHOTOS.map((photo) => (
            <motion.div key={photo.url} variants={staggerItem} className="group aspect-square overflow-hidden rounded-2xl">
              <img
                src={photo.url}
                alt={photo.caption}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-10 text-center">
          <Link to="/gallery">
            <Button variant="outline">
              View Full Gallery <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </Container>
    </Section>
  );
}
