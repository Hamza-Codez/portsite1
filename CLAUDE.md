# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository shape

The repo root is `f:\project\Portfolio`, but **all code lives in [frontend/](frontend/)** — that is also the git root. Run every command from `frontend/`.

Two design documents sit at the root and are the source of truth for *intent*, not code:
- [intent.md](intent.md) — the overall design brief (voice, motion philosophy, section-by-section purpose, writing style rules).
- [spec.md](spec.md) — a detailed spec for the "The Mindset" refactor→schematic section (strict black/white/gray, FLIP token-fly, φ layout split).

Read the relevant one before making design decisions; they encode deliberate constraints that are not obvious from the code.

## Commands

```bash
cd frontend
npm run dev      # next dev
npm run build    # next build
npm run start
npm run lint     # eslint (flat config, eslint-config-next core-web-vitals + typescript)
npx tsc --noEmit # typecheck; there is no separate script
```

There is no test suite.

## Next.js version

`frontend/AGENTS.md` (included by `frontend/CLAUDE.md`) applies: this is **Next.js 16 with React 19** and its APIs differ from older Next.js. Consult `frontend/node_modules/next/dist/docs/` before writing framework-level code rather than relying on recalled conventions.

## Architecture

Single-page app. [app/page.tsx](frontend/app/page.tsx) composes nine section components in scroll order (Hero → About → Process → Skills → Projects → Testimonials → Experience → Education → Contact). Each section owns its own `id="..."` anchor, is a `"use client"` component, and lives in [components/sections/](frontend/components/sections/).

[app/layout.tsx](frontend/app/layout.tsx) wraps everything in three global concerns:
- `Providers` — `next-themes` with `attribute="class"`, so dark mode is the `.dark` class on `<html>`.
- `CustomCursor` — a spring-follow cursor, hidden on coarse pointers.
- `SmoothScroll` — Lenis (`lerp: 0.05`), which replaces native scrolling. Anything scroll-linked must account for Lenis, and containers that need native scroll need `data-lenis-prevent`.

### Primitives vs. sections

`components/*.tsx` are shared primitives — `Container` (max-width + responsive padding), `Section` (vertical rhythm), `Typography` (`Heading`/`Text`/`Lead`), `Card`, `Button`, `Weave`, `SectionDivider`. [components/editorial.tsx](frontend/components/editorial.tsx) holds the composed editorial motifs: `Reveal` (masked line rise), `Rise`, `RuleRow`, `SectionHeader`, `ArrowLink`, `Marquee`. Prefer composing these over inventing new one-off layout wrappers.

All class merging goes through `cn()` in [lib/utils.ts](frontend/lib/utils.ts) (clsx + tailwind-merge). Import alias is `@/*` → project root.

### Design tokens

Tailwind v4 — **no `tailwind.config.js`**. Theme is defined entirely in [app/globals.css](frontend/app/globals.css): CSS custom properties on `:root` / `.dark`, then exposed to Tailwind via `@theme inline`. Three token families coexist there:
- Core (`--background`, `--foreground`, `--surface`, `--border`, `--muted`, `--accent`).
- `--mindset-*` — the strict monochrome palette for the spec.md section.
- `--vsc-*` — VS Code syntax colors, deliberately all-black in light mode.

Add new colors as a `:root` + `.dark` pair *and* an `@theme inline` entry, or the Tailwind utility won't exist.

Shared utility classes also live in globals.css: `.display`, `.headline`, `.eyebrow`, `.mono`, `.glass`, `.glass-nav`, `.link-underline`, `.aurora`.

### Motion

`framer-motion` throughout, with the shared easing `[0.22, 1, 0.36, 1]`. Section entrances use `whileInView` + `viewport={{ once: true }}`. Honor `prefers-reduced-motion` — globals.css neutralizes durations globally, and richer sections (Hero, About) additionally branch on `useReducedMotion()`; new animated sections should do the same rather than relying on the CSS override alone.

## Known inconsistencies

- [Navigation.tsx](frontend/components/Navigation.tsx) toggles the `.dark` class on `document.documentElement` directly, bypassing `next-themes`. Its state desyncs from the provider and does not persist. Use `useTheme()` if you touch it.
- `Navigation`'s `navItems` lists only 5 of the 9 sections, so Process / Skills / Testimonials / Education are unreachable from the nav, and the mobile "Menu" button is a non-functional placeholder — which conflicts with intent.md's "no placeholders, every interaction performs a meaningful action."
- `editorial.tsx` uses `text-faint` and `border-hairline`, which are **not defined** in globals.css and currently resolve to nothing.
