import * as React from "react";
import { useLocation, Outlet } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileTabBar } from "@/components/layout/MobileTabBar";
import { ShakeContact } from "@/components/layout/ShakeContact";
import { pageVariants } from "@/lib/motion";

export function SiteLayout() {
  const location = useLocation();

  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col pb-24 lg:pb-0">
      <Navbar />
      <AnimatePresence mode="wait">
        <motion.main key={location.pathname} variants={pageVariants} initial="initial" animate="animate" exit="exit" className="flex-1">
          <Outlet />
        </motion.main>
      </AnimatePresence>
      <Footer />
      <MobileTabBar />
      <ShakeContact />
    </div>
  );
}
