import { motion } from "framer-motion";
import { BadgeCheck, MapPinned, Clock3, Sparkles } from "lucide-react";
import { WHY_CHOOSE_US } from "@/data/content";
import { Container, Section, SectionHeading } from "@/components/ui/layout-primitives";
import { staggerContainer, staggerItem } from "@/lib/motion";

const ICONS = [BadgeCheck, MapPinned, Clock3, Sparkles];

export function WhyChooseUs() {
  return (
    <Section className="bg-transparent">
      <Container>
        <SectionHeading eyebrow="Why Choose Us" title="The Jikmis Apartment Difference" align="center" />

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
              <motion.div key={item.title} variants={staggerItem} className="soft-card rounded-3xl p-6 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center text-gold-500">
                  <Icon className="h-9 w-9" strokeWidth={1.25} />
                </div>
                <p className="mt-4 font-display text-xl font-semibold text-navy-900">{item.title}</p>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{item.description}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </Container>
    </Section>
  );
}
