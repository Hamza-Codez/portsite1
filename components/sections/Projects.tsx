"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useRef, useState } from "react";
import { Section } from "@/components/Section";
import { Container } from "@/components/Container";
import { BubbleCard } from "@/components/BubbleCard";
import { Heading, Text } from "@/components/Typography";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

import { projects, type Project } from "@/lib/profile";

function host(url: string) {
  return new URL(url).host.replace(/^www\./, "");
}

/* Shared browser-chrome preview, used by the mobile carousel card. */
function PreviewWindow({ project }: { project: Project }) {
  return (
    <a
      href={project.live ?? project.source}
      target="_blank"
      rel="noreferrer"
      title={project.live ? `Open ${project.title}` : `View ${project.title} source`}
      className="group/pv relative block overflow-hidden border-b border-black/10 dark:border-white/10"
    >
      {/* Header bar is solid foreground — black in light, white in dark — with
          its contents in the inverse (background) colour. */}
      <div className="flex items-center gap-1.5 bg-foreground px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-background/40" />
        <span className="h-2 w-2 rounded-full bg-background/40" />
        <span className="h-2 w-2 rounded-full bg-background/40" />
        <span className="ml-2 truncate font-mono text-[10px] text-background/60">
          {host(project.live ?? project.source)}
        </span>
        <ArrowUpRight
          size={13}
          className="ml-auto shrink-0 text-background/60 transition-transform group-hover/pv:translate-x-0.5 group-hover/pv:-translate-y-0.5"
        />
      </div>
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        {project.preview ? (
          <Image
            src={project.preview}
            alt={`Screenshot of ${project.title}`}
            fill
            sizes="82vw"
            className="object-cover object-top transition-transform duration-700 group-hover/pv:scale-[1.03]"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 px-6 text-center">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/40">
              Not deployed
            </span>
            <span className="font-mono text-xs text-foreground/60">View source on GitHub</span>
          </div>
        )}
      </div>
    </a>
  );
}

/* Phone-only swipeable carousel — a CSS scroll-snap track with pagination dots.
   Native touch scrolling, no library. data-lenis-prevent stops Lenis from
   hijacking the horizontal drag. */
function MobileCarousel() {
  const prefersReduced = useReducedMotion();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const onScroll = () => {
    const el = scrollerRef.current;
    if (!el) return;
    const center = el.scrollLeft + el.clientWidth / 2;
    let best = 0;
    let bestDist = Infinity;
    Array.from(el.children).forEach((child, i) => {
      const node = child as HTMLElement;
      const dist = Math.abs(node.offsetLeft + node.offsetWidth / 2 - center);
      if (dist < bestDist) {
        bestDist = dist;
        best = i;
      }
    });
    setActive(best);
  };

  const goTo = (i: number) => {
    const node = scrollerRef.current?.children[i] as HTMLElement | undefined;
    node?.scrollIntoView({
      behavior: prefersReduced ? "auto" : "smooth",
      inline: "center",
      block: "nearest",
    });
  };

  return (
    <div className="md:hidden">
      <div
        ref={scrollerRef}
        onScroll={onScroll}
        data-lenis-prevent
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-6 px-6 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {projects.map((project) => (
          <article
            key={project.title}
            className="relative flex w-[82%] max-w-[340px] shrink-0 snap-center flex-col overflow-hidden rounded-2xl border border-black/10 dark:border-white/10 bg-gradient-to-br from-white to-neutral-100 shadow-[0_12px_30px_rgba(0,0,0,0.12)] dark:from-neutral-900 dark:to-neutral-800 dark:shadow-[0_14px_34px_rgba(0,0,0,0.55)]"
          >
            {/* aesthetic corner glow */}
            <div
              aria-hidden
              className="pointer-events-none absolute -right-10 -top-14 h-36 w-36 rounded-full bg-foreground/[0.07] blur-3xl"
            />

            <PreviewWindow project={project} />

            <div className="relative flex flex-grow flex-col gap-3 p-5">
              <span className="w-fit rounded-full border border-foreground/20 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.16em] text-foreground/50">
                {project.category}
              </span>
              <h3 className="text-xl font-semibold tracking-tight text-foreground">
                {project.title}
              </h3>
              <p className="line-clamp-3 text-sm leading-relaxed text-foreground/70">
                {project.description}
              </p>

              <div className="mt-auto flex items-center justify-between gap-3 border-t border-foreground/10 pt-4">
                <span className="truncate font-mono text-[10px] uppercase tracking-[0.14em] text-foreground/40">
                  {project.tech}
                </span>
                <div className="flex shrink-0 items-center gap-2">
                  {project.live && (
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex h-9 items-center gap-1.5 rounded-full bg-foreground px-4 text-xs font-medium text-background"
                    >
                      Live <ArrowUpRight size={14} />
                    </a>
                  )}
                  <a
                    href={project.source}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-xs font-medium text-foreground/70 transition-colors hover:text-foreground"
                  >
                    Source <ArrowUpRight size={14} />
                  </a>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* pagination dots */}
      <div className="mt-6 flex items-center justify-center gap-2">
        {projects.map((p, i) => (
          <button
            key={p.title}
            type="button"
            aria-label={`Go to project ${i + 1}: ${p.title}`}
            aria-current={i === active}
            onClick={() => goTo(i)}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              i === active ? "w-5 bg-foreground" : "w-1.5 bg-foreground/30 hover:bg-foreground/60"
            )}
          />
        ))}
      </div>
    </div>
  );
}

