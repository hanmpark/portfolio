export const navLinks = [
  { label: "Work", href: "#work" },
  { label: "Experience & Education", href: "#experience" },
  { label: "About", href: "#about" },
];

export const hero = {
  availability: "Available for Spring 2026 collaborations",
  title: "Designing calm, confident product experiences.",
  lede: "I help teams launch thoughtful digital products by blending crisp strategy, human-centered design, and frontend direction. Based in Seoul, partnering globally.",
  primaryCta: { label: "View work", href: "#work" },
  secondaryCta: { label: "Start a project", href: "#contact" },
};

export const stats = [
  { value: "6+", label: "Years shipping digital products" },
  { value: "18", label: "Teams supported across industries" },
  { value: "4", label: "Time zones collaborating smoothly" },
];

export const heroCard = {
  eyebrow: "Now building",
  title: "Atlas Climate OS",
  description:
    "A platform for municipal teams to plan resilient infrastructure with live emissions and risk data.",
  tags: ["UX Strategy", "Data UX", "Web Apps"],
  timelineLabel: "Project timeline",
  timelineValue: "Jan 2025 - Present",
};

export const sectionCopy = {
  stack: {
    eyebrow: "Tech stack",
    title: "Technologies I use to build and ship products.",
    subtitle:
      "A practical toolkit for fast iteration, clean architecture, and smooth user experiences.",
  },
  work: {
    eyebrow: "Selected work",
    title: "Projects that balance craft and outcomes.",
    subtitle:
      "End-to-end product engagements for teams in climate, commerce, and creative tech.",
  },
  experience: {
    eyebrow: "Experience & Education",
    title: "A timeline of work and studies.",
    subtitle:
      "A scrollable timeline of professional experience and academic background, blending engineering practice with visual culture and storytelling.",
  },
  services: {
    eyebrow: "Services",
    title: "Senior product support, shaped for speed.",
    subtitle:
      "Flexible engagements designed to plug into your team and unlock momentum.",
  },
  about: {
    eyebrow: "About",
    title: "Design partner for teams who value clarity.",
    subtitle:
      "I collaborate with founders and product leaders to align vision, simplify complexity, and deliver delightful systems. My work focuses on products where trust, storytelling, and performance are equally important.",
  },
  contact: {
    eyebrow: "Contact",
    title: "Let's talk",
    subtitle:
      "Whether you are looking to build a new website, improve your existing platform, or bring a unique project to life, I'm here to help.",
  },
};

export const projects = [
  {
    title: "Mini Ray Tracer",
    subtitle: "Ray Tracing Engine in C",
    description:
      "A minimal ray tracing engine implementing lighting, shadows, reflections, and 3D scene rendering from scratch. Built to explore computer graphics and mathematical rendering principles.",
    previewImage: "/works/rt1.png",
    tags: ["C", "Ray Tracing", "Computer Graphics"],
    links: {
      repo: "https://github.com/hanmpark/miniraytracer",
    },
  },
  {
    title: "Tetris",
    subtitle: "Real-Time Multiplayer Game",
    description:
      "A competitive multiplayer Tetris game featuring real-time synchronization, state management, and networked gameplay architecture.",
    previewImage: "/works/tetris-game.png",
    tags: ["TypeScript", "Multiplayer", "WebSockets"],
    links: {
      repo: "https://github.com/okbrandon/red-tetris",
      demo: "https://tetris.brandoncodes.dev/",
    },
  },
  {
    title: "so_long",
    subtitle: "2D Game Engine in C",
    description:
      "A lightweight 2D game built in C using a custom rendering loop, sprite management, and event handling. Focused on memory control, game logic, and low-level graphics programming.",
    previewImage: "/works/so_long.png",
    tags: ["C", "2D Graphics", "Game Development"],
    links: {
      repo: "https://github.com/hanmpark/so_long",
    },
  },
  {
    title: "Scholarship Time Tracker",
    subtitle: "Hour Tracking Tool for 42 Nice Students",
    description:
      "A tool that tracks and calculates cumulative hours for 42 Nice students, helping them log required monthly hours for scholarship eligibility. It automates hour tracking, reduces admin overhead, and gives a clear view of progress and time management.",
    previewImage: "/works/42 Logtime.png",
    tags: ["Time Tracking", "Productivity Tool", "42 Nice"],
    links: {
      repo: "https://github.com/hanmpark/scholarship_logtime",
    },
  },
];

