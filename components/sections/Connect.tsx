"use client";

import { motion } from "framer-motion";
import { Mail, MapPin, Phone } from "lucide-react";
import { Section } from "@/components/Section";
import { Container } from "@/components/Container";
import { BubbleCard } from "@/components/BubbleCard";
import { profile, socials } from "@/lib/profile";
import { socialIcons } from "@/components/SocialIcons";

/* ---------------------------------------------------------------------------
   Connect — the old Journey identity bento merged into Let's Connect.

   The two sections said the same things twice: Journey ended with an "EMAIL ME"
   card plus a social row, and Contact then repeated the address, the same
   socials, and a second heading. Everything now appears exactly once —
   identity (name, portrait, bio) leading into one contact block.

   Keeps id="contact" so the hero CTA and the nav anchor still resolve.
--------------------------------------------------------------------------- */

const CARD =
  "bg-[#fcfcfc] dark:bg-[#0c0d10] border-2 border-black dark:border-white rounded-md overflow-hidden relative shadow-[6px_6px_0px_#18181b] dark:shadow-[6px_6px_0px_#d4d4d8] hover:-translate-y-1 transition-transform duration-300";

/* Kept to the outer corners so they never drift across the portrait's face. */
const BUBBLES = [
  { size: 90, top: "12%", left: "4%", y: [0, -20, 0], x: [0, 15, 0], d: 6, delay: 0 },
  { size: 64, top: "72%", left: "8%", y: [0, 25, 0], x: [0, -15, 0], d: 5, delay: 1 },
  { size: 150, top: "-8%", left: "88%", y: [0, 15, 0], x: [0, 20, 0], d: 7, delay: 2 },
  { size: 56, top: "82%", left: "92%", y: [0, -15, 0], x: [0, -10, 0], d: 4, delay: 0.5 },
];

