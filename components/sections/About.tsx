"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/Container";
import { Layers, Sparkles, Code2 } from "lucide-react";

const EASE = [0.16, 1, 0.3, 1] as const;

const PRINCIPLES = [
  {
    id: "architecture",
    label: "Architecture",
    line: "Design for year two, not the demo.",
    description: "Software is a craft. The goal isn't just code that works—it's a robust system that still makes sense once someone else has to change it or scale it globally.",
    tokens: ["maintainable", "scalable", "observable"],
    icon: Layers,
  },
  {
    id: "ai",
    label: "AI-Native",
    line: "Models are primary actors.",
    description: "Treating AI as a core architectural component. From retrieving context to reasoning through edge cases, LLMs are deeply integrated into the system design.",
    tokens: ["retrieve", "reason", "evaluate"],
    icon: Sparkles,
  },
  {
    id: "craft",
    label: "Craftsmanship",
    line: "Surprise is a defect.",
    description: "Embracing predictability over cleverness. Every system is strongly typed, thoroughly tested, and obsessively documented to ensure long-term stability.",
    tokens: ["typed", "tested", "documented"],
    icon: Code2,
  },
] as const;

export function About() {
  return (
    <section
      id="about"
      className="scroll-mt-20 overflow-hidden bg-background py-16 text-foreground md:scroll-mt-24 md:py-24"
    >
      <Container>
        <div className="flex flex-col items-center mx-auto max-w-2xl text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: EASE }}
            className="mb-6 font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-black/50 dark:text-white/50"
          >
            The Mindset
          </motion.p>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
            className="text-4xl md:text-5xl font-medium tracking-tight mb-6"
          >
            Engineering for the long term.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
            className="text-lg text-black/60 dark:text-white/60 leading-relaxed"
          >
            A deliberate approach to building software where predictability, scalability, and craftsmanship take precedence over clever hacks.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PRINCIPLES.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.1 * i, ease: EASE }}
              className="group relative flex flex-col justify-between overflow-hidden rounded-md border border-black/20 dark:border-white/20 bg-white dark:bg-[#0B0C10] p-8 hover:border-black/50 dark:hover:border-white/50 transition-colors"
            >
              {/* Solid Opposite Color Squarish Vector with Icon */}
              <div 
                className="absolute -top-6 -right-6 w-24 h-24 bg-black dark:bg-white rounded-sm rotate-12 transition-all duration-700 ease-out group-hover:scale-125 group-hover:rotate-6 z-0 flex items-end justify-start p-5"
              >
                <p.icon className="w-6 h-6 text-white dark:text-black -rotate-12 group-hover:-rotate-6 transition-transform duration-700" />
              </div>

              <div className="relative z-10">
                <h3 className="text-2xl font-medium mb-3 mix-blend-difference text-white dark:text-black">{p.label}</h3>
                <p className="font-mono text-[12px] text-black/50 dark:text-white/50 mb-6 uppercase tracking-wider">
                  {p.line}
                </p>
                <p className="text-sm text-black/80 dark:text-white/80 leading-relaxed mb-8 pr-4">
                  {p.description}
                </p>
              </div>

              <div className="relative z-10 flex flex-wrap gap-2">
                {p.tokens.map((token) => (
                  <span
                    key={token}
                    className="inline-flex items-center rounded-sm bg-black dark:bg-white px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-white dark:text-black font-semibold"
                  >
                    {token}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
