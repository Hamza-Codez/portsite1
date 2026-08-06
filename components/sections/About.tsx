"use client";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { Container } from "@/components/Container";
import { cn } from "@/lib/utils";

/* ---------------------------------------------------------------------------
   The Mindset — refactor → schematic.

   Rebuilt minimal. What the previous version did and why it's gone:
   - VS Code syntax colours (--vsc-*) are all black in light mode, so the
     highlighting only existed in one theme. Now strictly monochrome via the
     --mindset-* tokens, which are defined for both.
   - A 3D tilt driven by pointer position, which rested skewed on touch.
   - A 4.5s auto-carousel through five slides. Reading a principle took longer
     than the slide lasted. Selection is now yours; it advances only on click.

   Kept: the φ split (1 : 1.618) and the core idea — one throwaway line is
   struck out, and the system it should have been is drawn beside it.
--------------------------------------------------------------------------- */

const EASE = [0.16, 1, 0.3, 1] as const;

const PRINCIPLES = [
  {
    id: "architecture",
    label: "Architecture",
    line: "Design for year two, not the demo.",
    before: "function build() { return works }",
    core: "SYS",
    tokens: ["maintainable", "scalable", "observable"],
  },
  {
    id: "ai",
    label: "AI-native",
    line: "Models are primary actors, not a bolt-on.",
    before: "await chatGPT(prompt)",
    core: "LLM",
    tokens: ["retrieve", "reason", "evaluate"],
  },
  {
    id: "craft",
    label: "Craft",
    line: "Boring code, deliberately. Surprise is a defect.",
    before: "// TODO: handle this later",
    core: "SHIP",
    tokens: ["typed", "tested", "documented"],
  },
] as const;

/* Schematic: a spine dropping from the core with one branch per token. Same
   shape at every width — no absolute positioning to re-tune per breakpoint. */
