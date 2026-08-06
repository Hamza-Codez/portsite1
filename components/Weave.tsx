"use client";

import * as React from "react";
import { motion } from "framer-motion";

/**
 * Woven line field.
 *
 * Renders a set of interlacing sine strands — horizontal and vertical — that
 * cross like threads on a loom. Kept extremely faint so it reads as texture,
 * never decoration. Slowly drifts unless the user prefers reduced motion.
 */
export function Weave({
  className = "",
  density = 7,
  accent = false,
}: {
  className?: string;
  density?: number;
  accent?: boolean;
}) {
  const W = 1200;
  const H = 700;
  const rows = density;
  const cols = Math.round(density * 1.6);

  const horizontals = React.useMemo(
    () =>
      Array.from({ length: rows }, (_, i) => {
        const y = (H / (rows + 1)) * (i + 1);
        const amp = 26 + (i % 3) * 10;
        const k = 3 + (i % 2);
        let d = `M -100 ${y}`;
        for (let x = -100; x <= W + 100; x += 20) {
          const yy = y + Math.sin((x / W) * Math.PI * k + i) * amp;
          d += ` L ${x} ${yy.toFixed(1)}`;
        }
        return d;
      }),
    [rows]
  );

  const verticals = React.useMemo(
    () =>
      Array.from({ length: cols }, (_, i) => {
        const x = (W / (cols + 1)) * (i + 1);
        const amp = 18 + (i % 3) * 8;
        const k = 2 + (i % 2);
        let d = `M ${x} -100`;
        for (let y = -100; y <= H + 100; y += 20) {
          const xx = x + Math.sin((y / H) * Math.PI * k + i) * amp;
          d += ` L ${xx.toFixed(1)} ${y}`;
        }
        return d;
      }),
    [cols]
  );

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      <svg
        className="animate-weave-drift h-full w-full"
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <g stroke={accent ? "var(--weave-strong)" : "var(--weave)"} strokeWidth="1">
          {horizontals.map((d, i) => (
            <path key={`h-${i}`} d={d} />
          ))}
          {verticals.map((d, i) => (
            <path key={`v-${i}`} d={d} />
          ))}
        </g>
      </svg>
    </div>
  );
}

/**
 * Hero centerpiece.
 *
 * An abstract woven system: concentric orbits drawn on with a stagger, a slowly
 * rotating gradient sweep, and floating nodes that hint at a product graph.
 * Purely illustrative — it carries the "engineered, not decorated" feeling.
 */
export function WeaveOrb() {
  const rings = [40, 78, 116, 154];
  const nodes = [
    { a: -35, r: 154 },
    { a: 60, r: 116 },
    { a: 155, r: 154 },
    { a: 220, r: 78 },
    { a: 285, r: 116 },
  ];

  const polar = (angleDeg: number, radius: number) => {
    const a = (angleDeg * Math.PI) / 180;
    return { x: 200 + Math.cos(a) * radius, y: 200 + Math.sin(a) * radius };
  };

  return (
    <div className="relative aspect-square w-full">
      <div className="absolute inset-0 rounded-[2.5rem] border border-border bg-surface/40 backdrop-blur-sm" />
      {/* Soft brand glow */}
      <div className="absolute inset-8 rounded-full bg-brand/10 blur-3xl animate-float-slow" />

      <svg
        viewBox="0 0 400 400"
        className="absolute inset-0 h-full w-full"
        fill="none"
      >
        <defs>
          <linearGradient id="weave-sweep" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--brand)" stopOpacity="0.9" />
            <stop offset="60%" stopColor="var(--brand-soft)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="var(--brand)" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="weave-core" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--brand-soft)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="var(--brand)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Concentric orbit rings, drawn on with a stagger */}
        {rings.map((r, i) => (
          <motion.circle
            key={r}
            cx="200"
            cy="200"
            r={r}
            stroke="var(--border)"
            strokeWidth="1.25"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.6, delay: 0.3 + i * 0.2, ease: "easeInOut" }}
          />
        ))}

        {/* Rotating brand sweep, tracing the outer ring */}
        <g className="animate-spin-slow" style={{ transformOrigin: "200px 200px" }}>
          <motion.circle
            cx="200"
            cy="200"
            r="154"
            stroke="url(#weave-sweep)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="240 800"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, delay: 0.5, ease: "easeInOut" }}
          />
        </g>

        {/* Woven connections between nodes */}
        {nodes.map((n, i) => {
          const p = polar(n.a, n.r);
          const next = nodes[(i + 1) % nodes.length];
          const q = polar(next.a, next.r);
          return (
            <motion.path
              key={`link-${i}`}
              d={`M ${p.x.toFixed(1)} ${p.y.toFixed(1)} Q 200 200 ${q.x.toFixed(
                1
              )} ${q.y.toFixed(1)}`}
              stroke="var(--brand)"
              strokeOpacity="0.35"
              strokeWidth="1"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.4, delay: 1 + i * 0.12, ease: "easeInOut" }}
            />
          );
        })}

        {/* Core */}
        <circle cx="200" cy="200" r="46" fill="url(#weave-core)" />
        <motion.circle
          cx="200"
          cy="200"
          r="7"
          fill="var(--brand)"
          animate={{ scale: [1, 1.35, 1] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "200px 200px" }}
        />

        {/* Floating nodes */}
        {nodes.map((n, i) => {
          const p = polar(n.a, n.r);
          return (
            <motion.g
              key={`node-${i}`}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 1.2 + i * 0.12 }}
              style={{ transformOrigin: "center" }}
            >
              <motion.circle
                cx={p.x}
                cy={p.y}
                r="6"
                fill="var(--background)"
                stroke="var(--brand)"
                strokeWidth="2"
                animate={{ cy: [p.y, p.y - 6, p.y] }}
                transition={{
                  duration: 4 + i,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.3,
                }}
              />
            </motion.g>
          );
        })}
      </svg>
    </div>
  );
}
