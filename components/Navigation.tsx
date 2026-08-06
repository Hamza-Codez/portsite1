"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence, useScroll, useMotionValueEvent, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { useLenis } from "lenis/react";
import { useTheme } from "next-themes";

const navItems = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Process", href: "#process" },
  { name: "Skills", href: "#skills" },
  { name: "Projects", href: "#projects" },
  { name: "Credentials", href: "#credentials" },
  { name: "Education", href: "#education" },
  { name: "Contact", href: "#contact" },
];

/* Desktop keeps five items for the top bar rhythm. Education replaced
   Experience here — the journey timeline moved into that section. */
const desktopItems = navItems.filter((i) =>
  ["Home", "About", "Projects", "Education", "Contact"].includes(i.name)
);

const EASE = [0.22, 1, 0.36, 1] as const;

/* A graphite gradient chip in both themes (kin to the hero's node labels), so
   the bar stays legible over either landing background. Light mode uses a
   lighter graphite (neutral-700→900) rather than a flat near-black slab, which
   read as too dark/harsh; dark mode lifts the other way (neutral-900→700).
   Border + inset sheen + drop shadow give the prominent, slightly glassy lift. */
const SURFACE =
  "bg-gradient-to-br from-neutral-700 to-neutral-900 dark:from-neutral-900 dark:to-neutral-700 border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.14)] transition-colors";

function SunIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
  );
}

function MoonIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
  );
}

