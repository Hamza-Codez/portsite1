"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence, useScroll, useMotionValueEvent, useReducedMotion } from "framer-motion";
import { useLenis } from "lenis/react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Projects", href: "/projects" },
  { name: "Education", href: "/education" },
  { name: "Contact", href: "/#contact" },
];

/* Desktop keeps the text items for the top bar rhythm, but excludes Contact
   so it's not repeated next to the primary action button. */
const desktopItems = navItems.filter((i) => i.name !== "Contact");

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
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);

  const { scrollY } = useScroll();

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

  const toggleTheme = () => setTheme(resolvedTheme === "dark" ? "light" : "dark");

  return (
    <>
      <motion.header
        className={cn(
          "fixed top-0 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 pt-[env(safe-area-inset-top)]",
        )}
      >
        <div 
          className={cn(
            "relative flex items-center justify-between gap-4 px-4 py-1.5 transition-all duration-500",
            "bg-black dark:bg-white shadow-2xl rounded-b-lg md:rounded-b-[24px]",
            isScrolled ? "pb-1.5" : "pb-2.5",
            "w-[calc(100vw-2rem)] md:w-auto"
          )}
        >
          {/* Inverse Corners for sticky top connection */}
          <svg className="hidden md:block absolute top-0 -left-[24px] w-[24px] h-[24px] text-black dark:text-white fill-current pointer-events-none" viewBox="0 0 24 24">
            <path d="M 0 0 L 24 0 L 24 24 A 24 24 0 0 0 0 0 Z" />
          </svg>
          <svg className="hidden md:block absolute top-0 -right-[24px] w-[24px] h-[24px] text-black dark:text-white fill-current pointer-events-none" viewBox="0 0 24 24">
            <path d="M 0 0 L 24 0 A 24 24 0 0 0 0 24 L 0 0 Z" />
          </svg>

          {/* Brand */}
          <div className="flex items-center font-bold tracking-tight text-lg text-white dark:text-black px-4 whitespace-nowrap">
            <Link href="/" className="flex items-center gap-3 whitespace-nowrap" onClick={() => setIsOpen(false)}>
              <img src="/assets/logo.png" alt="HA Logo" className="w-8 h-8 object-contain dark:invert mix-blend-screen dark:mix-blend-multiply" />
              <span className="px-1">Hamza Ahmad</span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1 text-white/70 dark:text-black/70 text-sm font-medium px-4">
            {desktopItems.map((item) => {
              const on = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  aria-current={on ? "page" : undefined}
                  className={cn(
                    "px-4 py-1.5 rounded-full transition-colors duration-300",
                    on ? "text-white bg-white/15 dark:text-black dark:bg-black/10" : "hover:text-white hover:bg-white/5 dark:hover:text-black dark:hover:bg-black/5"
                  )}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2 pr-1">
            {/* Primary Action Button */}
            <Link 
              href={pathname === "/" ? "#contact" : "/#contact"} 
              className="hidden md:flex items-center gap-2 bg-white text-black dark:bg-black dark:text-white px-4 py-1.5 rounded-full text-sm font-bold hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors shadow-sm"
            >
              Contact
            </Link>

            {/* Theme Toggle */}
            {mounted && (
              <button
                onClick={toggleTheme}
                className="w-8 h-8 rounded-full hover:bg-white/15 dark:hover:bg-black/10 transition-colors text-white dark:text-black flex items-center justify-center"
                aria-label="Toggle theme"
              >
                {resolvedTheme === "dark" ? <MoonIcon /> : <SunIcon />}
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              ref={triggerRef}
              onClick={() => setIsOpen((v) => !v)}
              className="md:hidden w-8 h-8 flex flex-col items-center justify-center gap-[4px] rounded-full text-white dark:text-black hover:bg-white/15 dark:hover:bg-black/10 transition-colors"
            >
              <motion.span
                animate={isOpen ? { rotate: 45, y: 3.5 } : { rotate: 0, y: 0 }}
                className="block h-[1.5px] w-4 bg-current origin-center"
              />
              <motion.span
                animate={isOpen ? { rotate: -45, y: -3.5 } : { rotate: 0, y: 0 }}
                className="block h-[1.5px] w-4 bg-current origin-center"
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
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: prefersReduced ? 0 : 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: prefersReduced ? 0 : 0.4,
                    delay: prefersReduced ? 0 : 0.04 + i * 0.035,
                    ease: EASE,
                  }}
                  className="flex"
                >
                  <Link 
                    href={pathname === "/" && item.href.startsWith("/#") ? item.href.substring(1) : item.href} 
                    onClick={() => setIsOpen(false)}
                    aria-current={pathname === item.href ? "page" : undefined}
                    className={cn(
                      "group flex items-baseline gap-4 border-b border-border py-5 transition-colors w-full",
                      pathname === item.href ? "text-foreground" : "text-foreground/50"
                    )}
                  >
                    <span className="mono text-[0.68rem] tracking-[0.28em] text-muted">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-2xl font-medium tracking-tight">{item.name}</span>
                    {pathname === item.href && (
                      <span className="ml-auto h-1.5 w-1.5 self-center rounded-full bg-foreground" />
                    )}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
