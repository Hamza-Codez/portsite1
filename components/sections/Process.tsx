"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useRef, useState } from "react";
import { Section } from "@/components/Section";
import { Container } from "@/components/Container";
import { Heading, Text } from "@/components/Typography";

import { processSteps as steps } from "@/lib/profile";

// --- 1. Background Waves ---
const BackgroundWaves = () => {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-[0.04] dark:opacity-[0.06]">
      <motion.svg
        viewBox="0 0 2000 1000"
        className="w-[200vw] h-full object-cover"
        preserveAspectRatio="none"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ repeat: Infinity, duration: 45, ease: "linear" }}
      >
        <path d="M 0,300 C 250,100 250,500 500,300 C 750,100 750,500 1000,300 C 1250,100 1250,500 1500,300 C 1750,100 1750,500 2000,300" stroke="currentColor" strokeWidth="2" fill="none" />
        <path d="M 0,500 C 500,100 500,900 1000,500 C 1500,100 1500,900 2000,500" stroke="currentColor" strokeWidth="1" fill="none" />
        <path d="M 0,700 C 250,900 250,500 500,700 C 750,900 750,500 1000,700 C 1250,900 1250,500 1500,700 C 1750,900 1750,500 2000,700" stroke="currentColor" strokeWidth="3" fill="none" strokeDasharray="10 20" />
      </motion.svg>
    </div>
  );
};

// --- 2. Hover Card with Bubble Inversion ---
const HoverCard = ({ s, i }: { s: (typeof steps)[number]; i: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Spring config for smooth trailing bubble
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
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: i * 0.1 }}
      className="rounded-2xl p-6 sm:p-8 flex flex-col justify-between h-full min-h-[280px] sm:min-h-[300px] relative overflow-hidden group cursor-default border-[0.1px]  border-black/70 dark:border-white/50 bg-white dark:bg-foreground/[0.01] dark:backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none"
    >
      {/* Background Hover Dimming */}
      <div className="absolute inset-0 bg-black/[0.02] dark:bg-white/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      
      {/* 
        The Magic Bubble (mix-blend-difference) 
        bg-white + mix-blend-difference flawlessly handles both Light and Dark mode.
      */}
      <motion.div
        className="pointer-events-none absolute w-56 h-56 rounded-full bg-white mix-blend-difference z-20"
        style={{
          x: smoothX,
          y: smoothY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ 
          opacity: isHovered ? 1 : 0, 
          scale: isHovered ? 1 : 0.2 
        }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      />
      
      {/* Card Content Layer */}
      <div className="relative z-10 pointer-events-none">
        {/* We use group-hover:text-foreground so that when hovered, 
            the text is full opacity, creating the harshest, cleanest difference inversion */}
        <div className="text-5xl md:text-6xl font-medium tracking-tighter text-black/40 dark:text-white/20 mb-8 transition-colors duration-500 group-hover:text-black dark:group-hover:text-white">
          {s.n}
        </div>
        <h3 className="text-xl md:text-2xl font-semibold tracking-tight text-black dark:text-white mb-1">
          {s.t}
        </h3>
        <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.18em] text-black/50 dark:text-white/40">
          {s.sub}
        </p>
        <Text className="text-black/80 dark:text-white/60 leading-relaxed text-sm transition-colors duration-500 group-hover:text-black dark:group-hover:text-white">
          {s.d}
        </Text>
      </div>

      <div className="relative z-10 pointer-events-none mt-8 border-t border-black/15 dark:border-white/10 pt-4">
        <p className="font-mono text-[11px] tracking-[0.14em] uppercase text-black/60 dark:text-white/40">
          {s.tools}
        </p>
      </div>
    </motion.div>
  );
};


// --- 3. Main Section ---
export function Process() {
  return (
    <Section id="process" className="pt-16 md:pt-24 pb-24 md:pb-48 relative bg-background overflow-hidden">
      
      <BackgroundWaves />

      <Container className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-16 md:mb-24 text-center max-w-2xl mx-auto"
        >
          <Text className="text-foreground/40 uppercase tracking-[0.2em] text-sm font-semibold mb-4">
            Process
          </Text>
          <Heading as="h2" className="text-4xl md:text-5xl font-medium text-foreground tracking-tight">
            The AI-First workflow.
          </Heading>
          <Text className="mt-6 text-foreground/60 text-lg leading-relaxed">
            Execution to judgment. As models take over the syntax, the work moves
            up a layer — to intent, constraints, and knowing when the output is
            actually right.
          </Text>
        </motion.div>

        {/* Dynamic Card Grid — five steps, so 3+2 rather than a cramped 5-up */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {steps.map((s, i) => (
            <HoverCard key={s.n} s={s} i={i} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
