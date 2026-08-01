import { motion } from "framer-motion";
import { BadgeCheck, MapPinned, Clock3, Sparkles } from "lucide-react";
import { WHY_CHOOSE_US } from "@/data/content";
import { Container, Section, SectionHeading } from "@/components/ui/layout-primitives";
import { staggerContainer, staggerItem } from "@/lib/motion";

const ICONS = [BadgeCheck, MapPinned, Clock3, Sparkles];

export function WhyChooseUs() {
  return (
    <Section className="bg-navy-900 text-white">
      <Container>
        <SectionHeading eyebrow="Why Choose Us" title="The Jikmis Apartment Difference" align="center" className="[&_h2]:text-white [&_p]:text-navy-300" />

        <motion.div
          variants={staggerContainer(100)}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4"
        >
          {WHY_CHOOSE_US.map((item, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <motion.div key={item.title} variants={staggerItem} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 text-navy-900">
                  <Icon className="h-6 w-6" />
                </div>
                <p className="mt-5 font-display text-lg font-semibold">{item.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-navy-300">{item.description}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </Container>
    </Section>
  );
}
