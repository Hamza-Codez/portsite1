"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { useRef } from "react";
import { Section } from "@/components/Section";
import { Container } from "@/components/Container";
import { BubbleCard } from "@/components/BubbleCard";
import { cn } from "@/lib/utils";
import { education, coursework, journey } from "@/lib/profile";

const CARD =
  "bg-white dark:bg-[#0B0C0E] dark:backdrop-blur-none border-[1px] border-black/50 dark:border-white/30 rounded-xl overflow-hidden relative shadow-sm hover:shadow-md transition-shadow duration-300";

/* ---------------------------------------------------------------------------
   Timeline — moved here from the Journey section.

   Presented as an alternating vertical rail whose progress line fills with
   scroll, rather than the flat five-column grid it used to be. It lives in
   Education because the chronology *is* the academic story: the journey entries
   already carry the matric and intermediate grades, which is why the separate
   "Earlier Education" card that used to sit here is gone — it repeated them.
--------------------------------------------------------------------------- */
function Timeline() {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  // Rail fills as the list crosses the viewport; springed so it trails the
  // scroll slightly instead of snapping to it.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 80%", "end 60%"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 30,
    mass: 0.4,
  });

  return (
    <div ref={ref} className="relative mt-4 md:mt-6">
      {/* rail track + fill. Left-aligned on mobile, centred from md. */}
      <div
        aria-hidden
        className="absolute bottom-0 top-0 left-[7px] w-px bg-black/15 dark:bg-white/15 md:left-1/2 md:-translate-x-1/2"
      />
      <motion.div
        aria-hidden
        style={{ scaleY: prefersReduced ? 1 : progress }}
        className="absolute bottom-0 top-0 left-[7px] w-px origin-top bg-black dark:bg-white md:left-1/2 md:-translate-x-1/2"
      />

      <ol className="space-y-8 md:space-y-0">
        {journey.map((step, i) => {
          const right = i % 2 === 1; // alternate sides from md up
          return (
            <li
              key={step.period}
              className="relative pl-8 md:grid md:grid-cols-2 md:gap-x-12 md:pl-0"
            >
              {/* node on the rail */}
              <motion.span
                aria-hidden
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="absolute left-0 top-7 z-10 h-[15px] w-[15px] rounded-full border-[3px] border-background bg-black dark:bg-white md:left-1/2 md:-translate-x-1/2"
              />

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className={cn(
                  "md:py-6",
                  right ? "md:col-start-2" : "md:col-start-1 md:row-start-auto"
                )}
              >
                <BubbleCard
                  bubbleSize={150}
                  className={`${CARD} p-5 sm:p-6 md:p-7`}
                >
                  <div className="relative z-10 pointer-events-none">
                    <p className="mb-2 text-xs font-bold uppercase tracking-widest text-black/80 dark:font-mono dark:text-white/40">
                      {step.period}
                    </p>
                    <h3 className="mb-1 text-lg font-bold leading-snug text-black dark:font-medium dark:text-white">
                      {step.title}
                    </h3>
                    <p className="mb-3 text-xs font-medium tracking-wide text-black/70 dark:font-mono dark:text-white/40">
                      {step.place}
                    </p>
                    <p className="text-sm font-medium leading-relaxed text-black/90 dark:font-normal dark:text-white/60">
                      {step.description}
                    </p>
                  </div>
                </BubbleCard>
              </motion.div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export function Education() {
  return (
    <Section id="education" className="py-16 md:py-24 bg-background">
      <Container className="max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 md:mb-20 flex flex-col items-center justify-center text-center"
        >
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-black/40 dark:font-semibold dark:text-white/40">
            Foundation
          </p>
          <h2 className="text-4xl font-semibold text-black dark:text-white md:text-5xl">
            Education &amp; the road here
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-3">
          {/* Headline credential */}
          <BubbleCard
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`${CARD} flex min-h-[350px] flex-col justify-between p-6 sm:p-8 md:p-12 lg:col-span-1`}
          >
            <div className="relative z-10 pointer-events-none">
              <h2 className="mb-6 text-4xl font-bold uppercase tracking-tighter text-black dark:text-white md:text-5xl">
                B.S. <br /> Computer <br /> Science
              </h2>
              <p className="text-sm font-medium leading-relaxed text-black/90 dark:font-normal dark:text-white/60">
                {education[0].description} Currently {education[0].grade}.
              </p>
            </div>

            <div className="relative z-10 mt-12 border-t border-black/20 pt-6 pointer-events-none dark:border-white/10">
              <p className="mb-1 text-xl font-bold text-black dark:font-medium dark:text-white">
                {education[0].institution}
              </p>
              <p className="text-xs font-bold uppercase tracking-widest text-black/80 dark:font-mono dark:text-white/40">
                {education[0].period}
              </p>
            </div>
          </BubbleCard>

          {/* Coursework */}
          <BubbleCard
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className={`${CARD} flex flex-col justify-center p-6 sm:p-8 md:p-12 lg:col-span-2`}
          >
            <h2 className="relative z-10 mb-8 text-2xl font-bold uppercase tracking-widest text-black pointer-events-none dark:font-medium dark:text-white">
              Relevant Coursework
            </h2>

            <div className="relative z-10 flex flex-wrap gap-3 pointer-events-none">
              {coursework.map((course) => (
                <span
                  key={course}
                  className="rounded-full border border-black/20 bg-black/5 px-4 py-2 text-xs font-bold uppercase tracking-wider text-black dark:border-white/20 dark:bg-white/5 dark:font-medium dark:text-white"
                >
                  {course}
                </span>
              ))}
            </div>
          </BubbleCard>
        </div>

        <Timeline />
      </Container>
    </Section>
  );
}
