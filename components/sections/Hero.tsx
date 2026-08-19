"use client";

import { motion, AnimatePresence, useReducedMotion, useInView } from "framer-motion";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { cn } from "@/lib/utils";
import { socials } from "@/lib/profile";
import { socialIcons } from "@/components/SocialIcons";

/* ---------------------------------------------------------------------------
   Hero — "the aperture", per spec.md.

   Layout is portrait-centered with text in the margins (30 / 40 / 30), NOT the
   generic left-text/right-image split. The portrait is a transparent cutout
   standing inside a generated aperture backdrop; the backdrop supplies all the
   chroma, so every component here stays neutral (spec.md §7).

   Three breakpoints, designed mobile-first:
     <768px    poster mode — portrait dominates, text overlays on scrims
     768–1099  text stacks above / CTAs below the portrait
     >=1100    the three-column margin layout
--------------------------------------------------------------------------- */

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* De-fringed WebP matte: the original cutout was masked off a white background
   and kept a near-white halo in its semi-transparent edge pixels, which read as
   a glassy blur once composited onto a dark canvas. */
const PORTRAIT = "/assets/Hero/portrait.webp";

const HEADLINE = ["I engineer", "digital experiences."];

/* Small glassy triangular prisms scattered across the whole hero. The two-tone
   facet (bright half meets shadow half at the vertical ridge) reads as a folded
   3D face; glowing white on dark, silver-white on light. */
const TRI = "polygon(50% 0%, 100% 100%, 0% 100%)";
const PRISMS = [
  // LEFT side only — the central 40–62% band belongs to the portrait
  { size: 26, top: "11%", left: "12%", rot: -18, dur: 8, delay: 0 },
  { size: 20, top: "40%", left: "6%", rot: 14, dur: 7.2, delay: 1.7 },
  { size: 34, top: "63%", left: "14%", rot: -10, dur: 9, delay: 0.6 },
  { size: 22, top: "80%", left: "5%", rot: -24, dur: 7.6, delay: 0.3 },
  { size: 16, top: "86%", left: "22%", rot: 24, dur: 6.2, delay: 1.1 },
  // RIGHT side only
  { size: 24, top: "12%", left: "82%", rot: 10, dur: 7.4, delay: 0.4 },
  { size: 18, top: "34%", left: "93%", rot: 28, dur: 6.5, delay: 0.8 },
  { size: 30, top: "55%", left: "70%", rot: -22, dur: 8.5, delay: 1 },
  { size: 20, top: "82%", left: "88%", rot: 16, dur: 7, delay: 1.4 },
  { size: 16, top: "90%", left: "68%", rot: -14, dur: 6.8, delay: 1.9 },
] as const;

/* `short` is the poster-mode label — below 1100px the full names wrap onto a
   second row and collide with the scroll cue (spec.md §2.3 shows the compact
   form: ● AI  ● Solver  ● Arch). */
const NODES = [
  {
    id: "ai",
    short: "AI",
    label: "AI Enthusiast",
    thesis:
      "I wire language models into products that ship — retrieval, agents, and the unglamorous eval work included.",
    chips: ["LLMs", "RAG", "Evals"],
  },
  {
    id: "ps",
    short: "Solver",
    label: "Problem Solver",
    thesis:
      "Hand me the ambiguous ticket nobody wants. The ones without a known answer are the fun ones.",
    chips: ["Debugging", "Trade-offs", "First-principles"],
  },
  {
    id: "sa",
    short: "Arch",
    label: "Systems Architect",
    thesis:
      "I design for year two, not the demo — services that scale without a rewrite.",
    chips: ["Distributed", "APIs", "Scale"],
  },
] as const;

/* Reveal plays once per session (spec.md §6). "idle" is the deterministic
   server + first-paint state, so hydration never mismatches. */
type Mode = "idle" | "play" | "static";

function useRevealMode(): Mode {
  const prefersReduced = useReducedMotion();
  const [mode, setMode] = useState<Mode>("idle");

  useEffect(() => {
    if (prefersReduced) {
      setMode("static");
      return;
    }
    if (sessionStorage.getItem("hero-revealed")) {
      setMode("static");
    } else {
      sessionStorage.setItem("hero-revealed", "true");
      setMode("play");
    }
  }, [prefersReduced]);

  return mode;
}

