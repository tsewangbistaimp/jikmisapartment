import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Compass } from "lucide-react";
import { fadeUp } from "@/lib/motion";
import { Button } from "@/components/ui/button";
import { useSEO } from "@/hooks/useSEO";

export default function NotFound() {
  useSEO("Page Not Found");
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-navy-900 px-4 text-center text-white">
      <motion.div variants={fadeUp} initial="initial" animate="animate" className="flex flex-col items-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 text-navy-900">
          <Compass className="h-8 w-8" />
        </div>
        <p className="mt-6 font-display text-6xl font-semibold">404</p>
        <p className="mt-2 text-lg text-navy-200">This page doesn't exist.</p>
        <Link to="/" className="mt-8">
          <Button>Back to Home</Button>
        </Link>
      </motion.div>
    </div>
  );
}