function Schematic({
  principle,
  reduced,
}: {
  principle: (typeof PRINCIPLES)[number];
  reduced: boolean;
}) {
  const t = (delay: number, duration = 0.45) =>
    reduced ? { duration: 0 } : { delay, duration, ease: EASE };

  return (
    <motion.div
      key={principle.id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduced ? 0 : 0.2 }}
      className="w-full max-w-[420px]"
    >
      {/* the line being refactored away — block, so the core sits below it */}
      <div className="mb-10 flex items-center font-mono text-[12px] text-[var(--mindset-ghost)] sm:text-[13px]">
        <span className="mr-3 select-none opacity-50">–</span>
        <span className="relative whitespace-nowrap py-0.5">
          {principle.before}
          <motion.span
            aria-hidden
            className="absolute left-0 top-1/2 h-px bg-[var(--mindset-ghost)]"
            initial={{ width: reduced ? "100%" : "0%" }}
            animate={{ width: "100%" }}
            transition={t(0.15, 0.3)}
          />
        </span>
      </div>

      {/* core — fixed width so the spine below can centre on it regardless of
          whether the label is SYS, LLM or SHIP */}
      <motion.div
        initial={{ opacity: 0, y: reduced ? 0 : 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={t(0.4)}
        className="flex w-[64px] items-center justify-center rounded bg-[var(--mindset-core)] px-2 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--mindset-bg)]"
      >
        {principle.core}
      </motion.div>

      {/* spine + branches, centred under the 64px core */}
      <div className="relative mt-3 pl-8">
        <motion.span
          aria-hidden
          className="absolute left-8 top-0 w-px origin-top bg-[var(--mindset-trace)]"
          style={{ bottom: "22px" }}
          initial={{ scaleY: reduced ? 1 : 0 }}
          animate={{ scaleY: 1 }}
          transition={t(0.5, 0.4)}
        />

        <ul className="space-y-3">
          {principle.tokens.map((token, i) => (
            <motion.li
              key={token}
              initial={{ opacity: 0, x: reduced ? 0 : -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={t(0.62 + i * 0.08)}
              className="flex items-center"
            >
              {/* branch stub */}
              <span
                aria-hidden
                className="h-px w-5 shrink-0 bg-[var(--mindset-trace)]"
              />
              <span className="inline-flex items-center gap-2 rounded-[10px] border border-[var(--mindset-hair)] bg-[var(--mindset-surface)] px-3 py-2 font-mono text-[12px] text-[var(--mindset-ink)]">
                <span className="h-1 w-1 rounded-full bg-[var(--mindset-ink)] opacity-40" />
                {token}
              </span>
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

/* Real, attributable quotes — decorative, and clearly not claims about Hamza.
   They balance the empty right half of the schematic column. */
const QUOTES = [
  {
    text: "Design is not just what it looks like and feels like. Design is how it works.",
    author: "Steve Jobs",
  },
  {
    text: "Simplicity is the ultimate sophistication.",
    author: "Leonardo da Vinci",
  },
  {
    text: "Make it work, make it right, make it fast.",
    author: "Kent Beck",
  },
  {
    text: "Programs must be written for people to read, and only incidentally for machines to execute.",
    author: "Abelson & Sussman",
  },
] as const;

function QuoteSlideshow({ reduced }: { reduced: boolean }) {
  const [i, setI] = useState(0);

  // Auto-advance. The dots below also let the reader drive it manually.
  useEffect(() => {
    const id = setInterval(() => setI((p) => (p + 1) % QUOTES.length), 5200);
    return () => clearInterval(id);
  }, []);

  const q = QUOTES[i];

  return (
    <div className="w-full border-t border-[var(--mindset-hair)] pt-8 lg:w-[280px] lg:shrink-0 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
      <div className="relative min-h-[190px]">
        <AnimatePresence mode="wait">
          <motion.blockquote
            key={i}
            initial={{ opacity: 0, y: reduced ? 0 : 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduced ? 0 : -8 }}
            transition={{ duration: reduced ? 0 : 0.4, ease: EASE }}
          >
            <span
              aria-hidden
              className="mb-2 block font-serif text-4xl leading-none text-[var(--mindset-trace)]"
            >
              &ldquo;
            </span>
            <p className="text-lg font-medium leading-snug tracking-tight text-[var(--mindset-ink)]">
              {q.text}
            </p>
            <footer className="mt-4 font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--mindset-ghost)]">
              — {q.author}
            </footer>
          </motion.blockquote>
        </AnimatePresence>
      </div>

      <div className="mt-6 flex gap-2">
        {QUOTES.map((_, k) => (
          <button
            key={k}
            type="button"
            onClick={() => setI(k)}
            aria-label={`Quote ${k + 1} of ${QUOTES.length}`}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              k === i
                ? "w-6 bg-[var(--mindset-ink)]"
                : "w-1.5 bg-[var(--mindset-ghost)] opacity-40 hover:opacity-70"
            )}
          />
        ))}
      </div>
    </div>
  );
}

export function About() {
  const prefersReduced = useReducedMotion();
  const reduced = prefersReduced === true;
  const [active, setActive] = useState(0);

  const principle = PRINCIPLES[active];

  return (
    <section
      id="about"
      className="scroll-mt-20 overflow-hidden bg-[var(--mindset-bg)] py-16 text-[var(--mindset-ink)] md:scroll-mt-24 md:py-24"
    >
      <Container>
        <div className="grid items-start gap-12 lg:grid-cols-[1fr_1.618fr] lg:gap-20">
          {/* Statement + selector */}
          <div>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, ease: EASE }}
              className="mb-8 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--mindset-ghost)]"
            >
              The Mindset
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, ease: EASE }}
              className="text-[clamp(1.5rem,3vw,2.125rem)] font-medium leading-[1.25] tracking-tight"
            >
              Software is a craft. The goal isn&apos;t code that works — it&apos;s
              a system that still makes sense once someone else has to change it.
            </motion.p>

            <motion.ul
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
              className="mt-10 border-t border-[var(--mindset-hair)]"
            >
              {PRINCIPLES.map((p, i) => {
                const on = i === active;
                return (
                  <li key={p.id} className="border-b border-[var(--mindset-hair)]">
                    <button
                      type="button"
                      onClick={() => setActive(i)}
                      aria-pressed={on}
                      className="group flex w-full items-baseline gap-4 py-4 text-left"
                    >
                      <span
                        className={cn(
                          "font-mono text-[11px] tabular-nums transition-opacity",
                          on ? "opacity-100" : "opacity-40 group-hover:opacity-70"
                        )}
                      >
                        0{i + 1}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span
                          className={cn(
                            "block text-base font-medium transition-opacity",
                            on ? "opacity-100" : "opacity-50 group-hover:opacity-80"
                          )}
                        >
                          {p.label}
                        </span>
                        <AnimatePresence initial={false}>
                          {on && (
                            <motion.span
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: reduced ? 0 : 0.25, ease: EASE }}
                              className="block overflow-hidden text-sm text-[var(--mindset-ghost)]"
                            >
                              <span className="block pt-1.5">{p.line}</span>
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </span>
                      {/* active marker */}
                      <span
                        aria-hidden
                        className={cn(
                          "mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--mindset-ink)] transition-opacity",
                          on ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </button>
                  </li>
                );
              })}
            </motion.ul>
          </div>

          {/* Schematic + rotating quote share the right column */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: EASE }}
            className="flex w-full flex-col gap-10 lg:flex-row lg:items-center lg:gap-10 lg:pl-8"
          >
            <div className="flex min-h-[300px] flex-1 items-center justify-center lg:min-h-[420px] lg:justify-start">
              <AnimatePresence mode="wait">
                <Schematic key={principle.id} principle={principle} reduced={reduced} />
              </AnimatePresence>
            </div>

            <QuoteSlideshow reduced={reduced} />
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
