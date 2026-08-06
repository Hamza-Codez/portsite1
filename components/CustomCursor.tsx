"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useMediaQuery } from "@/lib/useMediaQuery";

export function CustomCursor() {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  /* Gate on a real hover-capable pointer rather than width. `hidden md:flex`
     alone left touch tablets (>=768px) with a cursor that tracked nothing. */
  const hasFinePointer = useMediaQuery("(hover: hover) and (pointer: fine)");

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { damping: 25, stiffness: 400, mass: 0.5 };
  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 16);
      cursorY.set(e.clientY - 16);
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    const handleHoverStart = () => setIsHovered(true);
    const handleHoverEnd = () => setIsHovered(false);

    window.addEventListener("mousemove", moveCursor);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseleave", handleMouseLeave);

    const clickableElements = document.querySelectorAll("a, button, input, [role='button']");
    clickableElements.forEach((el) => {
      el.addEventListener("mouseenter", handleHoverStart);
      el.addEventListener("mouseleave", handleHoverEnd);
    });

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseleave", handleMouseLeave);
      clickableElements.forEach((el) => {
        el.removeEventListener("mouseenter", handleHoverStart);
        el.removeEventListener("mouseleave", handleHoverEnd);
      });
    };
  }, [cursorX, cursorY]);

  if (!hasFinePointer) return null;

  return (
    <motion.div
      style={{
        translateX: smoothX,
        translateY: smoothY,
      }}
      initial={{ opacity: 0 }}
      animate={{ 
        opacity: isVisible ? 1 : 0,
        scale: isHovered ? 1.2 : 1,
      }}
      transition={{ opacity: { duration: 0.2 }, scale: { duration: 0.2 } }}
      className={`fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-[100] flex items-center justify-center transition-colors duration-200 ${isHovered ? 'border border-foreground/10 bg-foreground/5' : 'border border-foreground/30 bg-transparent'}`}
    >
      <motion.div 
        animate={{ scale: isHovered ? 0 : 1 }}
        className="w-1 h-1 bg-foreground rounded-full"
      />
    </motion.div>
  );
}
