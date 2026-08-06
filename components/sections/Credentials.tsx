"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/Section";
import { Container } from "@/components/Container";
import { Heading, Text } from "@/components/Typography";
import { BadgeCheck } from "lucide-react";
import { credentials, issuers } from "@/lib/profile";

/* Was Testimonials. There is no source data for testimonials or client logos,
   and inventing endorsements for a real person is not a design decision — so
   the layout now carries the nine certifications from info.md §6 instead. */

export function Credentials() {
  return (
    <Section id="credentials" className="relative overflow-hidden bg-background py-16 md:py-40">
      {/* Ambience, one variant per theme. Both are straight WebP re-encodes of
          imBlack.png / imWite.png (~98% smaller, no colour grading applied).
          Regenerate them whenever the source PNGs change. */}
      <div
        aria-hidden
        className="absolute inset-0 z-0 hidden dark:block bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url("/assets/testimonials/bg-dark.webp")' }}
      />
      <div
        aria-hidden
        className="absolute inset-0 z-0 block dark:hidden bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url("/assets/testimonials/bg-light.webp")' }}
      />
      <Container className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-16 max-w-2xl"
        >
          <Text className="text-foreground/40 uppercase tracking-[0.2em] text-sm font-semibold mb-4">
            Credentials
          </Text>
          <Heading as="h2">Certified, and still counting.</Heading>
          <Text className="mt-6 text-foreground/60 leading-relaxed">
            Nine certifications earned across 2024–2025 — six from Google, plus
            competitive programming and two university programmes.
          </Text>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {credentials.map((c, i) => (
            <motion.article
              key={c.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
              className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-black/20 dark:border-white/20 bg-white dark:bg-[#0B0C0E] dark:backdrop-blur-none p-6 sm:p-8 shadow-sm transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              {/* Same treatment as the Skills cards: a radiating orb top-right
                  on dark, plus a flat hover wash. Replaces the tiled pattern
                  mask that used to sit here. */}
              <div
                aria-hidden
                className="pointer-events-none absolute -top-32 -right-32 z-0 hidden h-64 w-64 blur-[64px] dark:block dark:bg-white/30"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 z-0 bg-black/[0.02] opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:bg-white/[0.02]"
              />

              <div className="relative z-10 flex h-full flex-col">
                {/* Type weights mirror the Skills cards — bold on light,
                    lighter on dark, so both sections read as one system. */}
                <div className="mb-6 flex items-start justify-between gap-4">
                  <BadgeCheck size={26} className="shrink-0 text-black/50 dark:text-white/40" strokeWidth={1.5} />
                  <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-black/80 dark:text-white/40">
                    {c.date}
                  </span>
                </div>

                <h3 className="text-lg font-bold leading-snug text-black dark:font-medium dark:text-white">
                  {c.title}
                </h3>
                <p className="mt-1 text-sm font-medium text-black/70 dark:font-normal dark:text-white/50">
                  {c.issuer}
                </p>

                <p className="mt-4 flex-grow text-sm font-medium leading-relaxed text-black/90 dark:font-normal dark:text-white/60">
                  {c.description}
                </p>

                <div className="mt-6 border-t border-black/20 pt-4 dark:border-white/10">
                  <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-black/80 dark:text-white/40">
                    {c.skills}
                  </p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Quiet trust strip — issuing bodies, not invented client logos */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-20 border-t border-border pt-10"
        >
          <p className="mb-8 text-center font-mono text-xs uppercase tracking-[0.3em] text-muted">
            Issued by
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
            {issuers.map((issuer) => (
              <span
                key={issuer}
                className="text-lg font-semibold tracking-tight text-muted/70 transition-colors hover:text-foreground"
              >
                {issuer}
              </span>
            ))}
          </div>
        </motion.div>
      </Container>
    </Section>
  );
}
