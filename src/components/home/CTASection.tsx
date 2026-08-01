import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/layout-primitives";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-navy-800 to-navy-950 py-20 text-center text-white">
      <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-gold-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-10 h-72 w-72 rounded-full bg-gold-500/10 blur-3xl" />
      <Container className="relative">
        <h2 className="font-display text-3xl font-semibold sm:text-4xl">Ready for Your Stay?</h2>
        <p className="mx-auto mt-3 max-w-md text-navy-300">Book directly with us for instant confirmation and the best available rate — every time.</p>
        <Link to="/rooms" className="mt-8 inline-block">
          <Button size="lg">
            Check Availability <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </Container>
    </section>
  );
}
