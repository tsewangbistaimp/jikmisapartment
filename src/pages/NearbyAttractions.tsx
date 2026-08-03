import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { NEARBY_ATTRACTIONS, SITE } from "@/data/content";
import { useSEO } from "@/hooks/useSEO";
import { staggerContainer, staggerItem } from "@/lib/motion";
import { Container, Section, SectionHeading } from "@/components/ui/layout-primitives";

export default function NearbyAttractions() {
  useSEO("Nearby Attractions", "Everything worth seeing near Jikmis Apartment, our apartment in Boudha, Kathmandu.");
  return (
    <div>
      <div className="bg-navy-900 pb-16 pt-32 text-center text-white sm:pt-40">
        <Container>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-400">Explore</p>
          <h1 className="mt-3 font-display text-4xl font-semibold sm:text-5xl">Nearby Attractions</h1>
        </Container>
      </div>

      <Section>
        <Container className="max-w-4xl">
          <SectionHeading eyebrow="Around The Neighborhood" title="What's Close By" description={`Everything within easy reach of ${SITE.address}.`} />

          <motion.div
            variants={staggerContainer(80)}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="mt-10 space-y-4"
          >
            {NEARBY_ATTRACTIONS.map((a) => (
              <motion.div
                key={a.name}
                variants={staggerItem}
                className="flex items-start gap-4 rounded-2xl border border-slate-100 p-6 transition-colors hover:border-gold-200"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-navy-50 text-navy-700">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-display text-lg font-semibold text-navy-900">{a.name}</p>
                    <span className="rounded-full bg-gold-50 px-2.5 py-0.5 text-xs font-semibold text-gold-700">{a.distance}</span>
                  </div>
                  <p className="mt-1 text-sm text-slate-500">{a.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </Container>
      </Section>
    </div>
  );
}
