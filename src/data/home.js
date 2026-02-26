export const navLinks = [
  { label: "Work", href: "#work" },
  { label: "Experience", href: "#experience" },
  { label: "About", href: "#about" },
];

export const sectionCopy = {
  experience: {
    eyebrow: "Experience & Education",
    title: "A timeline of work and studies.",
    subtitle:
      "A scrollable timeline of professional experience and academic background, blending engineering practice with visual culture and storytelling.",
  },
  contact: {
    eyebrow: "Get in touch",
    title: "Let's talk",
    subtitle:
      "Have a project in mind or just want to connect? Drop me a message or reach out through any of the channels below.",
  },
};

export const projects = [
  {
    title: "Mini Ray Tracer",
    subtitle: "Ray Tracing Engine in C",
    slug: "miniraytracer",
    description:
      "A minimal ray tracing engine implementing lighting, shadows, reflections, and 3D scene rendering from scratch. Built to explore computer graphics and mathematical rendering principles.",
    previewImage: "/works/rt1.webp",
    tags: ["C", "Ray Tracing", "Computer Graphics"],
    links: {
      repo: "https://github.com/hanmpark/miniraytracer",
    },
  },
  {
    title: "Tetris",
    subtitle: "Real-Time Multiplayer Game",
    slug: "tetris",
    description:
      "A competitive multiplayer Tetris game featuring real-time synchronization, state management, and networked gameplay architecture.",
    previewImage: "/works/tetris-game.webp",
    tags: ["TypeScript", "Multiplayer", "WebSockets"],
    links: {
      repo: "https://github.com/okbrandon/red-tetris",
      demo: "https://tetris.brandoncodes.dev/",
    },
  },
  {
    title: "so_long",
    subtitle: "2D Game Engine in C",
    slug: "so_long",
    description:
      "A lightweight 2D game built in C using a custom rendering loop, sprite management, and event handling. Focused on memory control, game logic, and low-level graphics programming.",
    previewImage: "/works/so_long.webp",
    tags: ["C", "2D Graphics", "Game Development"],
    links: {
      repo: "https://github.com/hanmpark/so_long",
    },
  },
  {
    title: "Scholarship Time Tracker",
    subtitle: "Hour Tracking Tool for 42 Nice Students",
    slug: "scholarship-logtime",
    description:
      "A tool that tracks and calculates cumulative hours for 42 Nice students, helping them log required monthly hours for scholarship eligibility. It automates hour tracking, reduces admin overhead, and gives a clear view of progress and time management.",
    previewImage: "/works/42 Logtime.webp",
    tags: ["Time Tracking", "Productivity Tool", "42 Nice"],
    links: {
      repo: "https://github.com/hanmpark/scholarship_logtime",
    },
  },
];

export const experiences = [
  {
    category: "Experience",
    role: "Freelance Software Developer",
    company: "The Good Cleaners",
    period: "Feb 2026 - Present",
    image: "/assets/experiences/thegoodcleaners.png",
    imageAlt: "The Good Cleaners logo",
    logoVariant: "square",
    focus: "Freelance product and web development support.",
    summary:
      "Providing freelance support for The Good Cleaners, helping build and refine reliable web experiences.",
    stack: ["Freelance", "Web Development", "Product Support"],
  },
  {
    category: "Experience",
    role: "Software Developer",
    company: "Amadeus",
    period: "Sep 2025 - Present",
    image: "/assets/experiences/amadeus.svg",
    imageAlt: "Amadeus logo",
    focus:
      "Building internal tooling to streamline developer workflows across the team and beyond.",
    summary:
      "Apprenticeship focused on delivering tangible product impact through high-quality implementation and reliable execution.",
    stack: ["Software Engineering", "Product Impact"],
  },
  {
    category: "Experience",
    role: "Machine Learning Intern",
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

export const contact = {
  email: "hanmin@hpark.me",
};

export const socialLinks = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/hanmin-park-83239718b/",
  },
  { label: "Dribbble", href: "https://dribbble.com" },
  { label: "GitHub", href: "https://github.com/hanmpark" },
];
