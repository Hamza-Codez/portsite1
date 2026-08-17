"use client";

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import { Section } from "@/components/Section";
import { Container } from "@/components/Container";
import { cn } from "@/lib/utils";
import { education, coursework, journey } from "@/lib/profile";
import { FlaskConical, Code2, Server, Award, LayoutTemplate, GraduationCap, Microscope, BadgeCheck, Cog } from "lucide-react";
import { DecorativeNode } from "@/components/ui/DecorativeNode";

// --- Sub-components for Precision Schematic V2 ---

const SciFiCardPrecise = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative bg-black/15 dark:bg-white/15 p-[1px] h-full shadow-[6px_6px_0px_#18181b] dark:shadow-[6px_6px_0px_#d4d4d8]" 
         style={{ clipPath: 'polygon(24px 0, 100% 0, 100% calc(100% - 24px), calc(100% - 24px) 100%, 0 100%, 0 24px)' }}>
      <div className="relative bg-black dark:bg-white h-full w-full p-2" 
           style={{ clipPath: 'polygon(23px 0, 100% 0, 100% calc(100% - 23px), calc(100% - 23px) 100%, 0 100%, 0 23px)' }}>
        <div className="relative bg-white/20 dark:bg-black/20 p-[1px] h-full w-full" 
             style={{ clipPath: 'polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)' }}>
          <div className="relative bg-black dark:bg-white h-full w-full p-8 sm:p-10 flex flex-col" 
               style={{ clipPath: 'polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)' }}>
            
            {/* Grid bg */}
            <div className="absolute inset-0 z-0 opacity-[0.1] dark:opacity-[0.1] bg-[linear-gradient(white_1px,transparent_1px),linear-gradient(90deg,white_1px,transparent_1px)] dark:bg-[linear-gradient(black_1px,transparent_1px),linear-gradient(90deg,black_1px,transparent_1px)]" 
                 style={{ backgroundSize: '16px 16px' }} />
            
            <div className="relative z-10 h-full flex flex-col">
              {children}
            </div>
          </div>
        </div>
      </div>
      {/* Inner Frame Cutout Nodes */}
      <div className="absolute top-2 left-6 w-1.5 h-1.5 rounded-full border border-white/40 dark:border-black/40 bg-transparent" />
      <div className="absolute top-2 right-6 w-1.5 h-1.5 rounded-full border border-white/40 dark:border-black/40 bg-transparent" />
      <div className="absolute bottom-2 left-6 w-1.5 h-1.5 rounded-full border border-white/40 dark:border-black/40 bg-transparent" />
      <div className="absolute bottom-2 right-6 w-1.5 h-1.5 rounded-full border border-white/40 dark:border-black/40 bg-transparent" />
    </div>
  );
};

const CoursePill = ({text}: {text: string}) => (
  <div className="relative inline-flex items-center justify-center px-4 lg:px-6 py-2 group whitespace-nowrap">
    {/* Parallelogram Background (Inverted) */}
    <div className="absolute inset-0 bg-black dark:bg-white -skew-x-[15deg] rounded-sm shadow-sm" />
    {/* Text (Straight) */}
    <span className="relative z-10 text-[10px] lg:text-xs font-bold uppercase tracking-[0.15em] text-white dark:text-black">{text}</span>
    {/* Pill connector dot */}
    <div className="hidden lg:block absolute -top-[17px] left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full border border-black/30 dark:border-white/30 bg-white dark:bg-black" />
  </div>
);