export const experiences = [
  {
    category: "Experience",
    role: "Freelance Software Engineer",
    company: "The Good Cleaners",
    period: "Feb 2026 - Present",
    image: "/assets/experiences/thegoodcleaners.png",
    imageAlt: "The Good Cleaners logo",
    logoVariant: "square",
    focus: "Freelance product and web development support.",
    summary:
      "Providing freelance engineering support for The Good Cleaners, helping build and refine reliable web experiences.",
    stack: ["Freelance", "Web Development", "Product Support"],
  },
  {
    category: "Experience",
    role: "Software Engineer",
    company: "Amadeus",
    period: "Sep 2025 - Present",
    image: "/assets/experiences/amadeus.svg",
    imageAlt: "Amadeus logo",
    focus:
      "Building internal tooling to streamline developer workflows across the team and beyond.",
    summary:
      "Alternance as a software engineer with a focus on delivering concrete product impact through implementation quality and reliable execution.",
    stack: ["Software Engineering", "Product Impact"],
  },
  {
    category: "Experience",
    role: "Machine Learning Engineer Intern",
    company: "Proptexx",
    period: "Dec 2024 - Apr 2025",
    image: "/assets/experiences/proptexx.webp",
    imageAlt: "Proptexx logo",
    focus: "Full-stack and ML workflow tooling.",
    summary:
      "Contributed to full-stack products and internal tools supporting machine-learning workflows, improving day-to-day iteration and team efficiency.",
    stack: ["Full-stack", "ML Workflow Tools"],
  },
  {
    category: "Education",
    role: "Project-Based Software Engineering Program",
    company: "42 Nice",
    period: "Nov 2022 - Present",
    image: "/assets/experiences/42logo.png",
    imageAlt: "42 School logo",
    logoVariant: "square",
    focus:
      "Intensive project-based training with a strong engineering mindset and collaborative problem solving.",
    summary:
      "Built a rigorous foundation through peer-driven, project-based software engineering with emphasis on systems thinking and practical implementation.",
    stack: ["Systems Programming", "Algorithms", "Networking", "Graphics"],
  },
  {
    category: "Education",
    role: "Cinema Studies",
    company: "Pantheon-Sorbonne University",
    period: "2019 - 2021",
    image: "/assets/experiences/pantheon-sorbonne.svg",
    imageAlt: "Sorbonne logo",
    logoVariant: "square",
    focus: "Focus on visual storytelling, analysis, and artistic direction.",
    summary:
      "Studied cinema with an emphasis on narrative construction, visual language, critical analysis, and direction sensibility.",
    stack: ["Visual Storytelling", "Analysis", "Artistic Direction"],
  },
  {
    category: "Education",
    role: "International Curriculum",
    company: "Centre International de Valbonne",
    period: "2016 - 2019",
    image: "/assets/experiences/civlogo.png",
    imageAlt: "Centre International de Valbonne logo",
    focus: "International curriculum in a multicultural environment.",
    summary:
      "Developed academic and interpersonal foundations in an international setting shaped by multicultural collaboration and adaptability.",
    stack: ["International Curriculum", "Multicultural Environment"],
  },
];

export const services = [
  {
    title: "Product Strategy",
    description:
      "Align product teams with a crisp narrative, clear metrics, and testable hypotheses.",
  },
  {
    title: "Experience Design",
    description:
      "Craft resilient flows, purposeful interfaces, and systems that scale without losing warmth.",
  },
  {
    title: "Frontend Direction",
    description:
      "Bridge design and build with production-ready UI, motion, and QA support.",
  },
];

export const processSteps = [
  {
    title: "Discover",
    description:
      "Workshops, user interviews, and data reviews to surface the real constraints.",
  },
  {
    title: "Define",
    description:
      "Journey mapping, information architecture, and design principles that guide decisions.",
  },
  {
    title: "Design",
    description:
      "High-fidelity systems, motion studies, and prototyping for fast iteration.",
  },
  {
    title: "Deliver",
    description:
      "Design QA, handoff playbooks, and launch support to keep quality intact.",
  },
];

export const toolkit = [
  "Figma",
  "React",
  "Vite",
  "GSAP",
  "Storybook",
  "Notion",
  "Framer",
  "Three.js",
];

export const aboutNote = {
  eyebrow: "Currently",
  text: "Building a calm dashboard language for data-heavy SaaS teams with distributed users.",
};

export const contact = {
  email: "hanmin@hpark.me",
};

export const socialLinks = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/hanmin-park-83239718b/" },
  { label: "Dribbble", href: "https://dribbble.com" },
  { label: "GitHub", href: "https://github.com/hanmpark" },
];
