import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { fadeUp } from "@/lib/motion";

export function Container({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)} {...props} />;
}

export function Section({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return <section className={cn("py-16 sm:py-24", className)} {...props} />;
}

export function Eyebrow({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <div className={cn("mb-3 flex items-center gap-3", className)} {...props}>
      <span className="h-px w-8 gold-rule" />
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-600">{children}</p>
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <motion.div
      variants={fadeUp}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: "-80px" }}
      className={cn(align === "center" && "text-center mx-auto max-w-2xl", className)}
    >
      {eyebrow && (
        <div className={cn("mb-3 flex items-center gap-3", align === "center" && "justify-center")}>
          <span className="h-px w-8 gold-rule" />
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-600">{eyebrow}</p>
          {align === "center" && <span className="h-px w-8 gold-rule" />}
        </div>
      )}
      <h2 className="text-3xl font-semibold text-navy-900 sm:text-4xl">{title}</h2>
      {description && <p className="mt-4 text-base leading-relaxed text-slate-500">{description}</p>}
    </motion.div>
  );
}
