import { NavLink } from "react-router-dom";
import { Home, BedDouble, Images, Sparkles, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

// App-style floating tab bar shown on phones and tablets only (the top
// navbar's menu is still there). It links to existing pages — nothing new.
const TABS = [
  { to: "/", label: "Home", icon: Home, end: true },
  { to: "/rooms", label: "Rooms", icon: BedDouble },
  { to: "/gallery", label: "Gallery", icon: Images },
  { to: "/amenities", label: "Amenities", icon: Sparkles },
  { to: "/contact", label: "Contact", icon: MessageCircle },
];

export function MobileTabBar() {
  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-3 bottom-3 z-40 flex items-center justify-between rounded-full border border-white/60 bg-white/90 px-3 py-2 shadow-[0_12px_40px_-12px_rgba(28,30,43,0.35)] backdrop-blur-xl lg:hidden"
      style={{ paddingBottom: "calc(0.5rem + env(safe-area-inset-bottom))" }}
    >
      {TABS.map(({ to, label, icon: Icon, end }) => (
        <NavLink key={to} to={to} end={end} aria-label={label} className="flex-1">
          {({ isActive }) => (
            <span className="flex items-center justify-center">
              <span
                className={cn(
                  "flex h-11 w-11 items-center justify-center rounded-full transition-colors",
                  isActive ? "bg-navy-900 text-white" : "text-navy-500"
                )}
              >
                <Icon className="h-5 w-5" strokeWidth={1.75} />
              </span>
            </span>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
