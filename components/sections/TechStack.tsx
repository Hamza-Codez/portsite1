"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Section } from "@/components/Section";
import { Container } from "@/components/Container";
import { Heading, Text } from "@/components/Typography";

import {
  siMongodb,
  siExpress,
  siReact,
  siNodedotjs,
  siNextdotjs,
  siFastapi,
  siTailwindcss,
  siHtml5,
  siCss,
  siJavascript,
  siFramer,
  siShadcnui,
  siLangchain,
  siTypescript,
  siPostgresql,
  siLanggraph,
} from "simple-icons/icons";

const techStack = [
  { name: "MongoDB", icon: siMongodb, color: "#47A248" },
  { name: "Express", icon: siExpress, color: "#000000" },
  { name: "React", icon: siReact, color: "#61DAFB" },
  { name: "Node.js", icon: siNodedotjs, color: "#339933" },
  { name: "Next.js", icon: siNextdotjs, color: "#000000" },
  { name: "FastAPI", icon: siFastapi, color: "#009688" },
  { name: "PostgreSQL", icon: siPostgresql, color: "#4169E1" },
  { name: "Agentic AI", icon: siLangchain, color: "#1C3C3C" },
  { name: "LangGraph", icon: siLanggraph, color: "#1C3C3C" },
  { name: "Tailwind CSS", icon: siTailwindcss, color: "#06B6D4" },
  { name: "shadcn/ui", icon: siShadcnui, color: "#000000" },
  { name: "Framer Motion", icon: siFramer, color: "#0055FF" },
  { name: "TypeScript", icon: siTypescript, color: "#3178C6" },
  { name: "JavaScript", icon: siJavascript, color: "#F7DF1E" },
  { name: "HTML5", icon: siHtml5, color: "#E34F26" },
  { name: "CSS3", icon: siCss, color: "#1572B6" },
];

// Duplicate the array to create a seamless looping effect
const carouselItems = [...techStack, ...techStack];

const CardInner = ({ tech }: { tech: any }) => (
  <>
    <div className="relative overflow-hidden flex flex-col items-center justify-center w-full h-full rounded-sm bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 backdrop-blur-md transition-all duration-300 transform group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(0,0,0,0.1)] dark:group-hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] group-hover:-translate-y-2">
      
      {/* Gloss effect */}
      <div className="absolute inset-0 -translate-x-full translate-y-full bg-gradient-to-tr from-transparent via-white/60 dark:via-white/20 to-transparent group-hover:translate-x-full group-hover:-translate-y-full transition-transform duration-700 ease-in-out pointer-events-none z-10" />

      <svg
        role="img"
        viewBox="0 0 24 24"
        className="w-10 h-10 md:w-16 md:h-16 fill-current text-black dark:text-foreground/70 dark:group-hover:text-foreground transition-colors duration-300 relative z-20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d={tech.icon.path} />
      </svg>
      
    </div>
    <span className="mt-4 text-[10px] md:text-xs font-medium text-black dark:text-foreground/60 dark:group-hover:text-foreground transition-colors duration-300 text-center">
      {tech.name}
    </span>
  </>
);

export function TechStack() {
  const [mobilePageIndex, setMobilePageIndex] = useState(0);
  const itemsPerPage = 6;
  const totalPages = Math.ceil(techStack.length / itemsPerPage);

  useEffect(() => {
    const interval = setInterval(() => {
      setMobilePageIndex((prev) => (prev + 1) % totalPages);
    }, 4000); // Change page every 4 seconds
    return () => clearInterval(interval);
  }, [totalPages]);

  const currentMobileItems = techStack.slice(
    mobilePageIndex * itemsPerPage,
    (mobilePageIndex + 1) * itemsPerPage
  );

  return (
    <Section id="tech-stack" className="py-16 md:py-24 relative overflow-hidden bg-background border-t border-border/50">
      <Container className="max-w-6xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-12 md:mb-16 text-center"
        >
          <Text className="text-foreground/40 uppercase tracking-[0.2em] text-sm font-semibold mb-4">
            Ecosystem
          </Text>
          <Heading as="h2" className="text-4xl md:text-5xl font-medium text-foreground">
            Technologies & Frameworks
          </Heading>
        </motion.div>

        {/* Mobile Grid (Hidden on MD and up) */}
        <div className="md:hidden px-4 min-h-[300px] flex items-center justify-center">
          <div className="w-full relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={mobilePageIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-3 gap-4"
              >
                {currentMobileItems.map((tech) => (
                  <div
                    key={`${tech.name}-mobile`}
                    className="flex flex-col items-center justify-center w-full aspect-square group perspective-1000 p-1 sm:p-2"
                  >
                    <CardInner tech={tech} />
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Marquee Carousel (Hidden on mobile) */}
        <div className="relative w-full overflow-hidden py-10 -mt-10 mb-6 md:mb-12 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] hidden md:block">
          
          <motion.div
            className="flex w-max items-center"
            animate={{
              x: ["0%", "-50%"],
            }}
            transition={{
              ease: "linear",
              duration: 45, // Slower for smoother experience
              repeat: Infinity,
            }}
          >
            {carouselItems.map((tech, index) => (
              <div
                key={`${tech.name}-${index}`}
                className="flex flex-col items-center justify-center mx-10 w-36 h-36 group perspective-1000"
              >
                <CardInner tech={tech} />
              </div>
            ))}
          </motion.div>

        </div>
      </Container>
    </Section>
  );
}
