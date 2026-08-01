import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { AMENITIES } from "@/data/content";
import { staggerContainer, staggerItem } from "@/lib/motion";
import { Container, Section, SectionHeading } from "@/components/ui/layout-primitives";
import { Button } from "@/components/ui/button";

export function AmenitiesPreview() {
  return (
    <Section>
      <Container>
        <SectionHeading eyebrow="Amenities" title="Everything You Need, Included" align="center" />

        <motion.div
          variants={staggerContainer(60)}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-80px" }}
          className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
        >
          {AMENITIES.map((a) => (
            <motion.div
              key={a.label}
              variants={staggerItem}
              className="flex flex-col items-center gap-3 rounded-2xl border border-slate-100 p-6 text-center transition-colors hover:border-gold-200 hover:bg-gold-50/40"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-navy-50 text-navy-700">
                <a.icon className="h-5 w-5" />
              </div>
              <p className="text-sm font-medium text-navy-800">{a.label}</p>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-10 text-center">
          <Link to="/amenities">
            <Button variant="outline">
              View All Amenities <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </Container>
    </Section>
  );
}
