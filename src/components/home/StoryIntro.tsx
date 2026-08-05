import { Container, Section, SectionHeading } from "@/components/ui/layout-primitives";

// A short apartment introduction so first-time visitors get the story
// before anything else — reuses the same copy as the About page's opening
// paragraph, condensed for the homepage.
export function StoryIntro() {
  return (
    <Section>
      <Container className="mx-auto max-w-3xl">
        <SectionHeading
          eyebrow="Welcome to Jikmis"
          title="A Home Away From Home in Boudha"
          align="center"
          description="Jikmis Apartment was built around a simple idea: travelers deserve a place that feels like home, run with the attentiveness of a boutique hotel. Tucked in Boudha, a 3-5 minute walk from Boudhanath Stupa, every apartment is thoughtfully maintained and personally checked before each guest arrives — and we're always just a WhatsApp message or phone call away for anything you need during your stay."
        />
      </Container>
    </Section>
  );
}
