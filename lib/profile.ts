/* ---------------------------------------------------------------------------
   Single source of truth for personal content.

   Everything here is transcribed from info.md. Sections import from this file
   rather than hard-coding copies — info.md §16.7 flags duplicated project data
   as an existing problem worth not repeating.

   Deliberately NOT included:
   - The productivity multipliers from info.md §4 / §11 (4.2x velocity,
     140h -> 33h, 76% SWE-bench). info.md itself labels these "claimed".
   - The Satya Nadella "Davos, 2026" quote from §11 — unverifiable attribution.
   - Any testimonial or client-logo content. There is no source data for it.
--------------------------------------------------------------------------- */

export const profile = {
  fullName: "Muhammad Hamza Ahmad",
  name: "Hamza Ahmad",
  handle: "Hamza-Codez",
  title: "Software Engineer & Architect",
  email: "ha01257890@gmail.com",
  phone: "+92 305 877 7185",
  phoneHref: "+923058777185",
  location: "Faisalabad, Pakistan",
  availability: "Open for opportunities",
  responseTime: "Typically responds within 24 hours",
  lookingFor:
    "Freelance projects, collaborations, or full-time positions in AI & web development",
  /* Client-facing pitch for the identity card in the Connect section. */
  quote:
    "Good software isn't the code you ship — it's the decisions you can still live with a year later.",
  quoteSupport:
    "Bring me the messy brief, the one that isn't fully specced yet. Working out what to build is half the job, and it's the half I like most.",
} as const;

export type Social = {
  name: string;
  href: string;
  /** key into the icon map in components/SocialIcons.tsx */
  icon: "github" | "linkedin" | "instagram" | "facebook" | "mail";
};

export const socials: Social[] = [
  { name: "GitHub", href: "https://github.com/Hamza-Codez", icon: "github" },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/m-hamza-ahmad-0030452b4/",
    icon: "linkedin",
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/hamza._ahmad._/",
    icon: "instagram",
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/profile.php?id=100050686890379",
    icon: "facebook",
  },
  { name: "Email", href: `mailto:${profile.email}`, icon: "mail" },
];

/* --- info.md §9 — the AI-First workflow ---------------------------------- */
export const processSteps = [
  {
    n: "01",
    t: "Understand",
    sub: "Research & Problem Space",
    d: "Deep dive into stakeholder needs and problem constraints using AI-assisted discovery.",
    tools: "Claude · MindMaps",
  },
  {
    n: "02",
    t: "Strategize",
    sub: "AI Planning & Model Selection",
    d: "Mapping the architectural path and selecting the optimal models for each agentic node.",
    tools: "GPT-4o · Specification",
  },
  {
    n: "03",
    t: "Prototype",
    sub: "AI-Assisted Rapid Builds",
    d: "Accelerating from zero to MVP through high-velocity AI-driven implementation.",
    tools: "Cursor · Copilot",
  },
  {
    n: "04",
    t: "Iterate",
    sub: "AI Review & Eval Loops",
    d: "Refining logic through continuous human-AI feedback loops and automated evals.",
    tools: "LLM Evals · QA Agents",
  },
  {
    n: "05",
    t: "Ship",
    sub: "Monitor & Observability",
    d: "Deploying high-fidelity systems with AI-orchestrated pipelines and monitoring.",
    tools: "Vercel · Sentry",
  },
] as const;

/* --- info.md §7 — skills -------------------------------------------------- */
export const skillGroups = [
  {
    category: "Frontend Engineering",
    description:
      "Component-driven interfaces with type safety end to end, built for performance, accessibility, and considered motion.",
    tools: "React, Next.js, TypeScript, Tailwind CSS, Framer Motion, Shadcn/ui",
  },
  {
    category: "Full-Stack & Data",
    description:
      "Wiring front ends to real backends — auth, persistence, and REST APIs that hold up once traffic is real.",
    tools: "Firebase, Supabase, FastAPI, MongoDB, MySQL, PHP, REST APIs",
  },
  {
    category: "AI-Native Development",
    description:
      "Treating models as primary actors: retrieval, tool use, and the eval loops that keep agentic behaviour honest.",
    tools: "Prompt Engineering, RAG, Vector DBs, MCP Servers, Agentic Flows, LLM Evals",
  },
  {
    category: "Academic Foundation",
    description:
      "The fundamentals underneath the tooling — data structures, algorithms, and object-oriented design from coursework.",
    tools: "C++, Python, C#/.NET, Data Structures, Algorithms, OOP, Databases",
  },
] as const;

