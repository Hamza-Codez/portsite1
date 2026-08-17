"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/Section";
import { Container } from "@/components/Container";
import { Heading, Text } from "@/components/Typography";
import { BadgeCheck } from "lucide-react";
import { credentials, issuers, type Credential } from "@/lib/profile";

function CredentialCard({ c }: { c: Credential }) {
  return (
    <div className="group relative flex w-[360px] sm:w-[450px] shrink-0 h-full flex-row gap-5 overflow-hidden rounded-md border border-black/20 dark:border-white/20 bg-[radial-gradient(circle_at_center,white_0%,#d4d4d4_100%)] dark:bg-none dark:bg-[#0B0C0E] dark:backdrop-blur-none p-5 sm:p-6 shadow-sm transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-md">
      {/* Orb effect on dark mode */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -right-32 z-0 hidden h-64 w-64 blur-[64px] dark:block dark:bg-white/30"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 bg-black/[0.02] opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:bg-white/[0.02]"
      />

      <div className="relative z-10 flex h-full w-full flex-row gap-5 items-center">
        <div className="flex-shrink-0">
          {c.badge ? (
            <img src={c.badge} alt={c.title} className="w-20 h-20 sm:w-24 sm:h-24 object-contain rounded-md shrink-0" />
          ) : (
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-black/5 dark:bg-white/5 rounded-md flex items-center justify-center shrink-0">
              <BadgeCheck size={32} className="text-black/50 dark:text-white/40" strokeWidth={1.5} />
            </div>
          )}
        </div>
        
        <div className="flex flex-col flex-grow min-w-0 h-full justify-center">
          <div className="mb-1 flex items-start justify-between gap-2">
            <h3 className="text-base sm:text-lg font-bold leading-tight text-black dark:font-medium dark:text-white truncate">
              {c.title}
            </h3>
            <span className="shrink-0 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.16em] text-black/80 dark:text-white/40 mt-1 hidden sm:block">
              {c.date}
            </span>
          </div>
          <p className="text-xs sm:text-sm font-medium text-black/70 dark:font-normal dark:text-white/50 mb-2 truncate">
            {c.issuer}
          </p>
          <p className="text-xs sm:text-sm leading-relaxed text-black/90 dark:font-normal dark:text-white/60 line-clamp-2">
            {c.description}
          </p>
          <div className="mt-3 sm:mt-4 border-t border-black/20 pt-2 sm:pt-3 dark:border-white/10">
            <p className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.14em] text-black/80 dark:text-white/40 truncate">
              {c.skills}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Was Testimonials. There is no source data for testimonials or client logos,
   and inventing endorsements for a real person is not a design decision — so
   the layout now carries the nine certifications from info.md §6 instead. */
import { QuantumWaveBG } from "@/components/ui/QuantumWaveBG";

export function Credentials() {
  const half = Math.ceil(credentials.length / 2);
  const topRow = credentials.slice(0, half);
  const bottomRow = credentials.slice(half);

  return (
    <Section id="credentials" className="relative overflow-hidden bg-transparent py-16 md:py-40">
      {/* Dynamic Quantum Wave Background */}
      <div className="absolute inset-0 z-0">
        <QuantumWaveBG className="absolute inset-0 w-full h-full z-0 pointer-events-none" />
      </div>


      <Container className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-16 max-w-2xl mx-auto text-center flex flex-col items-center"
        >
          <Text className="text-foreground/40 uppercase tracking-[0.2em] text-sm font-semibold mb-4">
            Credentials
          </Text>
          <Heading as="h2">Certified, and still counting.</Heading>
          <Text className="mt-6 text-foreground/60 leading-relaxed">
            Eleven certifications earned across 2024–2025 — seven from Google, plus
            competitive programming and university programmes.
          </Text>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="relative flex flex-col gap-6 w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)] py-4"
        >
          {/* Top Row - Moves Left */}
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, duration: 80, ease: "linear" }}
            className="flex w-max"
          >
            {[0, 1].map((setIndex) => (
              <div key={setIndex} className="flex gap-6 pr-6">
                {topRow.map((c, i) => (
                  <CredentialCard key={`${c.title}-${setIndex}-${i}`} c={c} />
                ))}
              </div>
            ))}
          </motion.div>

          {/* Bottom Row - Moves Right */}
          <motion.div
            animate={{ x: ["-50%", "0%"] }}
            transition={{ repeat: Infinity, duration: 80, ease: "linear" }}
            className="flex w-max"
          >
            {[0, 1].map((setIndex) => (
              <div key={setIndex} className="flex gap-6 pr-6">
                {bottomRow.map((c, i) => (
                  <CredentialCard key={`${c.title}-${setIndex}-${i}`} c={c} />
                ))}
              </div>
            ))}
          </motion.div>
        </motion.div>

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
