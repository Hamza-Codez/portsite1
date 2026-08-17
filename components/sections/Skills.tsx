"use client";

import { motion } from "framer-motion";
import { Section } from "@/components/Section";
import { Container } from "@/components/Container";
import { Heading, Text } from "@/components/Typography";

import { skillGroups as skills } from "@/lib/profile";

const Screw = ({ className }: { className?: string }) => (
  <div className={`absolute w-2.5 h-2.5 rounded-full bg-gradient-to-br from-zinc-100 to-zinc-300 dark:from-zinc-500 dark:to-zinc-700 shadow-[inset_0_1px_2px_rgba(0,0,0,0.15)] dark:shadow-[inset_0_1px_2px_rgba(255,255,255,0.15),0_1px_2px_rgba(0,0,0,0.5)] border border-black/10 dark:border-black/50 flex items-center justify-center ${className || ''}`}>
    <div className="w-[70%] h-[1px] bg-black/30 dark:bg-black/60" />
  </div>
);

export function Skills() {
  return (
    <Section id="skills" className="py-16 md:py-24 relative overflow-hidden bg-background">
      {/* Background Images */}
      <div 
        className="absolute inset-0 z-0 hidden dark:block bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url("/assets/skillsection/imblack.png")' }}
      />
      <div 
        className="absolute inset-0 z-0 block dark:hidden bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url("/assets/skillsection/imwhite.png")' }}
      />

      <Container className="max-w-6xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-20 text-center"
        >
          <Text className="text-foreground/40 uppercase tracking-[0.2em] text-sm font-semibold mb-4">
            Capabilities
          </Text>
          <Heading as="h2" className="text-4xl md:text-5xl font-medium text-foreground">Technical arsenal</Heading>
          <Text className="mx-auto mt-6 max-w-2xl text-foreground/60 leading-relaxed">
            From university fundamentals to agentic tooling — what I actually
            reach for when building.
          </Text>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {skills.map((skill, index) => (
            <motion.div
              key={skill.category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="rounded-md bg-white dark:bg-[#0B0C0E] dark:backdrop-blur-none border border-black/20 dark:border-white/20 p-6 sm:p-8 md:p-12 relative overflow-hidden group h-full flex flex-col shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              {/* Metallic Screws */}
              <Screw className="top-4 left-4 rotate-12" />
              <Screw className="top-4 right-4 rotate-45" />
              <Screw className="bottom-4 left-4 -rotate-12" />
              <Screw className="bottom-4 right-4 rotate-90" />

              {/* Radiating Orb (Top Right) - Dark Mode Only */}
              <div className="hidden dark:block absolute -top-32 -right-32 w-64 h-64 dark:bg-white/30 blur-[64px] pointer-events-none z-0" />
              
              <div className="absolute inset-0 bg-black/[0.02] dark:bg-white/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-0" />
              <div className="relative z-10 flex flex-col h-full">
                <h3 className="text-2xl font-bold dark:font-medium text-black dark:text-white mb-4">
                  {skill.category}
                </h3>
                <Text className="mb-8 flex-grow font-medium dark:font-normal text-black/90 dark:text-white/60 leading-relaxed">
                  {skill.description}
                </Text>
                <div className="pt-6 border-t border-black/20 dark:border-white/10 mt-auto">
                  <p className="text-xs font-bold dark:font-mono tracking-widest text-black/80 dark:text-white/40 uppercase">
                    {skill.tools}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
