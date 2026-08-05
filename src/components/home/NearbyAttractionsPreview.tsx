import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, ArrowRight } from "lucide-react";
import { NEARBY_ATTRACTIONS } from "@/data/content";
import { staggerContainer, staggerItem } from "@/lib/motion";
import { Container, Section, SectionHeading } from "@/components/ui/layout-primitives";
import { Button } from "@/components/ui/button";

export function NearbyAttractionsPreview() {
  return (
    <Section className="bg-slate-50">
      <Container>
        <SectionHeading eyebrow="Nearby" title="Everything Is Close By" align="center" />

        <motion.div
          variants={staggerContainer(80)}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {NEARBY_ATTRACTIONS.map((a) => (
            <motion.div key={a.name} variants={staggerItem} className="rounded-2xl border border-slate-100 bg-white p-6">
              <div className="flex items-start justify-between gap-3">
                <p className="font-display text-lg font-semibold text-navy-900">{a.name}</p>
                <span className="flex shrink-0 items-center gap-1 rounded-full bg-gold-50 px-2.5 py-1 text-xs font-semibold text-gold-700">
                  <MapPin className="h-3 w-3" /> {a.distance}
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">{a.description}</p>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-10 text-center">
          <Link to="/nearby">
            <Button variant="outline">
              Explore the Neighborhood <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </Container>
    </Section>
  );
}