/* Pointer parallax — portrait 8px, backdrop 3px (spec.md §4.4). Off on touch
   and reduced-motion. */
function useParallax(enabled: boolean) {
  const [p, setP] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!enabled) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const onMove = (e: MouseEvent) => {
      setP({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [enabled]);

  return p;
}

/* 28ms/char, only while the reveal is playing (spec.md §7). */
function useTypewriter(text: string, startMs: number, play: boolean) {
  const [typed, setTyped] = useState("");
  const [caret, setCaret] = useState(false);

  useEffect(() => {
    if (!play) return;
    let i = 0;
    let step: ReturnType<typeof setTimeout>;
    let done: ReturnType<typeof setTimeout>;

    const tick = () => {
      setCaret(true);
      if (i <= text.length) {
        setTyped(text.slice(0, i));
        i += 1;
        step = setTimeout(tick, 28);
      } else {
        done = setTimeout(() => setCaret(false), 900);
      }
    };

    const start = setTimeout(tick, startMs);
    return () => {
      clearTimeout(start);
      clearTimeout(step);
      clearTimeout(done);
    };
  }, [text, startMs, play]);

  // Reading through `play` keeps the non-animated path stateless, so the
  // effect never has to synchronously reset state to the full string.
  return { out: play ? typed : text, caret };
}

function MagneticButton({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const onMove = (e: React.MouseEvent) => {
    if (!ref.current || window.matchMedia("(pointer: coarse)").matches) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = e.clientX - (left + width / 2);
    const y = e.clientY - (top + height / 2);
    if (Math.hypot(x, y) < 110) setPos({ x: x * 0.1, y: y * 0.1 });
    else setPos({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={ref}
      animate={pos}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onMouseMove={onMove}
      onMouseLeave={() => setPos({ x: 0, y: 0 })}
      className="inline-block"
    >
      {children}
    </motion.div>
  );
}

/* Social rail. Lives in the right margin on desktop, under the chip row in
   poster mode. Monochrome on purpose — spec.md §7 keeps components neutral and
   lets the backdrop carry all the colour. */
function SocialRail({ className }: { className?: string }) {
  return (
    <ul className={cn("flex items-center gap-2", className)}>
      {socials
        .filter((s) => s.icon === "github" || s.icon === "linkedin")
        .map((s) => {
        const Icon = socialIcons[s.icon];
        return (
          <li key={s.name}>
            <a
              href={s.href}
              target={s.icon === "mail" ? undefined : "_blank"}
              rel={s.icon === "mail" ? undefined : "noreferrer"}
              title={s.name}
              className="group flex h-7 w-7 md:h-9 md:min-w-0 md:w-auto md:px-3 md:gap-2.5 items-center justify-center rounded-full bg-[var(--ink)] text-[var(--bg-0)] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-1 hover:shadow-[0_8px_16px_-4px_rgba(0,0,0,0.3)] hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--glow)]"
            >
              <Icon className="h-[16px] w-[16px] md:h-[18px] md:w-[18px] shrink-0" />
              
              <span className="relative z-10 sr-only md:not-sr-only md:block">
                <span className="relative flex [transform-style:preserve-3d] transition-transform duration-[800ms] ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:[transform:rotateX(90deg)]">
                  {/* Ghost element for sizing */}
                  <span className="invisible flex items-center text-[12.5px] font-medium tracking-wide">
                    {s.name}
                  </span>
                  {/* Front Face */}
                  <span className="absolute inset-0 flex items-center text-[12.5px] font-medium tracking-wide transition-opacity duration-[800ms] ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:opacity-0 [transform:translateZ(9px)]">
                    {s.name}
                  </span>
                  {/* Bottom Face (rotates up to the front) */}
                  <span className="absolute inset-0 flex items-center text-[12.5px] font-medium tracking-wide opacity-0 transition-opacity duration-[800ms] ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:opacity-100 [transform:rotateX(-90deg)_translateZ(9px)]">
                    {s.name}
                  </span>
                </span>
              </span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}

/* Shared by the pill, its detail panel, and the mobile chips so all three stay
   in step. Flat near-black on light; on dark a black→grey gradient lifts the
   pills off the backdrop. `neutral`, not `slate` — slate carries a blue cast
   (slate-700 is #334155) which read as bluish rather than black. */
const NODE_SURFACE =
  "text-white bg-[var(--node)] dark:bg-gradient-to-br dark:from-neutral-900 dark:to-neutral-700";

/* --- Detail body shared by the desktop node card and the mobile chip panel -- */
function NodeDetail({ node }: { node: (typeof NODES)[number] }) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-[13px] leading-relaxed text-white/90">{node.thesis}</p>
      <div className="flex flex-wrap gap-1.5">
        {node.chips.map((c) => (
          <span
            key={c}
            className="mono rounded-sm border border-white/20 px-1.5 py-0.5 text-[10px] tracking-[0.1em] text-white/70"
          >
            {c}
          </span>
        ))}
      </div>
    </div>
  );
}

/* Desktop node: short trace -> breathing terminal dot -> label that morphs
   into a detail card (spec.md §5). */
function SchematicNode({
  node,
  index,
  mode,
  active,
  dimmed,
  onEnter,
  onLeave,
  onToggle,
}: {
  node: (typeof NODES)[number];
  index: number;
  mode: Mode;
  active: boolean;
  dimmed: boolean;
  onEnter: () => void;
  onLeave: () => void;
  onToggle: () => void;
}) {
  const play = mode === "play";
  const shown = mode !== "idle";
  // Traces draw from 900ms, 120ms apart; the label types once its trace lands.
  const traceDelay = 900 + index * 120;
  const { out, caret } = useTypewriter(node.label, traceDelay + 400, play);

  return (
    <motion.div
      className="relative flex items-start"
      style={{
        opacity: dimmed ? 0.45 : 1,
        transition: "opacity 0.24s",
        // lift the open node above its siblings so the panel isn't painted under them
        zIndex: active ? 40 : undefined,
      }}
    >
      {/* trace — draws left-to-right, out of the portrait's silhouette */}
      <motion.span
        aria-hidden
        className="mt-[13px] h-px w-[clamp(16px,2.5vw,48px)] shrink-0 origin-left bg-[var(--trace)] opacity-60"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: shown ? 1 : 0 }}
        transition={
          play ? { delay: traceDelay / 1000, duration: 0.5, ease: EASE } : { duration: 0 }
        }
      />

      {/* flex-1 so the wrapper owns the rest of the column: the pill stays
          w-max, while the panel below can use w-full to open rightward without
          any hard-coded width. */}
      <div className="relative ml-2 min-w-0 flex-1">
        <button
          type="button"
          aria-expanded={active}
          onClick={onToggle}
          onFocus={onEnter}
          onBlur={onLeave}
          onMouseEnter={onEnter}
          onMouseLeave={onLeave}
          className={cn(
            "w-max max-w-full rounded-sm border border-[var(--border)] px-3 py-1.5 text-left shadow-[0_12px_28px_rgba(0,0,0,0.18)] transition-shadow duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--glow)]",
            NODE_SURFACE
          )}
        >
          <span className="flex items-center gap-2">
            {/* terminal dot — the only thing that moves at idle */}
            <motion.span
              className="h-[3px] w-[3px] shrink-0 rounded-full bg-[var(--glow)] shadow-[0_0_8px_var(--glow)]"
              animate={shown ? { opacity: [0.5, 0.9, 0.5] } : { opacity: 0.5 }}
              transition={
                shown
                  ? { duration: 4, repeat: Infinity, ease: "easeInOut" }
                  : { duration: 0 }
              }
            />
            <span className="mono whitespace-nowrap text-[11px] uppercase tracking-[0.14em]">
              {out}
              <span
                className={cn(
                  "ml-0.5 inline-block h-3 w-1.5 bg-white align-middle transition-opacity duration-300",
                  caret ? "opacity-100" : "opacity-0"
                )}
              />
            </span>
          </span>
        </button>

        {/* Absolutely positioned: the panel opens down and to the right as a
            rectangle without displacing the other nodes, the status block, or
            anything else in the hero. */}
        <AnimatePresence initial={false}>
          {active && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -4 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -4 }}
              transition={{ duration: 0.26, ease: EASE }}
              className={cn(
                // min-w-full keeps it at least as wide as the pill; 240px makes
                // it visibly wider for the shorter labels. Verified to stay
                // inside the container at every desktop width.
                "absolute left-0 top-full z-40 mt-1.5 w-[240px] min-w-full max-w-[calc(100vw-3rem)] overflow-hidden rounded-sm border border-[var(--border)] shadow-[0_18px_40px_rgba(0,0,0,0.28)]",
                NODE_SURFACE
              )}
            >
              <div className="px-3 py-2.5">
                <NodeDetail node={node} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export function Hero() {
  const mode = useRevealMode();
  const play = mode === "play";
  const shown = mode !== "idle";
  const reduced = useReducedMotion() === true;

  const parallax = useParallax(mode === "play");
  const [activeId, setActiveId] = useState<string | null>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLElement>(null);
  const isInView = useInView(containerRef, { margin: "200px" });
  const router = useRouter();

  const enter = useCallback((id: string) => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => setActiveId(id), 120);
  }, []);
  const leave = useCallback(() => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => setActiveId(null), 120);
  }, []);
  useEffect(
    () => () => {
      if (hoverTimer.current) clearTimeout(hoverTimer.current);
    },
    []
  );

  /* transition factory — collapses to an instant swap when not playing */
  const tr = (delayMs: number, durMs: number) =>
    play ? { delay: delayMs / 1000, duration: durMs / 1000, ease: EASE } : { duration: 0 };

  const activeNode = NODES.find((n) => n.id === activeId) ?? null;

  return (
    <section
      ref={containerRef}
      id="home"
      className="relative isolate h-[100dvh] w-full overflow-hidden bg-[var(--bg-0)]"
    >
      {/* ---------------- backdrop ----------------
          Solid canvas (--bg-0) with one soft, heavily-blurred orb centred
          behind the portrait — dark-gray on light, zinc on dark — so the figure
          reads as lit from behind rather than pasted onto a flat field.
          Replaces the aperture image. */}
      <motion.div
        className="absolute inset-0 -z-10"
        initial={{ opacity: 0, scale: 1.04 }}
        animate={{ opacity: shown ? 1 : 0, scale: shown ? 1 : 1.04 }}
        transition={tr(0, 500)}
        style={{
          transform: `translate3d(${parallax.x * -3}px, ${parallax.y * -3}px, 0)`,
        }}
      >
        <div className="absolute left-1/2 top-[46%] h-[min(78vh,760px)] w-[min(78vh,760px)] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[90px] bg-[radial-gradient(circle,rgba(82,88,98,0.50)_0%,rgba(82,88,98,0.26)_45%,rgba(82,88,98,0)_72%)] dark:bg-[radial-gradient(circle,rgba(63,63,70,0.90)_0%,rgba(63,63,70,0.40)_45%,rgba(63,63,70,0)_72%)]" />
      </motion.div>

      {/* ---------------- portrait ---------------- */}
      <motion.div
        className="pointer-events-none absolute inset-x-0 bottom-[12vh] md:bottom-[clamp(24px,5vh,60px)] z-0 flex justify-center"
        initial={{ opacity: 0, y: 32 }}
        animate={{
          opacity: shown ? 1 : 0,
          y: shown ? 0 : 32,
        }}
        transition={tr(300, 600)}
      >
        <div
          /* 60dvh on phones: bottom-anchored, so anything smaller leaves a dead
             band between the headline and his head that grows with screen
             height. At 60dvh he tucks up behind the headline (he's z-0, the
             text is z-10, and the top scrim fades him) and still clears the
             260px min width from spec.md §8. */
          className="group pointer-events-auto relative aspect-[1824/2334] h-[60dvh] min-w-[260px] md:h-[70dvh] min-[1100px]:h-[80dvh]"
          style={{
            transform: `translate3d(${parallax.x * -8}px, ${parallax.y * -8}px, 0)`,
          }}
        >
          {/* cast shadow — anchors him to a floor so he isn't a sticker */}
          <div
            aria-hidden
            className="absolute inset-x-[15%] bottom-0 h-[52px] rounded-[50%] bg-black/35 blur-[40px] dark:bg-black/60"
          />
          {/* spec.md §4.3 asks for a rim light here. The blurred screen-blended
              silhouette that used to sit behind him read as a glass halo, so it
              is removed; the de-fringed matte plus the cast shadow carry the
              grounding on their own. */}
          <Image
            src={PORTRAIT}
            alt="Hamza Ahmad — software engineer and architect, standing with arms crossed"
            fill
            preload
            sizes="(max-width: 1100px) 70vw, 34vw"
            className="object-contain object-bottom [filter:grayscale(1)_contrast(1.05)] transition-[filter] duration-[640ms] ease-[cubic-bezier(.16,1,.3,1)] group-hover:[filter:grayscale(0)_contrast(1)]"
          />
        </div>
      </motion.div>

      {/* ---------------- scrims (spec.md §3) ----------------
          Below 1100px: top/bottom bands for poster mode.
          At >=1100px: soft radial pools under each text margin. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
        {/* Poster mode. The two themes need different strengths: on light, dark
            text sits over a dark suit and needs a dense white scrim; on dark,
            white text over that same suit already reads, so a lighter scrim
            keeps the portrait visible instead of washing it out. */}
        <div className="absolute inset-x-0 top-0 h-[38%] bg-gradient-to-b from-[rgba(240,241,244,0.95)] via-[rgba(240,241,244,0.5)] to-transparent dark:from-[rgba(8,10,14,0.92)] dark:via-[rgba(8,10,14,0.35)] min-[1100px]:hidden" />
        <div className="absolute inset-x-0 bottom-0 h-[58%] bg-gradient-to-t from-[rgba(240,241,244,0.97)] via-[rgba(240,241,244,0.8)] to-transparent dark:from-[rgba(8,10,14,0.95)] dark:via-[rgba(8,10,14,0.45)] min-[1100px]:hidden" />

        <div className="absolute inset-y-0 left-0 hidden w-[38%] bg-[radial-gradient(ellipse_at_center,rgba(240,241,244,0.85)_0%,rgba(240,241,244,0.6)_40%,rgba(240,241,244,0)_85%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(8,10,14,0.75)_0%,rgba(8,10,14,0.55)_40%,rgba(8,10,14,0)_85%)] min-[1100px]:block" />
        <div className="absolute inset-y-0 right-0 hidden w-[38%] bg-[radial-gradient(ellipse_at_center,rgba(240,241,244,0.85)_0%,rgba(240,241,244,0.6)_40%,rgba(240,241,244,0)_85%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(8,10,14,0.75)_0%,rgba(8,10,14,0.55)_40%,rgba(8,10,14,0)_85%)] min-[1100px]:block" />
      </div>

      {/* ---------------- glassy prisms ----------------
          After the scrims (so they aren't painted over) and z-0 (in front of the
          portrait but behind the z-10 text). backdrop-blur refracts whatever's
          behind them; the two-tone facet meets at the 50% ridge to fake a 3D
          fold; drop-shadow — not box-shadow — respects the triangle clip-path.
          Positioned in the open gaps, clear of his face and the text glyphs. */}
      {/* md+ only: the percentage positions are tuned for a wide viewport, so
          on a phone they land on the headline, the subcopy and his face. */}
      {isInView && (
        <div aria-hidden className="pointer-events-none absolute inset-0 z-0 hidden md:block">
          {PRISMS.map((p, i) => (
            <motion.div
              key={i}
              /* Light: black-and-slate glass — slate light-face, near-black
                 shadow-face, brighter slate ridge, with a soft dark halo for
                 depth. Dark: glowing white, screen-blended. */
              className="absolute backdrop-blur-[2px] bg-[linear-gradient(110deg,rgba(71,85,105,0.92)_0_47%,rgba(100,116,139,0.98)_47%_53%,rgba(15,23,42,0.95)_53%_100%)] drop-shadow-[0_1px_10px_rgba(15,23,42,0.4)] dark:bg-[linear-gradient(110deg,rgba(255,255,255,0.5)_0_47%,rgba(255,255,255,0.95)_47%_53%,rgba(255,255,255,0.14)_53%_100%)] dark:drop-shadow-[0_0_16px_rgba(255,255,255,0.7)] dark:mix-blend-screen"
              style={{ width: p.size, height: p.size, top: p.top, left: p.left, clipPath: TRI }}
              initial={{ opacity: 0, rotate: p.rot }}
              animate={{
                opacity: shown ? 0.9 : 0,
                rotate: reduced ? p.rot : [p.rot, p.rot + 6, p.rot],
                y: reduced ? 0 : [0, -12, 0],
              }}
              transition={
                reduced
                  ? { duration: 0 }
                  : { duration: p.dur, repeat: Infinity, ease: "easeInOut", delay: p.delay }
              }
            />
          ))}
        </div>
      )}

      {/* ---------------- content ----------------
          Same box as <Container> and the nav (max-w-[82rem] + px-6/10/16) so the
          hero's margins line up with the header and every section below it. */}
      <div className="relative z-10 mx-auto h-full w-full max-w-[82rem] px-6 md:px-10 lg:px-16">
        {/* extra bottom padding below 1100px keeps the chip row clear of the
            absolutely-positioned scroll cue.

            Side tracks are minmax(0,1fr), not 1fr: a bare 1fr floors at
            min-content, and the clamp(40px,8vw,96px) headline made column 1
            demand 522px. That inflated the row and pushed the right column ~120px
            past the container — which is what misaligned it against the nav. */}
        <div className="grid h-full grid-cols-1 pb-[clamp(58px,8vh,72px)] pt-[calc(env(safe-area-inset-top)+104px)] min-[1100px]:grid-cols-[minmax(0,1.35fr)_clamp(320px,26vw,420px)_minmax(0,0.95fr)] min-[1100px]:gap-8 min-[1100px]:pt-[calc(env(safe-area-inset-top)+84px)] min-[1100px]:pb-[clamp(20px,4vh,44px)]">
          {/* LEFT margin — on mobile this splits to the top and bottom of the
              poster; at >=1100px the two groups sit together, centered. */}
          <div className="flex h-full flex-col justify-between min-[1100px]:justify-center min-[1100px]:gap-7 relative">
            <div>
              <motion.p
                className="eyebrow"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: shown ? 1 : 0, y: shown ? 0 : 10 }}
                transition={tr(500, 500)}
              >
                Software Engineer &amp; Architect
              </motion.p>

              {/* Scaled to the left track. spec.md §8 specifies max 96px, but
                  that assumed a full-bleed hero; inside the 82rem box that
                  aligns with the nav, 96px overflows its own clip mask. */}
              <h1 className="display mt-4 text-[clamp(36px,5vw,68px)] text-[var(--ink)]">
                {HEADLINE.map((line, i) => (
                  <span key={line} className="block overflow-hidden pb-2 -mb-2">
                    <motion.span
                      className="block"
                      initial={{ y: "110%" }}
                      animate={{ y: shown ? 0 : "110%" }}
                      transition={tr(500 + i * 90, 700)}
                    >
                      {line}
                    </motion.span>
                  </span>
                ))}
              </h1>
            </div>

            {/* `contents` at >=1100px so these three become direct children of
                the centered column instead of a bottom-pinned group. */}
            <div className="min-[1100px]:contents">
              <motion.p
                className="max-w-[46ch] text-[13px] md:text-[clamp(15px,1.3vw,18px)] leading-[1.55] tracking-[-0.005em] text-[var(--muted)]"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: shown ? 1 : 0, y: shown ? 0 : 12 }}
                transition={tr(600, 600)}
              >
                Not just writing code. Designing scalable architecture,
                integrating AI models, and forging premium interactions.
              </motion.p>

              <motion.div
                className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 min-[1100px]:mt-0"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: shown ? 1 : 0, y: shown ? 0 : 12 }}
                transition={tr(700, 600)}
              >
                <MagneticButton>
                  {/* rounded-sm overrides Button's default rounded-full — the
                      theme reads sharp/schematic, not pill-shaped. */}
                  <Button size="lg" className="rounded-sm h-10 px-5 text-sm md:h-12 md:px-8 md:text-base" onClick={() => router.push("/projects")}>
                    Explore Work
                  </Button>
                </MagneticButton>
                <Button
                  variant="ghost"
                  size="lg"
                  className="link-underline rounded-sm px-1 hover:bg-transparent h-10 text-sm md:h-12 md:text-base"
                  onClick={() => router.push("/contact")}
                >
                  Contact →
                </Button>
              </motion.div>



              {/* the right margin doesn't exist below 1100px, so the rail
                  is pinned to the bottom right of the container instead */}
              <motion.div
                className="absolute right-0 bottom-0 min-[1100px]:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: shown ? 1 : 0 }}
                transition={tr(900, 600)}
              >
                <SocialRail className="flex-col gap-3" />
              </motion.div>
            </div>
          </div>

          {/* CENTER — the portrait's lane. Intentionally empty: the portrait is
              positioned against the section so it can bleed past this column. */}
          <div aria-hidden className="hidden min-[1100px]:block" />

          {/* RIGHT margin — nodes top-aligned to the shoulder, status pinned. */}
          <div className="hidden min-[1100px]:flex min-[1100px]:flex-col min-[1100px]:items-end min-[1100px]:pt-[8vh] min-[1100px]:pr-[20%]">
            <div className="flex flex-col items-start w-fit h-full">
              <div className="flex flex-col items-start gap-4">
                {NODES.map((n, i) => (
                  <SchematicNode
                    key={n.id}
                    node={n}
                    index={i}
                    mode={mode}
                    active={activeId === n.id}
                    dimmed={activeId !== null && activeId !== n.id}
                    onEnter={() => enter(n.id)}
                    onLeave={leave}
                    onToggle={() => setActiveId(activeId === n.id ? null : n.id)}
                  />
                ))}
              </div>

              <motion.div
                className="mt-auto pb-[10vh] flex flex-col w-full items-start"
                initial={{ opacity: 0 }}
                animate={{ opacity: shown ? 1 : 0 }}
                transition={tr(1300, 500)}
              >
                <SocialRail className="mb-8" />
                <div className="h-px w-10 bg-[var(--border)]" />
                <p className="eyebrow mt-3">Status</p>
                <p className="mt-1.5 flex items-center gap-2 text-sm text-[var(--ink)]">
                  <motion.span
                    className="h-1.5 w-1.5 rounded-full bg-[var(--ink)] dark:bg-[var(--glow)] dark:shadow-[0_0_8px_var(--glow)]"
                    animate={shown ? { opacity: [0.5, 1, 0.5] } : { opacity: 0.5 }}
                    transition={
                      shown
                        ? { duration: 4, repeat: Infinity, ease: "easeInOut" }
                        : { duration: 0 }
                    }
                  />
                  Available for roles
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------- scroll cue ---------------- */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-[clamp(12px,2.5vh,24px)] z-10 flex justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: shown ? 1 : 0 }}
        transition={tr(1400, 400)}
      >
        <span className="eyebrow text-[0.62rem]">▾ Scroll</span>
      </motion.div>

      {/* One light-sweep across the aperture at t=1600. Never repeats. */}
      {play && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 z-10 w-[26%] -skew-x-12 bg-gradient-to-r from-transparent via-white/15 to-transparent"
          initial={{ x: "-40vw", opacity: 0 }}
          animate={{ x: "130vw", opacity: [0, 1, 0] }}
          transition={{ delay: 1.6, duration: 0.9, ease: "easeInOut" }}
        />
      )}
    </section>
  );
}
