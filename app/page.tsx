import { Hero } from "@/components/sections/Hero";
import { TechStack } from "@/components/sections/TechStack";
import { Process } from "@/components/sections/Process";
import { Skills } from "@/components/sections/Skills";
import { Credentials } from "@/components/sections/Credentials";
import { Connect } from "@/components/sections/Connect";

export default function Home() {
  return (
    <>
      <Hero />
      <TechStack />
      <Process />
      <Skills />
      <Credentials />
      <Connect />
    </>
  );
}
