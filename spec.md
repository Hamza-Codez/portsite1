2. Layout — three-column, 100dvh

Full viewport height. Portrait as the vertical anchor. Text in the left and right margins.

2.1 Desktop (≥1100px)
┌─────────────────────────────────────────────────────────────────┐
│  DevStudio                             Home  About …    ☾        │  ← nav, 72px
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ▸ SOFTWARE ENGINEER          │             │  ● AI ENTHUSIAST    │
│    & ARCHITECT                │             │                     │
│                               │             │  ● PROBLEM SOLVER   │
│  I engineer                   │  PORTRAIT   │                     │
│  digital                      │  (standing, │  ● SYSTEMS ARCHITECT│
│  experiences.                 │   centered, │                     │
│                               │   grounded) │  ─────              │
│  Not just writing code.       │             │  STATUS             │
│  Designing scalable           │             │  Available for roles│
│  architecture…                │             │                     │
│                               │             │                     │
│  [ Explore Work ]  Contact →  │             │                     │
│                                                                  │
│                              ▾ scroll                            │
└─────────────────────────────────────────────────────────────────┘
     LEFT (30%)             CENTER (40%)          RIGHT (30%)
Grid: grid-template-columns: 30fr 40fr 30fr. Portrait column can go narrower on ultrawide (clamp(360px, 34vw, 520px)) so text doesn't stretch to unreadable line-lengths.
Height: 100dvh (dynamic viewport — handles mobile browser chrome correctly). Nav sits inside, so hero content = 100dvh - nav.
Vertical alignment: Left column center-aligned to the portrait's chest. Right column top-aligned to the portrait's shoulder. Portrait bottom-aligned near the base of the frame (feels grounded, not floating).
Padding: clamp(24px, 4vw, 72px) outer; columns share the same rhythm.
2.2 Tablet (768–1099px)
Two rows: nav + hero. Hero collapses to center portrait + text stack.
Portrait remains centered horizontally, ~70% viewport width.
Left-column text moves ABOVE portrait (eyebrow, headline, subcopy). CTAs go BELOW portrait.
Right-column role nodes become a horizontal row of chips under the CTAs.
2.3 Mobile (<768px) — designed first

Editorial poster mode. Portrait dominates. Text overlays with scrim.

┌─────────────────────────┐
│  logo            ☰      │
├─────────────────────────┤
│ ▸ SOFTWARE ENGINEER     │  ← top scrim (dark→transparent)
│                         │
│ I engineer              │
│ digital experiences.    │
│                         │
│                         │
│      [ PORTRAIT ]       │  ← fills viewport, backdrop behind
│      (centered)         │
│                         │
│                         │
│ Not just writing code…  │  ← bottom scrim (transparent→dark)
│                         │
│ [ Explore Work ]  →     │
│                         │
│ ● AI  ● Solver  ● Arch  │  ← nodes as horizontal chips
└─────────────────────────┘
        (100dvh)
Backdrop image object-fit: cover, focal point centered on portrait.
Text overlays get scrim gradients (§3) so they never fight the background.
Nodes reduce to a compact horizontal row above the fold.
3. Legibility system — the hidden "polish"

This is the difference between "iridescent backdrop looks cool" and "the whole thing feels engineered." Text NEVER sits raw over the backdrop.

3.1 Side scrims (dark mode)

Both text columns get an ultra-subtle radial darken behind them so text sits on quiet gradient, not on chromatic mess.

css
.hero__col-left::before,
.hero__col-right::before {
  content: '';
  position: absolute; inset: 0;
  background: radial-gradient(ellipse at center,
    rgba(8,10,14,.75) 0%,
    rgba(8,10,14,.55) 40%,
    rgba(8,10,14,0)   85%);
  pointer-events: none;
  z-index: 1;
}
/* Text sits above at z-index: 2 */
3.2 Side scrims (light mode)
css
background: radial-gradient(ellipse at center,
  rgba(240,241,244,.85) 0%,
  rgba(240,241,244,.6)  40%,
  rgba(240,241,244,0)   85%);
3.3 Rule

Scrims are invisible on their own — they're just enough to guarantee AA text contrast (4.5:1 minimum) at the darkest/lightest chromatic point behind text. Test with a contrast checker on the busiest generated frame. If failing, deepen scrim by 5% until it passes; don't dim the backdrop.

3.4 Mobile scrims

Top scrim (behind eyebrow + headline) and bottom scrim (behind subcopy + CTAs) are linear vertical gradients with same intensity as §3.1/3.2. This is what makes mobile "poster mode" legible.

4. Portrait treatment
4.1 Source

Portrait is a transparent PNG cutout (subject only, no card, no background). Full body from knees up preferred so he reads as standing, not floating. Suit as-is.

