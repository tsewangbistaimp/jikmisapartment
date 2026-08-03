import * as React from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  { to: "/", label: "Home", end: true },
  { to: "/about", label: "About" },
  { to: "/rooms", label: "Rooms" },
  { to: "/gallery", label: "Gallery" },
  { to: "/amenities", label: "Amenities" },
  { to: "/jimkis-farm-donkhang", label: "Partners" },
  { to: "/contact", label: "Contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  React.useEffect(() => setMobileOpen(false), [location.pathname]);

  const solid = scrolled || !isHome;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        solid ? "glass-surface shadow-sm" : "bg-transparent"
      )}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2.5">
          <span
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-navy-600 to-navy-800 text-gold-300 shadow-sm"
            )}
          >
            <Building2 className="h-5 w-5" />
          </span>
          <span className={cn("font-display text-lg font-semibold tracking-wide", solid ? "text-navy-900" : "text-white")}>
            Jikmis Apartment
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                cn(
                  "text-sm font-medium tracking-wide transition-colors",
                  solid ? "text-navy-700 hover:text-gold-600" : "text-white/90 hover:text-white",
                  isActive && (solid ? "text-gold-600" : "text-white")
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Link to="/rooms">
            <Button size="sm">Book Now</Button>
          </Link>
        </div>

        <button
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
          className={cn("flex h-10 w-10 items-center justify-center rounded-full lg:hidden", solid ? "text-navy-800" : "text-white")}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden bg-white shadow-lg lg:hidden"
          >
            <nav className="flex flex-col gap-1 px-4 pb-6 pt-2">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) =>
                    cn(
                      "rounded-xl px-3 py-3 text-sm font-medium text-navy-700",
                      isActive && "bg-navy-50 text-gold-600"
                    )
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              <Link to="/rooms" className="mt-2">
                <Button className="w-full">Book Now</Button>
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
