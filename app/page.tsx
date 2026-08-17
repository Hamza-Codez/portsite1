import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Process } from "@/components/sections/Process";
import { TechStack } from "@/components/sections/TechStack";
import { Skills } from "@/components/sections/Skills";
import { Projects } from "@/components/sections/Projects";
import { Credentials } from "@/components/sections/Credentials";
import { Education } from "@/components/sections/Education";
import { Connect } from "@/components/sections/Connect";


export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      <main className="flex-grow">
        <Hero />
        <About />

        <Process />
        <TechStack />

        <Skills />
        <Projects />
        <Credentials />

        <Education />

        <Connect />
      </main>

      <footer className="mt-auto border-t border-border py-8 text-center">
        <p className="text-sm text-muted">
          Designed &amp; Built with{" "}
          <span className="text-foreground">intention</span>. &copy;{" "}
          {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}
