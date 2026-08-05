import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { PlayCircle, ArrowRight } from "lucide-react";
import { staggerContainer, staggerItem } from "@/lib/motion";
import { TOUR_VIDEOS, getRoomTypeKey } from "@/data/content";
import { useRooms } from "@/hooks/useRooms";
import { Container, Section, SectionHeading } from "@/components/ui/layout-primitives";
import { Button } from "@/components/ui/button";

// Moved here from the About page — this is the site's actual promotional
// video content (one clip per room type), now shown prominently on Home so
// visitors see it before the booking CTA. Same markup, same behavior.
export function VideoTour() {
  const { rooms } = useRooms();

  // Finds a live, bookable room matching this video's room type (e.g. the
  // "Single Studio Room" video matches any live room whose room_type
  // contains "single") so the button can deep-link straight into booking
  // that room. Falls back to the general Rooms page if none is available
  // right now (e.g. temporarily under maintenance).
  function bookingLinkFor(videoTitle: string) {
    const key = getRoomTypeKey(videoTitle);
    const match = key ? rooms.find((r) => getRoomTypeKey(r.room_type) === key && r.status !== "maintenance") : undefined;
    return match ? `/booking?room=${match.id}` : "/rooms";
  }

  return (
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
              <video
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                aria-label={`Video tour of the ${video.title}`}
                className="aspect-[9/16] w-full bg-navy-900 object-cover"
              >
                <source src={video.src} type="video/mp4" />
              </video>
              <div className="px-4 py-3">
                <p className="flex items-center gap-2 text-sm font-medium text-navy-700">
                  <PlayCircle className="h-4 w-4 shrink-0 text-gold-500" /> {video.title}
                </p>
                <Link to={bookingLinkFor(video.title)} className="mt-3 block">
                  <Button size="sm" className="w-full">
                    Book This Room <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </Section>
  );
}
