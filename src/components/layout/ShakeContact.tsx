import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Phone, X } from "lucide-react";
import { SITE } from "@/data/content";

// Shake gesture: the phone is flicked right, then left, then right again.
// A single sideways flick makes the sensor swing one way (speeding up) and
// then the other (slowing down), so right-left-right shows up as roughly
// four or more quick direction reversals. We count those reversals on the
// sideways axis within a short window. Uses the browser's DeviceMotion
// sensor, so it only works on phones/tablets over HTTPS; on desktop nothing
// happens. Add ?shakedebug=1 to the URL to see live sensor readings.
const MIN_SWING = 5; // m/s² — smaller movements are ignored as hand jitter
const REVERSALS_NEEDED = 4; // direction flips needed (about right-left-right)
const WINDOW_MS = 1500; // all flips must happen within this time
const MIN_FLIP_GAP_MS = 40; // ignore sensor noise flipping faster than this
const COOLDOWN_MS = 3000; // after opening, ignore further shakes briefly
// Number shown and dialled by the "Call us" button (WhatsApp keeps SITE.phone).
const CALL_NUMBER_DISPLAY = "+977 9863594966";
const CALL_NUMBER_TEL = "tel:+9779863594966";
const IOS_DENIED_KEY = "jikmis-shake-permission-denied";

type MotionWithPermission = typeof DeviceMotionEvent & { requestPermission?: () => Promise<"granted" | "denied"> };

export function ShakeContact() {
  const [open, setOpen] = React.useState(false);
  const [debug, setDebug] = React.useState<string | null>(null);
  const flips = React.useRef<number[]>([]);
  const lastSign = React.useRef(0);
  const lastOpen = React.useRef(0);
  const gravity = React.useRef({ x: 0, y: 0 });
  const events = React.useRef(0);
  const showDebug = typeof window !== "undefined" && window.location.search.includes("shakedebug");

  // Attach the motion listener (only if the sensor exists).
  React.useEffect(() => {
    if (typeof window === "undefined" || !("DeviceMotionEvent" in window)) {
      if (showDebug) setDebug("No DeviceMotionEvent in this browser");
      return;
    }

    const onMotion = (e: DeviceMotionEvent) => {
      events.current += 1;
      // Prefer acceleration without gravity. Some phones don't provide it, so
      // fall back to the gravity-included value with gravity filtered out.
      const lin = e.acceleration;
      const g = e.accelerationIncludingGravity;
      let x = 0;
      let y = 0;
      if (lin && lin.x != null && lin.y != null) {
        x = lin.x;
        y = lin.y;
      } else if (g && g.x != null && g.y != null) {
        gravity.current.x = 0.8 * gravity.current.x + 0.2 * g.x;
        gravity.current.y = 0.8 * gravity.current.y + 0.2 * g.y;
        x = g.x - gravity.current.x;
        y = g.y - gravity.current.y;
      } else {
        return;
      }
      // Sideways axis: whichever of x/y is moving more (covers landscape too).
      const v = Math.abs(x) >= Math.abs(y) ? x : y;
      if (showDebug && events.current % 5 === 0) {
        setDebug(`events ${events.current} · v ${v.toFixed(1)} · flips ${flips.current.length}`);
      }
      if (Math.abs(v) < MIN_SWING) return;

      const now = Date.now();
      if (now - lastOpen.current < COOLDOWN_MS) return;
      const sign = v > 0 ? 1 : -1;
      if (sign === lastSign.current) return;
      lastSign.current = sign;

      const recent = flips.current.filter((t) => now - t < WINDOW_MS);
      const last = recent[recent.length - 1];
      if (last !== undefined && now - last < MIN_FLIP_GAP_MS) {
        flips.current = recent;
        return;
      }
      recent.push(now);
      flips.current = recent;

      if (recent.length >= REVERSALS_NEEDED) {
        flips.current = [];
        lastSign.current = 0;
        lastOpen.current = now;
        setOpen(true);
      }
    };

    window.addEventListener("devicemotion", onMotion);
    return () => window.removeEventListener("devicemotion", onMotion);
  }, [showDebug]);

  // iPhones only deliver motion events after the visitor grants permission,
  // and the browser only allows asking from a tap. So on iOS we ask once, on
  // the first tap anywhere on the page. (Android and others skip this.)
  React.useEffect(() => {
    const DME = (typeof window !== "undefined" ? (window as unknown as { DeviceMotionEvent?: MotionWithPermission }).DeviceMotionEvent : undefined);
    if (!DME || typeof DME.requestPermission !== "function") return;
    let denied = false;
    try {
      denied = window.localStorage.getItem(IOS_DENIED_KEY) === "1";
    } catch {
      /* storage unavailable */
    }
    if (denied) return;

    const ask = () => {
      DME.requestPermission?.()
        .then((state) => {
          if (state !== "granted") {
            try {
              window.localStorage.setItem(IOS_DENIED_KEY, "1");
            } catch {
              /* ignore */
            }
          }
        })
        .catch(() => {});
    };
    window.addEventListener("click", ask, { once: true });
    return () => window.removeEventListener("click", ask);
  }, []);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);


  return (
    <>
      {showDebug && (
        <div className="fixed left-2 top-2 z-[80] rounded bg-black/80 px-2 py-1 text-[11px] text-white">
          shake debug: {debug ?? "waiting for sensor… (iPhone: tap the page once and allow motion)"}
        </div>
      )}
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-end justify-center bg-black/40 p-4 sm:items-center"
          onClick={() => setOpen(false)}
        >
          <motion.div
            role="dialog"
            aria-label="Contact Jikmis Apartment"
            initial={{ y: 40, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-sm rounded-3xl bg-white p-5 shadow-2xl"
          >
            <button
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100"
            >
              <X className="h-4 w-4" />
            </button>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-500">Get in touch</p>
            <h2 className="mt-1 font-display text-xl font-semibold text-navy-900">Contact Jikmis Apartment</h2>
            <p className="mt-1 text-sm text-slate-500">Reach us anytime via WhatsApp or call.</p>

            <div className="mt-4 space-y-3">
              <a
                href={SITE.social.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-emerald-50 px-4 py-3 transition-colors hover:bg-emerald-100"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-white">
                  <MessageCircle className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-slate-900">WhatsApp</span>
                  <span className="block text-xs text-slate-500">{SITE.phone}</span>
                </span>
              </a>
              <a
                href={CALL_NUMBER_TEL}
                className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-navy-50 px-4 py-3 transition-colors hover:bg-navy-100"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-navy-900 text-white">
                  <Phone className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-slate-900">Call us</span>
                  <span className="block text-xs text-slate-500">{CALL_NUMBER_DISPLAY}</span>
                </span>
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
}