/* --- info.md §8 — projects ------------------------------------------------ */
export type Project = {
  title: string;
  category: "Frontend" | "Full-Stack" | "Academic";
  description: string;
  tech: string;
  live?: string;
  source: string;
  /** Real screenshot of the deployed site, captured at 1280x800 and cropped to
      16:10. Academic entries have no deployment, so they have no preview. */
  preview?: string;
};

export const projects: Project[] = [
  {
    title: "StockEase Dashboard",
    category: "Full-Stack",
    description:
      "Real-time inventory management with a Firebase backend and data visualisation for stock movement.",
    tech: "React, Firebase, Tailwind",
    live: "https://stockease-app.vercel.app/",
    source: "https://github.com/Hamza-Codez/Stockease-App",
    preview: "/assets/project/previews/stockease.webp",
  },
  {
    title: "Climate Tracker",
    category: "Full-Stack",
    description:
      "Hackathon project tracking global climate metrics, with a FastAPI service behind a React front end.",
    tech: "React, FastAPI, MongoDB",
    live: "https://automation-climate-5h7y.vercel.app/",
    source: "https://github.com/Hamza-Codez/automationClimate",
    preview: "/assets/project/previews/climate-tracker.webp",
  },
  {
    title: "Global Mart",
    category: "Frontend",
    description:
      "E-commerce platform with complex API integrations and an optimised product listing experience.",
    tech: "Next.js, API, Tailwind",
    live: "https://globalmarttsix-nexusdigital.vercel.app/",
    source: "https://github.com/Hamza-Codez/Nexus-Digital/tree/main/T6/Gmart",
    preview: "/assets/project/previews/global-mart.webp",
  },
  {
    title: "Personal Portfolio",
    category: "Frontend",
    description:
      "Portfolio site built with React and TypeScript, focused on performance and considered UX.",
    tech: "React, TypeScript, Tailwind, Vite",
    live: "https://resume-portfolio-two-alpha.vercel.app",
    source: "https://github.com/Hamza-Codez/REsumePort",
    preview: "/assets/project/previews/portfolio.webp",
  },
  {
    title: "Essentify+",
    category: "Frontend",
    description:
      "Feature-rich todo application with local-storage persistence and no backend dependency.",
    tech: "JavaScript, CSS3, Local Storage",
    live: "https://essentiafy-to-do-hpr4.vercel.app/",
    source: "https://github.com/Hamza-Codez/Essentiafy-To-Do",
    preview: "/assets/project/previews/essentify.webp",
  },
  {
    title: "University Farming — FARM-UAF",
    category: "Academic",
    description:
      "A farming-products seller system built as coursework, spanning a Ruby back end and SQL storage.",
    tech: "HTML, CSS, JavaScript, Ruby, SQL",
    // info.md §8 lists this as having no live deployment — it does.
    live: "https://farm-uaf1-1-frontend.vercel.app/feature.html",
    source: "https://github.com/Hamza-Codez/FARM-UAF",
    preview: "/assets/project/previews/farm-uaf.webp",
  },
  {
    title: "FrenzyFlix",
    category: "Academic",
    description:
      "A movie-browsing front end with an auto-rotating hero carousel, built in plain HTML, CSS, and JavaScript.",
    tech: "HTML, CSS, JavaScript",
    // info.md §8 lists this as having no live deployment — it does.
    live: "https://frenzy-umbrella.vercel.app/index.html",
    source: "https://github.com/Hamza-Codez/Frenzy-Flix",
    preview: "/assets/project/previews/frenzyflix.webp",
  },
];

/* --- info.md §6 — certifications ------------------------------------------ */
export type Credential = {
  title: string;
  issuer: string;
  date: string;
  skills: string;
  description: string;
};

