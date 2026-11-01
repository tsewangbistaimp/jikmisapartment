import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Phone, X } from "lucide-react";
import { SITE } from "@/data/content";

// Shake gesture: the phone is flicked right, then left, then right again
// (three alternating sideways strokes inside a short window). Uses the
// browser's DeviceMotion sensor, so it only works on phones/tablets over
// HTTPS; on desktop nothing happens and nothing is shown.
const STROKE_THRESHOLD = 9; // m/s² of sideways acceleration that counts as a stroke
const WINDOW_MS = 1800; // all three strokes must happen within this time
const STROKE_GAP_MS = 120; // ignore the same flick being counted twice
const COOLDOWN_MS = 2500; // after opening, ignore further shakes briefly
const IOS_DENIED_KEY = "jikmis-shake-permission-denied";

type MotionWithPermission = typeof DeviceMotionEvent & { requestPermission?: () => Promise<"granted" | "denied"> };

export function ShakeContact() {
  const [open, setOpen] = React.useState(false);
  const strokes = React.useRef<{ dir: 1 | -1; t: number }[]>([]);
  const lastOpen = React.useRef(0);

  // Attach the motion listener (only if the sensor exists).
  React.useEffect(() => {
    if (typeof window === "undefined" || !("DeviceMotionEvent" in window)) return;

    const onMotion = (e: DeviceMotionEvent) => {
      // Prefer acceleration without gravity; fall back to the gravity-included
      // value (x axis is sideways when the phone is held upright).
      const x = e.acceleration?.x ?? e.accelerationIncludingGravity?.x ?? 0;
      if (Math.abs(x) < STROKE_THRESHOLD) return;
      const now = Date.now();
      if (now - lastOpen.current < COOLDOWN_MS) return;

      const dir: 1 | -1 = x > 0 ? 1 : -1;
      const list = strokes.current.filter((s) => now - s.t < WINDOW_MS);
      const last = list[list.length - 1];
      if (last && last.dir === dir) {
        // Same direction still moving — not a new stroke.
        strokes.current = list;
        return;
      }
      if (last && now - last.t < STROKE_GAP_MS) {
        strokes.current = list;
        return;
      }
      list.push({ dir, t: now });
      strokes.current = list;

      // Need three strokes that alternate: right-left-right (or left-right-left,
      // depending on how the phone reports the axis).
      if (list.length >= 3) {
        const [a, b, c] = list.slice(-3);
        if (a.dir !== b.dir && b.dir !== c.dir) {
          strokes.current = [];
          lastOpen.current = now;
          setOpen(true);
        }
      }
    };

    window.addEventListener("devicemotion", onMotion);
    return () => window.removeEventListener("devicemotion", onMotion);
  }, []);

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

  const telHref = `tel:${SITE.phone.replace(/[^+\d]/g, "")}`;

  return (
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
                href={telHref}
                className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-navy-50 px-4 py-3 transition-colors hover:bg-navy-100"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-navy-900 text-white">
                  <Phone className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-slate-900">Call us</span>
                  <span className="block text-xs text-slate-500">{SITE.phone}</span>
                </span>
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
