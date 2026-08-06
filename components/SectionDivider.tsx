"use client";

import * as React from "react";
import { motion } from "framer-motion";

/**
 * Animated woven divider that bridges two sections.
 *
 * Two sine strands cross repeatedly like a running stitch, drawing themselves on
 * as they scroll into view, with a small brand node riding the seam. It gives
 * each section boundary a deliberate, engineered transition rather than a hard cut.
 */
export function SectionDivider({
  flip = false,
  label,
}: {
  flip?: boolean;
  label?: string;
}) {
  const W = 1200;
  const H = 80;
  const mid = H / 2;
  const k = 14; // number of stitch waves across the width
  const amp = 18;

  const build = (phase: number) => {
    let d = `M 0 ${mid}`;
    for (let x = 0; x <= W; x += 8) {
      const y = mid + Math.sin((x / W) * Math.PI * k + phase) * amp;
      d += ` L ${x} ${y.toFixed(1)}`;
    }
    return d;
  };

  const strandA = build(0);
  const strandB = build(Math.PI);

  return (
    <div
      aria-hidden
      className="relative flex items-center justify-center overflow-hidden py-2"
      style={{ transform: flip ? "scaleY(-1)" : undefined }}
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-16 w-full max-w-6xl px-6"
        fill="none"
        preserveAspectRatio="none"
      >
        <motion.path
          d={strandA}
          stroke="var(--border)"
          strokeWidth="1.5"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 1.4, ease: "easeInOut" }}
        />
        <motion.path
          d={strandB}
          stroke="var(--weave-strong)"
          strokeWidth="1.5"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 1.4, ease: "easeInOut", delay: 0.15 }}
        />
        <motion.circle
          cx={W / 2}
          cy={mid}
          r="4"
          fill="var(--brand)"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 1.2, type: "spring" }}
          style={{ transformOrigin: `${W / 2}px ${mid}px` }}
        />
      </svg>

      {label && (
        <span
          className="absolute rounded-full border border-border bg-background px-4 py-1 font-mono text-[10px] uppercase tracking-[0.3em] text-muted"
          style={{ transform: flip ? "scaleY(-1)" : undefined }}
        >
          {label}
        </span>
      )}
    </div>
  );
}