export const credentials: Credential[] = [
  {
    title: "Gen AI Application Development",
    issuer: "UETians & iCode Guru",
    date: "Nov 2025",
    skills: "GenAI · Prompting · Workflow",
    description:
      "Building AI-powered applications with advanced prompt engineering.",
  },
  {
    title: "Google Prompting Essentials",
    issuer: "Google",
    date: "Oct 2025",
    skills: "AI Agents · Analysis",
    description:
      "Mastering AI role-playing agents and sophisticated data analysis frameworks.",
  },
  {
    title: "Google UX Design Specialization",
    issuer: "Google",
    date: "Oct 2025",
    skills: "Research · Wireframing",
    description:
      "End-to-end design process from user empathy to testable prototypes.",
  },
  {
    title: "Google Project Management",
    issuer: "Google",
    date: "Oct 2025",
    skills: "Agile · Scrum · Lean",
    description: "Foundations of Agile roles, scrum events, and project artifacts.",
  },
  {
    title: "Google Business Intelligence",
    issuer: "Google",
    date: "Oct 2025",
    skills: "ETL · Tableau · SQL",
    description:
      "Data warehousing and business-driven decision making strategies.",
  },
  {
    title: "Google IT Support",
    issuer: "Google",
    date: "Oct 2025",
    skills: "Linux · DNS · CLI",
    description:
      "Networking, system administration, and technical troubleshooting.",
  },
  {
    title: "Full Stack Web Development",
    issuer: "Govt. of Punjab",
    date: "June 2024",
    skills: "JS · PHP · MySQL",
    description:
      "Comprehensive training in modern front-end and back-end architectures.",
  },
  {
    title: "Meta Hacker Cup 2025",
    issuer: "Meta",
    date: "Nov 2025",
    skills: "Algorithms · CP",
    description:
      "Participation in the global competitive programming challenge.",
  },
  {
    title: "Tech Entrepreneurship",
    issuer: "UAF Computing",
    date: "Nov 2025",
    skills: "Innovation · Pitching",
    description:
      "Hackathon participation at the University of Agriculture, Faisalabad.",
  },
];

/** Distinct issuers, for the quiet trust strip. */
export const issuers = [
  "Google",
  "Meta",
  "Govt. of Punjab",
  "UETians & iCode Guru",
  "UAF Computing",
];

/* --- info.md §5 — education ----------------------------------------------- */
export const education = [
  {
    qualification: "BS Computer Science",
    institution: "University of Agriculture, Faisalabad",
    period: "2022 – 2026 (Expected)",
    location: "Faisalabad, PK",
    grade: "3.1 CGPA",
    description:
      "Core CS principles, algorithms, and AI research with a focus on HCI.",
    subjects: ["Data Structures", "AI", "HCI"],
  },
  {
    qualification: "Intermediate — Pre-Medical",
    institution: "Prem Sati Trust Kamalia",
    period: "2019 – 2021",
    location: "Kamalia, PK",
    grade: "A",
    description: "Intensive studies in empirical sciences and analytical biology.",
    subjects: ["Biology", "Chemistry", "Physics"],
  },
  {
    qualification: "Matriculation — Science",
    institution: "Govt. High School Kamalia",
    period: "2017 – 2019",
    location: "Kamalia, PK",
    grade: "1025 / 1100",
    description: "Foundational mathematics and honours-level science basics.",
    subjects: ["Mathematics", "Science"],
  },
] as const;

export const coursework = [
  "Data Structures",
  "Algorithms",
  "OOP",
  "Database Systems",
  "Software Engineering",
  "Computer Networks",
];

/* --- Journey: the real chronology, replacing invented employment ---------- */
export const journey = [
  {
    period: "2017 – 2019",
    title: "Foundations",
    place: "Govt. High School Kamalia",
    description:
      "Matriculation in Science, 1025/1100. Where the mathematics underneath everything else got built.",
  },
  {
    period: "2019 – 2021",
    title: "Pre-Medical, then a change of direction",
    place: "Prem Sati Trust Kamalia",
    description:
      "Intermediate in Pre-Medical, grade A. Empirical sciences taught the habit of testing a claim before trusting it — then I chose computing.",
  },
  {
    period: "2022 – 2024",
    title: "Computer science, and the first real builds",
    place: "University of Agriculture, Faisalabad",
    description:
      "Started BS Computer Science. Coursework in data structures, algorithms, and OOP alongside the first shipped projects — FARM-UAF, FrenzyFlix, Essentify+ — plus Full Stack Web Development with the Govt. of Punjab.",
  },
  {
    period: "2024 – 2025",
    title: "Full-stack, then AI-first",
    place: "Independent & hackathons",
    description:
      "StockEase and Climate Tracker moved the work from static pages to real backends. Nine certifications followed, six of them Google, alongside Meta Hacker Cup and two university hackathons.",
  },
  {
    period: "2026",
    title: "Graduating into agentic work",
    place: "Faisalabad, Pakistan",
    description:
      "Final year of the BS, building agentic workflows — retrieval, tool use, and the eval loops that keep them honest.",
  },
] as const;
