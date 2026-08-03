import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, DoorClosed } from "lucide-react";
import { useRooms } from "@/hooks/useRooms";
import { useSEO } from "@/hooks/useSEO";
import { staggerContainer, staggerItem, scaleFade, fadeIn } from "@/lib/motion";
import { Container, Section, SectionHeading } from "@/components/ui/layout-primitives";
import { PageSpinner, EmptyState } from "@/components/ui/misc";
import { PROPERTY_GALLERY } from "@/data/content";

export default function Gallery() {
  useSEO("Gallery", "Browse real photos of Jikmis Apartment, our serviced apartment in Boudha — rooms, cafe, and rooftop.");
  const { rooms, loading } = useRooms();
  const [active, setActive] = React.useState<{ url: string; caption: string } | null>(null);

  const images = rooms.filter((r) => r.image_url).map((r) => ({ url: r.image_url as string, caption: `Room ${r.room_number} — ${r.room_type}` }));

  return (
    <div>
      <div className="bg-navy-900 pb-16 pt-32 text-center text-white sm:pt-40">
        <Container>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-400">Gallery</p>
          <h1 className="mt-3 font-display text-4xl font-semibold sm:text-5xl">A Closer Look</h1>
          <p className="mx-auto mt-4 max-w-xl text-navy-200">Real photos of our apartments, straight from our room listings.</p>
        </Container>
      </div>

      <Section>
        <Container>
          {loading ? (
            <PageSpinner />
          ) : images.length === 0 ? (
            <EmptyState title="No photos yet" description="Photos are added by our team as rooms are photographed." />
          ) : (
            <motion.div
              variants={staggerContainer(60)}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="columns-1 gap-4 sm:columns-2 lg:columns-3"
            >
              {images.map((img, i) => (
                <motion.button
                  key={i}
                  variants={staggerItem}
                  onClick={() => setActive(img)}
                  className="mb-4 block w-full overflow-hidden rounded-2xl"
                >
                  <img src={img.url} alt={img.caption} loading="lazy" className="w-full transition-transform duration-500 hover:scale-105" />
                </motion.button>
              ))}
            </motion.div>
          )}

          {!loading && images.length === 0 && (
            <div className="mt-10 flex justify-center text-slate-300">
              <DoorClosed className="h-12 w-12" />
            </div>
          )}
        </Container>
      </Section>

      <Section className="bg-navy-50/50">
        <Container>
          <SectionHeading
            eyebrow="Around The Property"
            title="Cafe, Rooftop & Common Areas"
            description="A closer look at the shared spaces at Jikmis Apartment."
          />
          <motion.div
            variants={staggerContainer(50)}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="mt-10 columns-1 gap-4 sm:columns-2 lg:columns-3"
          >
            {PROPERTY_GALLERY.map((img, i) => (
              <motion.button
                key={i}
                variants={staggerItem}
                onClick={() => setActive(img)}
                className="mb-4 block w-full overflow-hidden rounded-2xl"
              >
                <img src={img.url} alt={img.caption} loading="lazy" className="w-full transition-transform duration-500 hover:scale-105" />
              </motion.button>
            ))}
          </motion.div>
        </Container>
      </Section>

      <AnimatePresence>
        {active && (
          <motion.div
            variants={fadeIn}
            initial="initial"
            animate="animate"
            exit="initial"
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 p-4"
            onClick={() => setActive(null)}
          >
            <motion.div variants={scaleFade} initial="initial" animate="animate" exit="exit" className="relative max-h-[85vh] max-w-3xl">
              <img src={active.url} alt={active.caption} className="max-h-[85vh] rounded-2xl object-contain" />
              <p className="mt-3 text-center text-sm text-white/80">{active.caption}</p>
              <button
                onClick={() => setActive(null)}
                aria-label="Close"
                className="absolute -top-4 right-0 flex h-9 w-9 items-center justify-center rounded-full bg-white text-navy-900"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