const HexCardPrecise = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  return (
    <div className="h-full transition-transform duration-300 hover:-translate-y-1 [filter:drop-shadow(6px_6px_0_#18181b)] dark:[filter:drop-shadow(6px_6px_0_#d4d4d8)]">
      <div className="relative bg-black dark:bg-white p-[1.5px] h-full" 
           style={{ clipPath: 'polygon(24px 0, 100% 0, 100% calc(100% - 24px), calc(100% - 24px) 100%, 0 100%, 0 24px)' }}>
      <div className="relative bg-[#fcfcfc] dark:bg-[#0c0d10] h-full w-full p-2" 
           style={{ clipPath: 'polygon(23px 0, 100% 0, 100% calc(100% - 23px), calc(100% - 23px) 100%, 0 100%, 0 23px)' }}>
        <div className="relative bg-black/20 dark:bg-white/20 p-[1px] h-full w-full" 
             style={{ clipPath: 'polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)' }}>
          <div className={`relative bg-[#fcfcfc] dark:bg-[#0c0d10] h-full w-full flex flex-col overflow-hidden ${className || ""}`} 
               style={{ clipPath: 'polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)' }}>
            
            {/* Hexagon Honeycomb Background */}
            <div className="absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.05] bg-black dark:bg-white pointer-events-none" 
                 style={{ 
                   maskImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='24.5' viewBox='0 0 28 49'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='none' stroke='%23000' stroke-width='2'%3E%3Cpath d='M13.99 9.25l13 7.5v15l-13 7.5L1 31.75v-15l12.99-7.5zM-0.01 9.25l13-7.5l13 7.5v-15l-13-7.5l-13 7.5v15z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`, 
                   WebkitMaskImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='24.5' viewBox='0 0 28 49'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='none' stroke='%23000' stroke-width='2'%3E%3Cpath d='M13.99 9.25l13 7.5v15l-13 7.5L1 31.75v-15l12.99-7.5zM-0.01 9.25l13-7.5l13 7.5v-15l-13-7.5l-13 7.5v15z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                 }} />
            
            <div className="relative z-10 h-full flex flex-col">
              {children}
            </div>
          </div>
        </div>
      </div>
      {/* Inner Frame Cutout Nodes */}
      <div className="absolute top-2 left-6 w-1.5 h-1.5 rounded-full border border-black/40 dark:border-white/40 bg-transparent pointer-events-none" />
      <div className="absolute top-2 right-6 w-1.5 h-1.5 rounded-full border border-black/40 dark:border-white/40 bg-transparent pointer-events-none" />
      <div className="absolute bottom-2 left-6 w-1.5 h-1.5 rounded-full border border-black/40 dark:border-white/40 bg-transparent pointer-events-none" />
      <div className="absolute bottom-2 right-6 w-1.5 h-1.5 rounded-full border border-black/40 dark:border-white/40 bg-transparent pointer-events-none" />
    </div>
    </div>
  );
};

export function Connect() {
  return (
    <Section id="contact" className="relative overflow-hidden bg-background py-16 md:py-24">
      {/* Ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-1/2 h-[300px] w-full max-w-4xl -translate-x-1/2 rounded-[100%] bg-foreground/[0.03] blur-[80px]"
      />

      <Container className="relative z-10 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 flex flex-col items-center justify-center text-center md:mb-20"
        >
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-black/40 dark:font-semibold dark:text-white/40">
            What&apos;s next?
          </p>
          <h2 className="text-4xl font-semibold text-black dark:text-white md:text-5xl">
            Let&apos;s build together.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-[1.5fr_1fr] md:gap-6">
          {/* Identity — name and portrait were two separate cards; merged into
              one, with the portrait centred and the text living in the margins
              either side of it (the same idea as the hero). */}
          <BubbleCard
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`${CARD} p-6 sm:p-8 md:col-span-2 md:p-10 lg:p-12`}
          >
            {BUBBLES.map((b, i) => (
              <motion.div
                key={i}
                aria-hidden
                /* lg only: on a narrow card these are sized to sit over the
                   name and quote rather than beside them. */
                className="pointer-events-none absolute z-20 hidden rounded-full mix-blend-difference lg:block"
                style={{
                  width: b.size,
                  height: b.size,
                  top: b.top,
                  left: b.left,
                  background: "radial-gradient(circle at 30% 30%, #ffffff, #555555)",
                }}
                animate={{ y: b.y, x: b.x }}
                transition={{ duration: b.d, repeat: Infinity, ease: "easeInOut", delay: b.delay }}
              />
            ))}

            <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[1fr_auto_1fr] lg:gap-10">
              {/* LEFT of the portrait — the name */}
              <div className="relative z-10 pointer-events-none text-center lg:text-right">
                <h3 className="text-5xl font-bold uppercase leading-[0.9] tracking-tighter text-black dark:text-white md:text-6xl">
                  <span className="block">HAMZA</span>
                  <span className="block">AHMAD</span>
                </h3>
                <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.2em] text-black/50 dark:text-white/40">
                  {profile.title}
                </p>
                <p className="mt-2 flex items-center justify-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-black/50 dark:text-white/40 lg:justify-end">
                  <span className="h-1.5 w-1.5 rounded-full bg-black dark:bg-white" />
                  {profile.availability}
                </p>
              </div>

              {/* CENTRE — portrait. z-30 keeps the cursor bubble behind it, so
                  it inverts the text without washing over his face. Colour on
                  hover comes from the card's group, not its own pointer events. */}
              <div className="relative z-30 mx-auto w-[210px] shrink-0 sm:w-[240px] lg:w-[280px]">
                {/* de-fringed WebP matte: same image, ~25x smaller than the
                    4.1MB IM2.png this used to load unoptimised */}
                <img
                  src="/assets/Hero/portrait.webp"
                  alt="Hamza Ahmad"
                  className="h-auto w-full object-contain opacity-90 grayscale transition-all duration-[640ms] group-hover:opacity-100 group-hover:grayscale-0"
                />
              </div>

              {/* RIGHT of the portrait — the pitch */}
              <div className="relative z-10 pointer-events-none text-center lg:text-left">
                <blockquote className="text-xl font-medium leading-snug tracking-tight text-black dark:text-white md:text-2xl">
                  &ldquo;{profile.quote}&rdquo;
                </blockquote>
                <p className="mt-5 text-sm font-medium leading-relaxed text-black/70 dark:font-normal dark:text-white/50">
                  {profile.quoteSupport}
                </p>
              </div>
            </div>
          </BubbleCard>

          {/* Bio */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="h-full"
          >
            <HexCardPrecise className="justify-center p-6 sm:p-8 md:p-12">
              <p className="relative z-10 text-lg font-medium leading-relaxed text-black/90 pointer-events-none dark:font-normal dark:text-white/60">
                Hey, I&apos;m Hamza Ahmad — a final-year Computer Science student at
                the University of Agriculture, Faisalabad, building at the
                intersection of AI and modern web development. I like the
                unglamorous parts: real backends, typed contracts, and agentic
                workflows that still behave when the demo is over.
              </p>
            </HexCardPrecise>
          </motion.div>

          {/* Where to find me */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="h-full"
          >
            <HexCardPrecise className="justify-center gap-5 p-6 sm:p-8 md:p-10">
              <div className="relative z-10 flex items-center gap-3 pointer-events-none">
                <MapPin size={16} className="shrink-0 text-black/50 dark:text-white/40" />
                <span className="font-mono text-xs uppercase tracking-widest text-black/80 dark:text-white/50">
                  {profile.location}
                </span>
              </div>

              <a
                href={`tel:${profile.phoneHref}`}
                className="relative z-30 flex items-center gap-3 transition-colors hover:text-black dark:hover:text-white"
              >
                <Phone size={16} className="shrink-0 text-black/50 dark:text-white/40" />
                <span className="font-mono text-xs uppercase tracking-widest text-black/80 dark:text-white/50">
                  {profile.phone}
                </span>
              </a>

              <p className="relative z-10 border-t border-black/15 pt-5 text-sm font-medium leading-relaxed text-black/70 pointer-events-none dark:border-white/10 dark:font-normal dark:text-white/50">
                {profile.responseTime}.
              </p>
            </HexCardPrecise>
          </motion.div>
        </div>

        {/* One CTA — the only place the address and socials appear */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 0.6 }}
          className="mt-8 flex flex-col items-center justify-between gap-8 rounded-md border-2 border-black bg-[#fcfcfc] p-6 shadow-[6px_6px_0px_#18181b] dark:border-white dark:bg-[#0c0d10] dark:shadow-[6px_6px_0px_#d4d4d8] hover:-translate-y-1 transition-transform duration-300 sm:p-8 md:mt-10 md:p-12 lg:flex-row lg:gap-12"
        >
          <p className="max-w-xl text-center text-lg font-medium leading-relaxed text-black/90 dark:font-normal dark:text-white/60 lg:text-left">
            {profile.lookingFor}. Whether you have a question, a project idea, or
            just want to say hi, my inbox is always open.
          </p>

          <div className="flex w-full flex-col items-center gap-5 lg:w-auto lg:items-end">
            {/* anchor, not <Button> — Button is a motion.button with no asChild,
                so a link cannot be nested inside it */}
            <a
              href={`mailto:${profile.email}`}
              className="flex w-full items-center justify-center gap-3 rounded-full bg-foreground px-6 py-4 text-sm text-background shadow-md transition-transform duration-300 hover:scale-105 sm:px-8 sm:text-base lg:w-auto"
            >
              <Mail size={20} className="shrink-0" />
              <span className="truncate">{profile.email}</span>
            </a>

            <div className="flex items-center gap-3">
              {socials
                .filter((s) => s.icon !== "mail")
                .map((s) => {
                  const Icon = socialIcons[s.icon];
                  return (
                    <a
                      key={s.name}
                      href={s.href}
                      target="_blank"
                      rel="noreferrer"
                      title={s.name}
                      className="flex h-11 w-11 items-center justify-center rounded-full bg-surface text-foreground/40 transition-[color,transform] duration-300 hover:scale-110 hover:text-foreground"
                    >
                      <Icon className="h-5 w-5" />
                      <span className="sr-only">{s.name}</span>
                    </a>
                  );
                })}
            </div>
          </div>
        </motion.div>
      </Container>
    </Section>
  );
}