const CourseworkPrecise = () => {
  return (
    <div className="relative h-full w-full bg-[#fcfcfc] dark:bg-[#0c0d10] border-2 border-black dark:border-white rounded-md p-6 sm:p-10 shadow-[6px_6px_0px_#18181b] dark:shadow-[6px_6px_0px_#d4d4d8]">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] rounded-md overflow-hidden" 
           style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
      
      {/* Hardware corner screws */}
      <div className="absolute top-3 left-3 w-2 h-2 rounded-full border border-black/20 dark:border-white/20 flex items-center justify-center"><div className="w-0.5 h-0.5 bg-black/40 dark:bg-white/40 rounded-full"/></div>
      <div className="absolute top-3 right-3 w-2 h-2 rounded-full border border-black/20 dark:border-white/20 flex items-center justify-center"><div className="w-0.5 h-0.5 bg-black/40 dark:bg-white/40 rounded-full"/></div>
      <div className="absolute bottom-3 left-3 w-2 h-2 rounded-full border border-black/20 dark:border-white/20 flex items-center justify-center"><div className="w-0.5 h-0.5 bg-black/40 dark:bg-white/40 rounded-full"/></div>
      <div className="absolute bottom-3 right-3 w-2 h-2 rounded-full border border-black/20 dark:border-white/20 flex items-center justify-center"><div className="w-0.5 h-0.5 bg-black/40 dark:bg-white/40 rounded-full"/></div>

      <h2 className="relative z-10 text-xl font-bold uppercase tracking-[0.2em] mb-12 text-black dark:text-white inline-block bg-white/80 dark:bg-black/80 px-2">
        Relevant Coursework
      </h2>

      {/* SVG Routing strictly mapped for Desktop. On mobile, we use a simple flex wrapper to avoid layout breaks */}
      <div className="hidden lg:block relative z-10 w-full h-[280px]">
        {/* SVG routing strictly mapped to absolute pixel values */}
        <svg className="absolute inset-0 w-full h-full text-black/20 dark:text-white/20 pointer-events-none" stroke="currentColor" fill="none" strokeWidth="1.5">
          {/* Main trunk down from title */}
          <path d="M 85,-30 L 85,30" />
          
          {/* Row 1 branch */}
          <path d="M 85,30 L 545,30" />
          <path d="M 85,30 L 85,50" />
          <path d="M 260,30 L 260,50" />
          <path d="M 390,30 L 390,50" />
          <path d="M 545,30 L 545,50" />

          {/* Row 2 branch */}
          <path d="M 85,90 L 85,120" />
          <path d="M 85,120 L 330,120" />
          <path d="M 85,120 L 85,140" />
          <path d="M 330,120 L 330,140" />

          {/* Row 3 branch */}
          <path d="M 85,180 L 85,210" />
          <path d="M 85,210 L 520,210" />
          <path d="M 85,210 L 85,230" />
          <path d="M 275,210 L 275,230" />
          <path d="M 520,210 L 520,230" />
        </svg>

        {/* The Pills - Positioned precisely at the ends of the SVG paths */}
        <div className="absolute left-[-5px] top-[50px]"><CoursePill text="Data Structures" /></div>
        <div className="absolute left-[190px] top-[50px]"><CoursePill text="Algorithms" /></div>
        <div className="absolute left-[345px] top-[50px]"><CoursePill text="OOP" /></div>
        <div className="absolute left-[450px] top-[50px]"><CoursePill text="Database Systems" /></div>

        <div className="absolute left-[-27px] top-[140px]"><CoursePill text="Software Engineering" /></div>
        <div className="absolute left-[230px] top-[140px]"><CoursePill text="Computer Networks" /></div>

        <div className="absolute left-[45px] top-[230px]"><CoursePill text="HCI" /></div>
        <div className="absolute left-[150px] top-[230px]"><CoursePill text="Artificial Intelligence" /></div>
        <div className="absolute left-[430px] top-[230px]"><CoursePill text="Cloud Computing" /></div>
      </div>

      {/* Mobile fallback layout */}
      <div className="lg:hidden relative z-10 flex flex-wrap gap-4 mt-8">
        {coursework.map(c => <CoursePill key={c} text={c} />)}
      </div>
    </div>
  );
};

function getJourneyGraphic(title: string) {
  if (title.includes("Foundations")) return <LayoutTemplate className="w-full h-full text-black/15 dark:text-white/10" strokeWidth={1} />;
  if (title.includes("Pre-Medical")) return (
    <div className="flex items-end gap-2 text-black/15 dark:text-white/10">
      <FlaskConical className="w-12 h-12" strokeWidth={1} />
      <Microscope className="w-16 h-16" strokeWidth={1} />
    </div>
  );
  if (title.includes("Computer science")) return (
    <div className="grid grid-cols-2 gap-2 text-black/20 dark:text-white/20">
      <Code2 className="w-8 h-8" strokeWidth={1.5} />
      <Server className="w-8 h-8" strokeWidth={1.5} />
    </div>
  );
  if (title.includes("Full-stack")) return (
    <div className="flex gap-2 text-black/20 dark:text-white/20">
      <BadgeCheck className="w-12 h-12" strokeWidth={1} />
    </div>
  );
  if (title.includes("Graduating")) return <GraduationCap className="w-full h-full text-black/15 dark:text-white/10" strokeWidth={1} />;
  return null;
}