export function Projects() {
  return (
    <Section id="projects" className="py-16 md:py-24 relative bg-background">
      <Container className="mb-24 md:mb-32 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-3xl"
        >
          <Text className="text-foreground/40 uppercase tracking-[0.2em] text-sm font-semibold mb-4">
            Selected Work
          </Text>
          <Heading as="h2" className="text-4xl md:text-5xl lg:text-7xl font-medium tracking-tight text-foreground">
            Engineering <br/><span className="text-foreground/40">Excellence.</span>
          </Heading>
        </motion.div>

        {/* Seamlessly integrated Portrait Video */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="w-full max-w-[320px] sm:max-w-[420px] lg:max-w-[480px] aspect-[4/3] rounded-2xl overflow-hidden shadow-xl lg:flex-shrink-0 relative border border-black/20 dark:border-white/20"
        >
          <video
            ref={(el) => { if (el) el.playbackRate = 0.5; }}
            src="/assets/project/projectssection.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        </motion.div>
      </Container>

      {/* Phone: swipeable carousel of gradient cards. */}
      <MobileCarousel />

      {/* Tablet & up: the sticky-stacking cards, unchanged. */}
      <div className="hidden md:block md:px-12 w-full max-w-7xl mx-auto md:space-y-0 md:pb-32 relative">
        {projects.map((project, index) => {
          return (
            <div 
              key={project.title} 
              /* pointer-events-none: each wrapper is 70vh but holds a 60vh
                 card, so its empty band overlays the card below and would
                 swallow that card's hover. The card opts back in. */
              className="md:sticky md:top-32 md:h-[70vh] md:pt-[var(--stack-offset)] flex items-center justify-center w-full pointer-events-none"
              style={{ "--stack-offset": `${index * 2}rem` } as React.CSSProperties}
            >
              <BubbleCard
                bubbleSize={150}
                className="pointer-events-auto w-full h-full md:h-[60vh] bg-white dark:bg-[#0B0C0E] border border-black/20 dark:border-white/20 rounded-2xl md:rounded-3xl p-6 sm:p-8 md:p-12 lg:p-16 grid lg:grid-cols-2 gap-8 lg:gap-24 shadow-sm hover:shadow-md transition-shadow duration-300"
              >

                {/* Square-dot halftone wave (lg+). Arcs from the left, curves
                    behind the preview, tail pinned to the bottom-right corner.
                    mask-size:cover (not 100%×100%) scales the mask UNIFORMLY so
                    the square dots stay square across every card aspect; the
                    bottom-right anchor keeps the tail in the corner. The
                    left→right gradient ramps the dots from dim behind the text,
                    through gray, to solid --foreground behind the preview —
                    black on light, white on dark. Sits BELOW the BubbleCard's
                    z-20 mix-blend-difference bubble, so dragging the cursor
                    inverts the dots it passes — the card's own "inversion on
                    hover". color-mix keeps it theme-aware. */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 z-0 hidden opacity-90 transition-opacity duration-500 group-hover:opacity-100 lg:block [background-image:linear-gradient(to_right,color-mix(in_srgb,var(--foreground)_4%,transparent)_0%,color-mix(in_srgb,var(--foreground)_34%,transparent)_55%,var(--foreground)_100%)] [mask-image:url('/assets/project/wave.webp')] [mask-size:cover] [mask-position:right_bottom] [mask-repeat:no-repeat] [-webkit-mask-image:url('/assets/project/wave.webp')] [-webkit-mask-size:cover] [-webkit-mask-position:right_bottom] [-webkit-mask-repeat:no-repeat]"
                />

                {/* Existing subtle top-right glow */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-foreground/[0.03] rounded-full blur-[80px] -z-10" />

                {/* Hover radiating pattern: top-left and bottom-right opposing color */}
                <div className="absolute -top-32 -left-32 w-64 h-64 bg-foreground/30 rounded-full blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10" />
                <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-foreground/30 rounded-full blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10" />

                {/* z-10 + pointer-events-none is the BubbleCard contract: the
                    bubble inverts this layer. Interactive bits opt back in at
                    z-30 so they stay clickable and un-inverted. */}
                <div className="flex flex-col justify-between z-10 h-full pointer-events-none">
                  <div>
                    <span className="mb-6 inline-block rounded-full border border-foreground/20 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.16em] text-foreground/50">
                      {project.category}
                    </span>
                    <h3 className="text-3xl md:text-4xl font-semibold text-foreground tracking-tight mb-6 group-hover:text-foreground transition-colors duration-300">
                      {project.title}
                    </h3>
                    <Text className="text-foreground/80 max-w-prose">{project.description}</Text>
                  </div>

                  <div className="mt-8 pt-6 border-t border-foreground/10 flex flex-col md:flex-row gap-6 md:items-center justify-between lg:mt-12">
                    <Text className="text-xs uppercase tracking-widest text-foreground/40">
                      {project.tech}
                    </Text>
                    {/* Plain anchors, not <Button>: Button renders a
                        motion.button and has no asChild, so wrapping a link in
                        it would nest <a> inside <button>. */}
                    <div className="relative z-30 flex flex-wrap items-center gap-3 pointer-events-auto">
                      {/* Academic entries have no deployment, so the live link
                          renders only when one actually exists. */}
                      {project.live && (
                        <a
                          href={project.live}
                          target="_blank"
                          rel="noreferrer"
                          className="group/btn inline-flex h-11 lg:h-10 w-fit items-center gap-2 rounded-full border border-foreground/20 px-6 text-sm font-medium text-foreground transition-colors hover:bg-foreground hover:text-background"
                        >
                          Live
                          <ArrowUpRight size={16} className="transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                        </a>
                      )}
                      <a
                        href={project.source}
                        target="_blank"
                        rel="noreferrer"
                        className="group/src inline-flex h-11 lg:h-10 w-fit items-center gap-2 rounded-full px-6 text-sm font-medium text-foreground/70 transition-colors hover:bg-surface hover:text-foreground"
                      >
                        Source
                        <ArrowUpRight size={16} className="transition-transform group-hover/src:translate-x-0.5 group-hover/src:-translate-y-0.5" />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Real screenshot of the deployed site, framed as a browser
                    window. z-30 so the bubble doesn't invert the artwork. */}
                <a
                  href={project.live ?? project.source}
                  target="_blank"
                  rel="noreferrer"
                  title={project.live ? `Open ${project.title}` : `View ${project.title} source`}
                  /* Below lg: a landscape mini window bled into the card's
                     top-right corner. The negative margins match the card's
                     padding, so it runs out to the card edge and the card's own
                     overflow-hidden clips it to the rounded corner — reading as
                     an overlap rather than a floating box. At lg it reverts to
                     the full-height panel in the right column. */
                  className="group/pv relative z-30 order-first ml-auto -mt-6 -mr-6 w-[78%] flex flex-col overflow-hidden rounded-none rounded-bl-xl border border-foreground/15 bg-background/60 pointer-events-auto transition-colors duration-500 hover:border-foreground/40 sm:-mt-8 sm:-mr-8 md:-mt-12 md:-mr-12 md:w-[62%] lg:order-none lg:ml-0 lg:mt-0 lg:mr-0 lg:h-full lg:w-auto lg:rounded-xl"
                >
                  {/* window chrome — solid foreground bar (black on light, white
                      on dark), contents in the inverse background colour */}
                  <div className="flex shrink-0 items-center gap-1.5 bg-foreground px-3 py-2 lg:gap-2 lg:px-4 lg:py-2.5">
                    <span className="h-2 w-2 rounded-full bg-background/40 lg:h-2.5 lg:w-2.5" />
                    <span className="h-2 w-2 rounded-full bg-background/40 lg:h-2.5 lg:w-2.5" />
                    <span className="h-2 w-2 rounded-full bg-background/40 lg:h-2.5 lg:w-2.5" />
                    <span className="ml-2 truncate font-mono text-[10px] text-background/60 lg:ml-3 lg:text-[11px]">
                      {new URL(project.live ?? project.source).host.replace(/^www\./, "")}
                    </span>
                    <ArrowUpRight
                      size={14}
                      className="ml-auto shrink-0 text-background/60 transition-transform duration-500 group-hover/pv:translate-x-0.5 group-hover/pv:-translate-y-0.5"
                    />
                  </div>

                  {/* landscape on mobile — matches the 16:10 the screenshots
                      were captured at, so nothing is cropped away */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden lg:aspect-auto lg:w-auto lg:flex-grow">
                    {project.preview ? (
                      <Image
                        src={project.preview}
                        alt={`Screenshot of ${project.title}`}
                        fill
                        sizes="(max-width: 1024px) 78vw, 40vw"
                        className="object-cover object-top transition-transform duration-[900ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover/pv:scale-[1.03]"
                      />
                    ) : (
                      /* Academic entries were never deployed, so there is
                         nothing to screenshot — link the repo instead. */
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-6 text-center">
                        <span className="font-mono text-xs uppercase tracking-[0.2em] text-foreground/40">
                          Not deployed
                        </span>
                        <span className="font-mono text-sm text-foreground/60">
                          View source on GitHub
                        </span>
                      </div>
                    )}
                  </div>
                </a>
              </BubbleCard>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
