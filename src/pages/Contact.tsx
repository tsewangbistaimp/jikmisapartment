import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react";
import { contactFormSchema, type ContactFormValues } from "@/lib/schemas";
import { SITE } from "@/data/content";
import { fadeUp } from "@/lib/motion";
import { useSEO } from "@/hooks/useSEO";
import { Container, Section, SectionHeading } from "@/components/ui/layout-primitives";
import { Label, Input, Textarea, FieldError } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Contact() {
  useSEO("Contact Us", "Get in touch with Jikmis Apartment for reservations and inquiries.");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({ resolver: zodResolver(contactFormSchema) });

  // NOTE: there's no "contact_messages" table in the existing database, and
  // this task's rules say not to invent new backend tables/logic without a
  // clear need. This form validates input and shows a confirmation, but does
  // not yet deliver the message anywhere — wire it up to an email service
  // (e.g. a Supabase Edge Function that sends via Resend/SendGrid) or a new,
  // explicitly-approved table before relying on it for real inquiries.
  const onSubmit = handleSubmit(async () => {
    await new Promise((r) => setTimeout(r, 600));
    toast.success("Message received — we'll get back to you shortly.");
    reset();
  });

  return (
    <div>
      <div className="bg-navy-900 pb-16 pt-32 text-center text-white sm:pt-40">
        <Container>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-400">Get In Touch</p>
          <h1 className="mt-3 font-display text-4xl font-semibold sm:text-5xl">Contact Us</h1>
        </Container>
      </div>

      <Section>
        <Container className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <motion.div variants={fadeUp} initial="initial" whileInView="animate" viewport={{ once: true }}>
            <SectionHeading eyebrow="Reach Out" title="We'd Love to Hear From You" description="Questions about a stay, group bookings, or anything else — send us a message or call directly." />

            <ul className="mt-8 space-y-4 text-sm text-slate-600">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-gold-500" /> {SITE.address}
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 shrink-0 text-gold-500" /> {SITE.phone}
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 shrink-0 text-gold-500" /> {SITE.email}
              </li>
              <li className="flex items-center gap-3">
                <Clock className="h-5 w-5 shrink-0 text-gold-500" /> {SITE.openingHours}
              </li>
            </ul>

            <a href={SITE.social.whatsapp} target="_blank" rel="noreferrer" className="mt-6 inline-block">
              <Button variant="outline" size="sm">
                <MessageCircle className="h-4 w-4" /> Chat on WhatsApp
              </Button>
            </a>

            <div className="mt-8 overflow-hidden rounded-3xl border border-slate-100 shadow-lg">
              <iframe title="Map" src={SITE.mapEmbedUrl} className="h-64 w-full" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            </div>
          </motion.div>

          <motion.form
            variants={fadeUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            onSubmit={onSubmit}
            className="space-y-4 rounded-3xl border border-slate-100 p-6 shadow-lg sm:p-8"
          >
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" {...register("name")} />
              <FieldError message={errors.name?.message} />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register("email")} />
              <FieldError message={errors.email?.message} />
            </div>
            <div>
              <Label htmlFor="phone">Phone (optional)</Label>
              <Input id="phone" {...register("phone")} />
            </div>
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" rows={5} {...register("message")} />
              <FieldError message={errors.message?.message} />
            </div>
            <Button type="submit" className="w-full" loading={isSubmitting}>
              Send Message
            </Button>
          </motion.form>
        </Container>
      </Section>
    </div>
  );
}