const JourneyCardPrecise = ({ step }: { step: (typeof journey)[number] }) => {
  return (
    <div className="relative w-full max-w-[540px] bg-[#fcfcfc] dark:bg-[#0c0d10] border-2 border-black dark:border-white rounded-md p-8 lg:p-10 shadow-[6px_6px_0px_#18181b] dark:shadow-[6px_6px_0px_#d4d4d8] z-20 group hover:-translate-y-1 transition-transform duration-300">
      
      {/* Title & metadata */}
      <p className="text-[10px] font-bold uppercase tracking-widest text-black/50 dark:font-mono dark:text-white/40 mb-3">
        {step.period}
      </p>
      <h3 className="text-2xl font-black leading-tight text-black dark:text-white mb-2">
        {step.title}
      </h3>
      <p className="text-xs font-semibold uppercase tracking-[0.15em] text-black/40 dark:text-white/30 mb-6 pb-6 border-b border-black/10 dark:border-white/10">
        {step.place}
      </p>
      <p className="text-sm font-medium leading-relaxed text-black/70 dark:text-white/60 md:w-[75%]">
        {step.description}
      </p>

      {/* Floating Graphics inside card */}
      <div className="absolute bottom-6 right-6 lg:bottom-10 lg:right-10 pointer-events-none flex items-center justify-center">
        {getJourneyGraphic(step.title)}
      </div>
      
      {/* Ghost Background Math (Only on Foundations for effect) */}
      {step.title.includes("Foundations") && (
        <div className="absolute top-6 right-6 pointer-events-none opacity-[0.05] font-mono text-[10px] text-right whitespace-pre select-none text-black dark:text-white">
          {`f(x) = A\\sin(\\omega t)\n\\nabla \\times E = -\\frac{\\partial B}{\\partial t}`}
        </div>
      )}
    </div>
  );
};

const TimelineRow = ({ step, isRight }: { step: (typeof journey)[number], isRight: boolean }) => {
  return (
    <div className="relative flex flex-col md:grid md:grid-cols-[1fr_80px_1fr] gap-6 md:gap-0 min-h-[280px]">
      
      {/* Central Spine SVG Segment */}
      <div className="hidden md:flex col-start-2 md:row-start-1 relative justify-center">
        {/* Central Junction Node */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-[#fdfdfd] dark:bg-[#0c0d10] border-[2px] border-black/30 dark:border-white/30 rounded-full z-20 flex items-center justify-center shadow-sm">
          <Cog className="w-5 h-5 text-black dark:text-white animate-spin" style={{ animationDuration: '4s' }} />
        </div>
        
        {/* Branch off node label (Focus/Select detail) */}
        {step.title.includes("Pre-Medical") && (
          <div className="absolute top-1/2 -translate-y-1/2 left-full ml-4 whitespace-nowrap text-[10px] font-bold uppercase tracking-widest text-black/40 dark:text-white/40 flex items-center gap-1">
            <BadgeCheck className="w-3 h-3" /> Focus/Select
          </div>
        )}

        {/* Orthogonal Branch to the card */}
        <div className={cn(
          "absolute top-1/2 -translate-y-1/2 h-[2px] bg-black/20 dark:bg-white/20",
          isRight ? "left-[50%] w-[50%]" : "right-[50%] w-[50%]"
        )} />
      </div>

      {/* The Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        className={cn("relative flex items-center w-full z-20 md:row-start-1", isRight ? "md:col-start-3" : "md:col-start-1 md:justify-end")}
      >
        <JourneyCardPrecise step={step} />
      </motion.div>

      {/* 3D Decorative Object in empty space next to Foundations */}
      {!isRight && step.title.includes("Foundations") && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, delay: 0.2 }}
          className="hidden md:flex items-center justify-center relative w-full h-full z-10 md:col-start-3 md:row-start-1"
        >
          <DecorativeNode type="icosahedron" />
        </motion.div>
      )}

      {/* 3D Decorative Object in empty space next to Pre-Medical */}
      {isRight && step.title.includes("Pre-Medical") && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, delay: 0.2 }}
          className="hidden md:flex items-center justify-center relative w-full h-full z-10 md:col-start-1 md:row-start-1"
        >
          <DecorativeNode type="brainTech" />
        </motion.div>
      )}

      {/* 3D Decorative Object in empty space next to Computer Science */}
      {!isRight && step.title.includes("Computer science") && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, delay: 0.2 }}
          className="hidden md:flex items-center justify-center relative w-full h-full z-10 md:col-start-3 md:row-start-1"
        >
          <DecorativeNode type="dataBlock" />
        </motion.div>
      )}

      {/* 3D Decorative Object in empty space next to Agentic Work */}
      {!isRight && step.title.includes("Graduating") && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, delay: 0.2 }}
          className="hidden md:flex items-center justify-center relative w-full h-full z-10 md:col-start-3 md:row-start-1"
        >
          <DecorativeNode type="graduation" />
        </motion.div>
      )}
      
      {/* 3D Decorative Object in empty space next to Full-stack AI */}
      {isRight && step.title.includes("Full-stack") && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, delay: 0.2 }}
          className="hidden md:flex items-center justify-center relative w-full h-full z-10 md:col-start-1 md:row-start-1"
        >
          <DecorativeNode type="gadget" />
        </motion.div>
      )}
    </div>
  );
};

