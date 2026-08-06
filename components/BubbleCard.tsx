"use client";

import { motion, useMotionValue, useSpring, HTMLMotionProps } from "framer-motion";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

/* ---------------------------------------------------------------------------
   Cursor-following bubble that inverts whatever it passes over.

   `bg-white` + `mix-blend-difference` works in both themes without a variant:
   difference against white flips the underlying pixels, so light cards go dark
   and dark cards go light with one declaration.

   Stacking contract — the bubble sits at z-20, so:
     - static content goes at z-10 and should be pointer-events-none
     - anything interactive goes at z-30 to stay clickable and un-inverted

   Was copy-pasted into Education.tsx and Experience.tsx; both now import this.
--------------------------------------------------------------------------- */

export function BubbleCard({
  children,
  className,
  bubbleSize = 224,
  ...props
}: HTMLMotionProps<"div"> & {
  children: React.ReactNode;
  /** px diameter of the inverting bubble */
  bubbleSize?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const { left, top } = ref.current.getBoundingClientRect();
    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn("relative overflow-hidden group", className)}
      {...props}
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute z-20 rounded-full bg-white mix-blend-difference"
        style={{
          width: bubbleSize,
          height: bubbleSize,
          x: smoothX,
          y: smoothY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.2 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      />
      {children}
    </motion.div>
  );
}
