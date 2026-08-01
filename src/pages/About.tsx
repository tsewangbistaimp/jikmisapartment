import { motion } from "framer-motion";
import { CheckCircle2, PlayCircle } from "lucide-react";
import { fadeUp, staggerContainer, staggerItem } from "@/lib/motion";
import { WHY_CHOOSE_US, TOUR_VIDEOS } from "@/data/content";
import { useSEO } from "@/hooks/useSEO";
import { Container, Section, SectionHeading } from "@/components/ui/layout-primitives";

const ABOUT_IMAGE = "/images/jikmis/gallery/jikmis-rooftop-stupa-sunset.jpg";

export default function About() {
  useSEO("About Us", "Learn about Jikmis Apartment — comfortable, fully-equipped serviced apartments with a personal touch.");
  return (
    <div>
      <div className="bg-navy-900 pb-16 pt-32 text-center text-white sm:pt-40">
        <Container>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-400">About Us</p>
          <h1 className="mt-3 font-display text-4xl font-semibold sm:text-5xl">The Jikmis Apartment Story</h1>
        </Container>
      </div>

      <Section>
        <Container className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <motion.div variants={fadeUp} initial="initial" whileInView="animate" viewport={{ once: true }}>
            <SectionHeading
              eyebrow="Our Story"
              title="Comfort, Consistency, and a Personal Touch"
              description={
                <>
                  Jikmis Apartment was built around a simple idea: travelers deserve a place that feels like home, run with the
                  attentiveness of a boutique hotel. Tucked in Boudha, a 5-10 minute walk from Boudhanath Stupa, every apartment is
                  thoughtfully maintained and personally checked before each guest arrives — and we're always just a WhatsApp
                  message or phone call away for anything you need during your stay.
                </>
              }
            />
            <ul className="mt-6 space-y-3">
              {WHY_CHOOSE_US.map((item) => (
                <li key={item.title} className="flex items-start gap-3 text-sm text-slate-600">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-gold-500" />
                  <span>
                    <span className="font-medium text-navy-800">{item.title}.</span> {item.description}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="overflow-hidden rounded-3xl shadow-xl"
          >
            <img src={ABOUT_IMAGE} alt="Rooftop view of Boudhanath Stupa at sunset from Jikmis Apartment" className="h-full w-full object-cover" />
          </motion.div>
        </Container>
      </Section>

      <Section className="bg-navy-50/50">
        <Container>
          <SectionHeading
            eyebrow="Video Tour"
            title="Take a Look Around"
            description="A quick video walkthrough of Jikmis Apartment, filmed on-site."
            align="center"
          />
          <motion.div
            variants={staggerContainer(80)}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3"
          >
            {TOUR_VIDEOS.map((video) => (
              <motion.div key={video.src} variants={staggerItem} className="overflow-hidden rounded-2xl bg-navy-900 shadow-lg">
                <video controls preload="none" className="aspect-[9/16] w-full bg-navy-900 object-cover">
                  <source src={video.src} type="video/mp4" />
                </video>
                <p className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-navy-700">
                  <PlayCircle className="h-4 w-4 shrink-0 text-gold-500" /> {video.title}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </Container>
      </Section>
    </div>
  );
}
