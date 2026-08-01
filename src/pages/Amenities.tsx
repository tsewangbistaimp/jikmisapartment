import { motion } from "framer-motion";
import { useServices } from "@/hooks/useServices";
import { useSEO } from "@/hooks/useSEO";
import { AMENITIES } from "@/data/content";
import { formatCurrency, cn } from "@/lib/utils";
import { staggerContainer, staggerItem } from "@/lib/motion";
import { Container, Section, SectionHeading } from "@/components/ui/layout-primitives";
import { Skeleton } from "@/components/ui/misc";

export default function Amenities() {
  useSEO("Amenities", "Wi-Fi, kitchen, hot water, and everything you need — plus optional add-on services.");
  const { services, loading } = useServices();

  return (
    <div>
      <div className="bg-navy-900 pb-16 pt-32 text-center text-white sm:pt-40">
        <Container>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-400">Amenities</p>
          <h1 className="mt-3 font-display text-4xl font-semibold sm:text-5xl">Everything You Need</h1>
        </Container>
      </div>

      <Section>
        <Container>
          <SectionHeading eyebrow="Included in Every Stay" title="Apartment Amenities" align="center" />
          <motion.div
            variants={staggerContainer(50)}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
          >
            {AMENITIES.map((a) => (
              <motion.div key={a.label} variants={staggerItem} className="flex flex-col items-center gap-3 rounded-2xl border border-slate-100 p-6 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-navy-50 text-navy-700">
                  <a.icon className="h-5 w-5" />
                </div>
                <p className="text-sm font-medium text-navy-800">{a.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </Container>
      </Section>

      <Section className="bg-slate-50">
        <Container>
          <SectionHeading eyebrow="Available on Request" title="Optional Add-on Services" align="center" description="Arrange these directly with our front desk during your stay." />
          <div className={cn("mx-auto mt-12 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-2", loading && "opacity-60")}>
            {loading
              ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)
              : services.map((s) => (
                  <div key={s.id} className="flex items-center justify-between rounded-2xl bg-white p-5 shadow-sm">
                    <span className="font-medium text-navy-800">{s.name}</span>
                    <span className="font-display font-semibold text-gold-600">{formatCurrency(s.price)}</span>
                  </div>
                ))}
          </div>
        </Container>
      </Section>
    </div>
  );
}