export function Education() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start 85%", "end 60%"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 30,
    mass: 0.4,
  });

  const heightProgress = useTransform(progress, [0, 1], ["0%", "100%"]);

  return (
    <Section id="education" className="py-16 md:py-32 bg-[#f3f4f6] dark:bg-[#050505] relative overflow-hidden">
      
      <Container className="max-w-7xl relative z-10">
        
        {/* Header Block */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 flex flex-col items-center justify-center text-center"
        >
          <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.3em] text-black/50 dark:font-mono dark:text-white/40">
            Foundation
          </p>
          <h2 className="text-4xl font-semibold tracking-tight text-black dark:text-white md:text-5xl">
            Education &amp; the road here
          </h2>
        </motion.div>

        {/* Top Schematic Region */}
        <div className="flex flex-col lg:flex-row gap-6 mb-16 h-auto lg:h-[420px]">
          {/* Headline credential */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="lg:w-[400px] shrink-0"
          >
            <SciFiCardPrecise>
              <h2 className="mb-6 text-4xl font-black uppercase tracking-tight text-white dark:text-black md:text-5xl">
                B.S. <br /> Computer <br /> Science
              </h2>
              <p className="text-sm font-medium leading-relaxed text-white/70 dark:font-normal dark:text-black/70 w-[85%]">
                {education[0].description} Currently <strong className="text-white dark:text-black font-bold">{education[0].grade}</strong>.
              </p>

              <div className="mt-auto border-t border-white/20 dark:border-black/20 pt-6">
                <p className="mb-2 text-lg font-bold text-white dark:font-medium dark:text-black">
                  {education[0].institution}
                </p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/50 dark:font-mono dark:text-black/50">
                  {education[0].period}
                </p>
              </div>
            </SciFiCardPrecise>
          </motion.div>

          {/* Coursework Tree */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex-1"
          >
            <CourseworkPrecise />
          </motion.div>
        </div>

        {/* Main Flowchart Spine connecting Top section to Journey section */}
        <div className="hidden md:flex justify-center h-24 w-full relative z-0">
          {/* Fading in from top to avoid harsh cuts */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] h-full bg-gradient-to-b from-transparent to-black/20 dark:to-white/20" />
          <div className="absolute top-0 left-[calc(50%-6px)] h-full w-[1px] bg-gradient-to-b from-transparent to-black/10 dark:to-white/10" />
          <div className="absolute top-0 left-[calc(50%+6px)] h-full w-[1px] bg-gradient-to-b from-transparent to-black/10 dark:to-white/10" />
        </div>

        {/* Timeline Journey Grid */}
        <div ref={timelineRef} className="relative">
          {/* STATIC full-height background lines spanning the ENTIRE timeline with zero gaps */}
          <div className="hidden md:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-3 z-0 pointer-events-none">
            <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[2px] bg-black/20 dark:bg-white/20" />
            <div className="absolute top-0 bottom-0 left-0 w-[1px] bg-black/10 dark:bg-white/10" />
            <div className="absolute top-0 bottom-0 right-0 w-[1px] bg-black/10 dark:bg-white/10" />
          </div>

          {/* Animated continuous scroll line spanning the entire timeline */}
          <div className="hidden md:block absolute top-0 bottom-0 left-[calc(50%-1px)] w-[2px] z-10 pointer-events-none">
            <motion.div
              style={{ height: heightProgress }}
              className="absolute top-0 left-0 right-0 bg-black dark:bg-white shadow-[0_0_12px_rgba(0,0,0,0.8)] dark:shadow-[0_0_12px_rgba(255,255,255,0.8)]"
            >
              {/* Fade out tip so the emerging beam doesn't look cut off */}
              <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-[#f3f4f6] dark:to-[#050505]" />
            </motion.div>
          </div>

          {journey.map((step, i) => {
            const isRight = i % 2 === 1;
            return (
              <TimelineRow key={step.period} step={step} isRight={isRight} />
            );
          })}
        </div>

      </Container>
    </Section>
  );
}
