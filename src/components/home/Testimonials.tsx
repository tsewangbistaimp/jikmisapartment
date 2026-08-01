import { motion } from "framer-motion";
import { Star, Quote, ExternalLink } from "lucide-react";
import { TESTIMONIALS, SITE } from "@/data/content";
import { staggerContainer, staggerItem } from "@/lib/motion";
import { Container, Section, SectionHeading } from "@/components/ui/layout-primitives";

export function Testimonials() {
  return (
    <Section className="bg-slate-50">
      <Container>
        <SectionHeading eyebrow="Guest Reviews" title="What Our Guests Say" align="center" />

        <motion.div
          variants={staggerContainer(120)}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3"
        >
          {TESTIMONIALS.map((t) => (
            <motion.div key={t.name} variants={staggerItem} className="relative rounded-3xl bg-white p-8 shadow-sm">
              <Quote className="h-8 w-8 text-gold-200" />
              <p className="mt-4 text-sm leading-relaxed text-slate-600">"{t.quote}"</p>
              <div className="mt-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-navy-900">{t.name}</p>
                  <p className="text-xs text-slate-400">{t.origin}</p>
                </div>
                <div className="flex gap-0.5 text-gold-400">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-current" />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-10 flex justify-center">
          <a
            href={SITE.mapLink}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-navy-700 underline decoration-gold-400 decoration-2 underline-offset-4 hover:text-navy-900"
          >
            Read our reviews on Google Maps <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </Container>
    </Section>
  );
}