4.2 Composition
Bottom-aligned to the hero base with ~40–60px clearance from the bottom edge (grounded, room to breathe).
Vertically fills ~85% of the hero height on desktop.
Slight cast shadow at his feet (soft radial rgba(0,0,0,.35) blurred 40px) — anchors him to a "floor" so he isn't a sticker.
4.3 Rim light + rendering
Add a subtle rim light on his edge (top-right or left, matching the aperture's brightest point) — 1–2px inner glow, mix-blend-mode: screen. This is what integrates him with the backdrop instead of pasting him onto it.
Faint color-grade to match the aperture: on dark, cool shadows / warm highlights; on light, softer overall.
Duotone rest state → color on hover stays from v2 (600ms, ease-out, plus a slow diagonal light-sweep).
4.4 Interactive presence

Micro parallax: on mouse move, portrait shifts up to 8px against the backdrop, backdrop shifts up to 3px against page. Disabled on touch and reduced-motion. This is what makes him feel inside the aperture, not glued on top.

5. Schematic nodes — evolved, restrained

The wired-nodes idea from v2 stays because it's your identity. But the backdrop now carries the atmosphere, so nodes get quieter — this is where more restraint = more premium.

Nodes live only on the right column, stacked vertically, not scattered around the portrait.
Traces are ultra-thin (0.75–1px), short, and go from each node's left edge to the portrait's silhouette. No orthogonal PCB routing — just a clean short line.
Terminal dots breathe subtly (opacity .5↔.9, 4s). Nothing else moves in idle.
On hover, the node-to-detail-card morph from hero-node-hover-card-spec.md applies as-is.
Status ("Available for roles") pinned at the bottom of the right column with a small pulse dot.
6. Motion — one calm reveal

Single ~1.8s choreography on first visit, once per session, prefers-reduced-motion respected.

t (ms)	Element	Motion
0 → 500	Backdrop	Fade 0→1, subtle scale(1.02→1)
300 → 900	Portrait	Rise y:32→0, blur 10→0, fade 0→1
500 → 1100	Left column	Line-by-line clip reveal, stagger 90ms
700 → 1300	CTAs	Fade + y:12→0, stagger 80ms
900 → 1600	Right nodes	Traces draw (stroke-dashoffset), then labels type-in, stagger 120ms per node
1400 → 1800	Scroll cue	Fade in
Master ease: cubic-bezier(.16, 1, .3, 1).
Optional single light-sweep across the aperture at t=1600, ~900ms. Never repeats.
Idle: portrait duotone breathes imperceptibly, terminal dots breathe. Nothing else.
7. Tokens
Color
Light                              Dark
--bg:         #EEF0F3              --bg:         #08090C
--surface:    #FFFFFF              --surface:    #101216
--ink:        #0E1116              --ink:        #F5F6F8
--muted:      #5B626D              --muted:      #9AA1AC
--hair:       rgba(14,17,22,.08)   --hair:       rgba(245,246,248,.10)
--scrim:      rgba(240,241,244,x)  --scrim:      rgba(8,10,14,x)
--node:       #0E1116              --node:       #000000
--node-ink:   #F5F6F8              --node-ink:   #F5F6F8
--trace:      #A6ADB8              --trace:      #3A3F47
--glow:       #FFFFFF              --glow:       #FFFFFF

The backdrop itself brings the chromatic hues — you don't paint them into components. That separation is what keeps the UI premium/neutral.

Type
Display: heavy grotesque, letter-spacing: -0.03em, line-height: 0.95. Options: Söhne Halbfett, Neue Haas Grotesk Display, General Sans, Inter Display (Inter only if you can't use the others — but not default weight).
Body: Inter / Söhne, -0.005em, 1.55 line-height.
Mono (utility): IBM Plex Mono or Space Mono at 11–12px, 0.14em tracking, uppercase. Eyebrow, node labels, status label all use this.
Motion
--ease-out: cubic-bezier(.16, 1, .3, 1)
--ease-io:  cubic-bezier(.65, 0, .35, 1)
reveal 1.8s · hover 640ms · type 28ms/char · trace 500ms
8. Responsive rules (mobile-first)
Design mobile first, then progressively enhance to tablet and desktop layouts.
Portrait always centered horizontally at every breakpoint.
Nav collapses to hamburger below 768px.
Text scales with clamp() — headline clamp(40px, 8vw, 96px), subcopy clamp(15px, 1.3vw, 18px).
Backdrop image object-fit: cover; object-position: center; at every size.
Never let the portrait scale below 260px width on mobile (readability of face).
9. Accessibility & performance
All text is real DOM, never baked into images.
Portrait alt="Varun — Software Engineer & Architect" with meaningful description.
Nodes are focusable buttons; keyboard opens the detail card same as hover.
prefers-reduced-motion: reduce: skip reveal / parallax / sweep; render final state; keep hover-to-color (it's user-initiated).
Contrast: verify AA (4.5:1) for all text at the busiest chromatic frame. Fix by deepening scrim, not dimming backdrop.
Backdrop image: WebP + AVIF, <picture> with mobile (portrait crop) and desktop (ultrawide) sources, lazy-decode high priority for LCP.
Animate only transform, opacity, filter, stroke-dashoffset. No layout thrash.
10. Acceptance criteria (A++ / anti-generic)
 Layout is portrait-centered / text-in-margins, not the left-text/right-image split.
 Hero is exactly 100dvh at every breakpoint; portrait always visible above the fold.
 Backdrop is a generated aperture asset with dispersion at the edges and a protected center — dark + light variants exist.
 Text zones use radial scrims tuned so all text passes AA contrast against the busiest chromatic frame.
 Portrait is a standing, grounded transparent PNG with cast shadow and rim light — reads as inside the aperture, not pasted on top.
 Schematic nodes survive but live only in the right column, restrained.
 One orchestrated 1.8s reveal, once per session, reduced-motion respected.
 Mobile is poster mode: portrait dominates, text overlays with top/bottom scrims. Not a card-shrunk desktop.
 Fails nothing on the test: "would this appear on a generic AI-generated portfolio?" Every element must have a reason.
Nice-to-have (optional polish)
On theme toggle, cross-fade backdrop asset over 400ms — no hard flip.
Backdrop can slowly scale(1.00 → 1.02) over 20s and back (Ken Burns), extremely subtle. Off by default.
On successful contact form submit (future), aperture flashes once (60ms brightness(1.05)). Delightful, invisible reward.