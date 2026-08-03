import { motion } from "framer-motion";
import { Phone, Globe, Home as HomeIcon, Leaf, Apple, Truck } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";
import { staggerContainer, staggerItem } from "@/lib/motion";
import { Container, Section, SectionHeading } from "@/components/ui/layout-primitives";

const DONKHANG_CARD = {
  title: "Jikmi's Donkhang — Apartment & Cafe",
  description: "Comfort. Hospitality. A home away from home — right by Boudhanath Stupa.",
  icon: HomeIcon,
  items: [
    { icon: Phone, label: "9843804385 / 9708538395" },
    { icon: HomeIcon, label: "Boudha Srijana Tole, Kathmandu" },
  ],
};

const FARM_CARD = {
  title: "Jimki's Farm — Mustang Apple & Alu Supply",
  description: "Quality produce straight from the highlands of Mustang.",
  icon: Leaf,
  items: [
    { icon: Phone, label: "9849278045 / 9843804385" },
    { icon: Globe, label: "Fresh from our farm, delivered locally" },
  ],
};

const FARM_HIGHLIGHTS = [
  { icon: Leaf, label: "Fresh From Our Farm" },
  { icon: Apple, label: "Natural & Healthy" },
  { icon: Truck, label: "Supporting Local Farmers" },
];

export default function JimkisFarmDonkhang() {
  useSEO(
    "Jimki's Farm & Donkhang",
    "Jikmi's Donkhang Apartment & Cafe in Boudha, and Jimki's Farm — Mustang apple and potato supply from the highlands."
  );

  return (
    <div>
      <div className="bg-navy-900 pb-16 pt-32 text-center text-white sm:pt-40">
        <Container>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-400">Our Partners</p>
          <h1 className="mt-3 font-display text-4xl font-semibold sm:text-5xl">Jimki's Farm & Donkhang</h1>
          <p className="mx-auto mt-4 max-w-2xl text-navy-300">
            Two family businesses under one name — a cozy apartment & cafe in Boudha, and quality Mustang
            produce supplied straight from the highlands.
          </p>
        </Container>
      </div>

      <Section>
        <Container className="max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="overflow-hidden rounded-3xl shadow-lg"
          >
            <img
              src="/images/promo/jimkis-farm-donkhang.jpg"
              alt="Jikmi's Donkhang Apartment & Cafe in Boudha, and Jimki's Farm Mustang apple and potato supply"
              className="w-full"
              loading="lazy"
            />
          </motion.div>

          <SectionHeading
            className="mt-16"
            eyebrow="Get In Touch"
            title="Reach Either Business Directly"
            description="Whether you're booking a stay or sourcing fresh Mustang produce, here's how to reach us."
            align="center"
          />

          <motion.div
            variants={staggerContainer(80)}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2"
          >
            {[DONKHANG_CARD, FARM_CARD].map((card) => (
              <motion.div
                key={card.title}
                variants={staggerItem}
                className="rounded-2xl border border-slate-100 p-6 transition-colors hover:border-gold-200"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-navy-50 text-navy-700">
                  <card.icon className="h-5 w-5" />
                </div>
                <p className="mt-4 font-display text-lg font-semibold text-navy-900">{card.title}</p>
                <p className="mt-1 text-sm text-slate-500">{card.description}</p>
                <ul className="mt-4 space-y-2">
                  {card.items.map((item) => (
                    <li key={item.label} className="flex items-center gap-2.5 text-sm text-slate-600">
                      <item.icon className="h-4 w-4 shrink-0 text-gold-500" />
                      {item.label}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 rounded-2xl bg-navy-50 px-6 py-8 text-center sm:flex-row sm:justify-around sm:text-left">
            {FARM_HIGHLIGHTS.map((h) => (
              <div key={h.label} className="flex items-center gap-2.5 text-sm font-medium text-navy-800">
                <h.icon className="h-4 w-4 text-gold-600" />
                {h.label}
              </div>
            ))}
          </div>
        </Container>
      </Section>
    </div>
  );
}