export function Navigation() {
  const [activeSection, setActiveSection] = React.useState("Home");
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);

  const { scrollY, scrollYProgress } = useScroll();
  /* Whole-page scroll fraction, springed, driving the rail fill inside the nav.
     Ties the bar to the same progress-rail language as the Education timeline. */
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });
  const progressWidth = useTransform(progress, (v) => `${Math.min(1, Math.max(0, v)) * 100}%`);

  const lenis = useLenis();
  const { resolvedTheme, setTheme } = useTheme();
  const prefersReduced = useReducedMotion();

  const panelRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);

    // Active section — resolved against every section, not just the desktop five.
    const scrollPosition = latest + window.innerHeight / 3;
    for (let i = navItems.length - 1; i >= 0; i--) {
      const section = document.querySelector(navItems[i].href) as HTMLElement | null;
      if (section && section.offsetTop <= scrollPosition) {
        setActiveSection(navItems[i].name);
        break;
      }
    }
  });

  /* Lock scroll while the panel is open. Lenis owns scrolling, so stopping the
     instance is what actually holds the page still — overflow alone won't. */
  React.useEffect(() => {
    if (!isOpen) return;
    lenis?.stop();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      lenis?.start();
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, lenis]);

  /* Escape to close + focus trap, and restore focus to the trigger on close. */
  React.useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setIsOpen(false);
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;

      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    const raf = requestAnimationFrame(() => {
      panelRef.current?.querySelector<HTMLElement>("a[href]")?.focus();
    });

    // Captured now so cleanup restores focus to the element that opened the panel.
    const trigger = triggerRef.current;

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      cancelAnimationFrame(raf);
      trigger?.focus();
    };
  }, [isOpen]);

  const scrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsOpen(false);
    const element = document.querySelector(href);
    if (!element) return;
    // Defer so the panel's scroll-lock cleanup runs before we move the page.
    requestAnimationFrame(() => {
      element.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth" });
    });
  };

  const toggleTheme = () => setTheme(resolvedTheme === "dark" ? "light" : "dark");

  // Frame counter reads against ALL sections, not just the desktop five.
  const activeIndex = Math.max(0, navItems.findIndex((i) => i.name === activeSection));
  const total = String(navItems.length).padStart(2, "0");

  return (
    <>
      <motion.header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500 pt-[env(safe-area-inset-top)]",
          isScrolled ? "py-4" : "py-6"
        )}
      >
        <div className="max-w-[82rem] mx-auto px-6 md:px-10 lg:px-16 flex justify-between items-center">
          {/* Brand — same node-label surface as the hero (flat --node on light,
              neutral gradient on dark) so the bar is a solid dark chip that
              reads clearly over either theme. Terminal caret blinks alongside. */}
          <div className={cn("flex items-center font-semibold tracking-tighter text-xl text-white px-4 py-1 rounded-sm", SURFACE)}>
            Hamza<span className="text-white/45">&nbsp;Ahmad</span>
            <motion.span
              aria-hidden
              className="ml-1 inline-block h-3.5 w-[2px] bg-white/70 align-middle"
              animate={prefersReduced ? { opacity: 1 } : { opacity: [1, 1, 0, 0] }}
              transition={
                prefersReduced
                  ? undefined
                  : { duration: 1.1, repeat: Infinity, times: [0, 0.5, 0.5, 1], ease: "linear" }
              }
            />
          </div>

          {/* Desktop — a schematic bus: mono node labels on a rail that fills
              with page scroll, with a live NN/08 frame counter. Not the usual
              text-links-with-a-sliding-pill. */}
          <nav className={cn("hidden lg:flex items-center gap-4 text-white pl-4 pr-2 py-1 rounded-sm", SURFACE)}>
            {/* frame counter */}
            <span className="mono text-[11px] tabular-nums tracking-[0.16em] text-white/45">
              <span className="text-white/85">{String(activeIndex + 1).padStart(2, "0")}</span>
              /{total}
            </span>

            <span aria-hidden className="h-4 w-px bg-white/15" />

            {/* node labels on the fill rail */}
            <div className="relative flex items-center pb-1.5">
              {desktopItems.map((item) => {
                const on = activeSection === item.name;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={(e) => scrollTo(e, item.href)}
                    aria-current={on ? "true" : undefined}
                    className="group relative flex items-center gap-2 px-3.5 py-1.5"
                  >
                    <span
                      className={cn(
                        "h-1.5 w-1.5 shrink-0 rounded-full transition-all duration-300",
                        on
                          ? "bg-white shadow-[0_0_8px_rgba(255,255,255,0.75)]"
                          : "bg-white/30 group-hover:bg-white/70"
                      )}
                    />
                    <span
                      className={cn(
                        "mono text-[11px] uppercase tracking-[0.16em] transition-colors duration-300",
                        on ? "text-white" : "text-white/55 group-hover:text-white/90"
                      )}
                    >
                      {item.name}
                    </span>
                  </a>
                );
              })}

              {/* the rail + its scroll-progress fill */}
              <span aria-hidden className="pointer-events-none absolute inset-x-3.5 bottom-0 h-px bg-white/15" />
              <motion.span
                aria-hidden
                style={{ width: progressWidth }}
                className="pointer-events-none absolute bottom-0 left-3.5 h-px bg-white"
              />
            </div>

            <span aria-hidden className="h-4 w-px bg-white/15" />

            {mounted && (
              <button
                onClick={toggleTheme}
                className="p-2 rounded-sm hover:bg-white/10 transition-colors text-white/70 hover:text-white flex items-center justify-center"
                aria-label={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} theme`}
              >
                {resolvedTheme === "dark" ? <MoonIcon /> : <SunIcon />}
              </button>
            )}
          </nav>

          {/* Mobile controls — 44px minimum touch targets. */}
          <div className={cn("lg:hidden flex items-center gap-1 text-white px-2 py-1 rounded-sm", SURFACE)}>
            {mounted && (
              <button
                onClick={toggleTheme}
                className="h-10 w-10 flex items-center justify-center rounded-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                aria-label={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} theme`}
              >
                {resolvedTheme === "dark" ? <MoonIcon /> : <SunIcon />}
              </button>
            )}
            <button
              ref={triggerRef}
              onClick={() => setIsOpen((v) => !v)}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              aria-label={isOpen ? "Close menu" : "Open menu"}
              className="h-10 w-10 flex flex-col items-center justify-center gap-[5px] rounded-sm text-white hover:bg-white/10 transition-colors"
            >
              <motion.span
                animate={isOpen ? { rotate: 45, y: 3.5 } : { rotate: 0, y: 0 }}
                transition={{ duration: prefersReduced ? 0 : 0.3, ease: EASE }}
                className="block h-[1.5px] w-5 bg-current origin-center"
              />
              <motion.span
                animate={isOpen ? { rotate: -45, y: -3.5 } : { rotate: 0, y: 0 }}
                transition={{ duration: prefersReduced ? 0 : 0.3, ease: EASE }}
                className="block h-[1.5px] w-5 bg-current origin-center"
              />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu — full-surface panel, all nine sections. */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-menu"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReduced ? 0 : 0.28, ease: EASE }}
            className="fixed inset-0 z-40 lg:hidden bg-background flex flex-col overflow-y-auto overscroll-contain pt-[calc(env(safe-area-inset-top)+6rem)] pb-[calc(env(safe-area-inset-bottom)+2.5rem)] px-6"
            data-lenis-prevent
          >
            <nav className="flex flex-col">
              {navItems.map((item, i) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => scrollTo(e, item.href)}
                  initial={{ opacity: 0, y: prefersReduced ? 0 : 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: prefersReduced ? 0 : 0.4,
                    delay: prefersReduced ? 0 : 0.04 + i * 0.035,
                    ease: EASE,
                  }}
                  aria-current={activeSection === item.name ? "true" : undefined}
                  className={cn(
                    "group flex items-baseline gap-4 border-b border-border py-5 transition-colors",
                    activeSection === item.name ? "text-foreground" : "text-foreground/50"
                  )}
                >
                  <span className="mono text-[0.68rem] tracking-[0.28em] text-muted">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-2xl font-medium tracking-tight">{item.name}</span>
                  {activeSection === item.name && (
                    <span className="ml-auto h-1.5 w-1.5 self-center rounded-full bg-foreground" />
                  )}
                </motion.a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
