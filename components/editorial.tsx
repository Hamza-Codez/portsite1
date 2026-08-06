"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

/* ---------------------------------------------------------------------------
   Reveal — line-by-line mask reveal used for headlines and copy.
   Each child slides up from behind a clipped edge.
--------------------------------------------------------------------------- */
export function Reveal({
  children,
  className,
  delay = 0,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "span" | "h1" | "h2" | "h3" | "p";
}) {
  const Tag = motion[as] as typeof motion.div;
  return (
    <span className={cn("block overflow-hidden", className)}>
      <Tag
        initial={{ y: "110%" }}
        whileInView={{ y: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.9, ease: EASE, delay }}
        className="block"
      >
        {children}
      </Tag>
    </span>
  );
}

/* Fade + rise for non-text blocks. */
export function Rise({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12%" }}
      transition={{ duration: 0.8, ease: EASE, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ---------------------------------------------------------------------------
   RuleRow — a full-bleed hairline with a monospace index/label pinned to it.
   This is the structural motif that replaces decorative dividers.
--------------------------------------------------------------------------- */
export function RuleRow({
  index,
  label,
  className,
}: {
  index: string;
  label: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-baseline justify-between gap-6 border-t border-hairline pt-4",
        className
      )}
    >
      <span className="mono text-xs tracking-[0.28em] text-muted">
        ({index})
      </span>
      <span className="mono text-xs uppercase tracking-[0.28em] text-faint">
        {label}
      </span>
    </div>
  );
}

/* ---------------------------------------------------------------------------
   SectionHeader — index + oversized headline, editorial.
--------------------------------------------------------------------------- */
export function SectionHeader({
  index,
  kicker,
  title,
  intro,
  className,
}: {
  index: string;
  kicker: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <RuleRow index={index} label={kicker} className="mb-10 md:mb-14" />
      <div className="grid gap-8 md:grid-cols-12 md:items-end">
        <Reveal
          as="h2"
          className="headline col-span-full text-[clamp(2rem,5vw,3.75rem)] text-foreground md:col-span-8"
        >
          {title}
        </Reveal>
        {intro && (
          <Rise
            delay={0.1}
            className="col-span-full text-base leading-relaxed text-muted md:col-span-4"
          >
            {intro}
          </Rise>
        )}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------------
   ArrowLink — Stripe-style inline action with a sliding arrow.
--------------------------------------------------------------------------- */
export function ArrowLink({
  children,
  href,
  onClick,
  className,
  cursor,
}: {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  cursor?: string;
}) {
  const Comp = href ? "a" : "button";
  return (
    <Comp
      href={href}
      onClick={onClick}
      data-cursor={cursor}
      className={cn(
        "group inline-flex items-center gap-2 text-sm font-medium text-foreground",
        className
      )}
    >
      <span className="link-underline">{children}</span>
      <span className="transition-transform duration-300 ease-out group-hover:translate-x-1">
        →
      </span>
    </Comp>
  );
}

/* ---------------------------------------------------------------------------
   Marquee — infinite horizontal track (used for the trust strip).
--------------------------------------------------------------------------- */
export function Marquee({ items }: { items: string[] }) {
  const row = [...items, ...items];
  return (
    <div className="relative overflow-hidden">
      <div className="animate-marquee flex w-max gap-16 pr-16">
        {row.map((item, i) => (
          <span
            key={i}
            className="whitespace-nowrap text-2xl font-medium tracking-tight text-faint md:text-3xl"
          >
            {item}
          </span>
        ))}
      </div>
      {/* Edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent" />
    </div>
  );
}
