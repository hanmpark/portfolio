export const navLinks = [
  { key: "work", href: "#work" },
  { key: "experience", href: "#experience" },
  { key: "about", href: "#about" },
];

export const projects = [
  {
    title: "Mini Ray Tracer",
    subtitle: "Ray Tracing Engine in C",
    subtitle_fr: "Moteur de Ray Tracing en C",
    slug: "miniraytracer",
    description:
      "A minimal ray tracing engine implementing lighting, shadows, reflections, and 3D scene rendering from scratch. Built to explore computer graphics and mathematical rendering principles.",
    description_fr:
      "Un moteur de ray tracing minimal implémentant éclairage, ombres, réflexions et rendu 3D de scènes à partir de zéro. Conçu pour explorer l'infographie et les principes mathématiques de rendu.",
    previewImage: "/works/rt1.webp",
    tags: ["C", "Ray Tracing", "Computer Graphics"],
    links: {
      repo: "https://github.com/hanmpark/miniraytracer",
    },
  },
  {
    title: "Tetris",
    subtitle: "Real-Time Multiplayer Game",
    subtitle_fr: "Jeu multijoueur en temps réel",
    slug: "tetris",
    description:
      "A competitive multiplayer Tetris game featuring real-time synchronization, state management, and networked gameplay architecture.",
    description_fr:
      "Un jeu Tetris multijoueur compétitif avec synchronisation en temps réel, gestion d'état et architecture réseau.",
    previewImage: "/works/tetris-game.webp",
    tags: ["TypeScript", "Multiplayer", "WebSockets"],
    links: {
      repo: "https://github.com/okbrandon/red-tetris",
      demo: "https://tetris.brandoncodes.dev/",
    },
  },
  {
    title: "Scholarship Time Tracker",
    subtitle: "Hour Tracking Tool for 42 Nice Students",
    subtitle_fr: "Outil de suivi des heures pour les étudiants de 42 Nice",
    slug: "scholarship-logtime",
    description:
      "A tool that tracks and calculates cumulative hours for 42 Nice students, helping them log required monthly hours for scholarship eligibility. It automates hour tracking, reduces admin overhead, and gives a clear view of progress and time management.",
    description_fr:
      "Un outil qui suit et calcule les heures cumulées des étudiants de 42 Nice, les aidant à enregistrer les heures mensuelles requises pour l'éligibilité à la bourse. Il automatise le suivi, réduit les tâches administratives et offre une vue claire de la progression.",
    previewImage: "/works/42 Logtime.webp",
    tags: ["Time Tracking", "Productivity Tool", "42 Nice"],
    links: {
      repo: "https://github.com/hanmpark/scholarship_logtime",
    },
  },
  {
    title: "so_long",
    subtitle: "2D Game Engine in C",
    subtitle_fr: "Moteur de jeu 2D en C",
    slug: "so_long",
    description:
      "A lightweight 2D game built in C using a custom rendering loop, sprite management, and event handling. Focused on memory control, game logic, and low-level graphics programming.",
    description_fr:
      "Un jeu 2D léger construit en C avec une boucle de rendu personnalisée, gestion des sprites et des événements. Axé sur le contrôle mémoire, la logique de jeu et la programmation graphique bas niveau.",
    previewImage: "/works/so_long.webp",
    tags: ["C", "2D Graphics", "Game Development"],
    links: {
      repo: "https://github.com/hanmpark/so_long",
    },
  },
];

export const experiences = [
  {
    category: "Experience",
    role: "Freelance Software Developer",
    role_fr: "Développeur logiciel freelance",
    company: "The Good Cleaners",
    period: "Feb 2026 - Present",
    period_fr: "Fév. 2026 - Présent",
    image: "/assets/experiences/thegoodcleaners.png",
    imageAlt: "The Good Cleaners logo",
    logoVariant: "square",
    focus: "Freelance product and web development support.",
    focus_fr: "Support freelance en développement produit et web.",
    summary:
      "Providing freelance support for The Good Cleaners, helping build and refine reliable web experiences.",
    summary_fr:
      "Support freelance pour The Good Cleaners, aidant à construire et affiner des expériences web fiables.",
    stack: ["Freelance", "Web Development", "Product Support"],
  },
  {
    category: "Experience",
    role: "Software Developer",
    role_fr: "Développeur logiciel",
    company: "Amadeus",
    period: "Sep 2025 - Present",
    period_fr: "Sep. 2025 - Présent",
    image: "/assets/experiences/amadeus.svg",
    imageAlt: "Amadeus logo",
    focus:
      "Building internal tooling to streamline developer workflows across the team and beyond.",
    focus_fr:
      "Développement d'outils internes pour fluidifier les workflows des développeurs au sein et au-delà de l'équipe.",
    summary:
      "Apprenticeship focused on delivering tangible product impact through high-quality implementation and reliable execution.",
    summary_fr:
      "Alternance axée sur un impact produit concret à travers une implémentation de qualité et une exécution fiable.",
    stack: ["Software Engineering", "Product Impact"],
  },
  {
    category: "Experience",
    role: "Machine Learning Intern",
    role_fr: "Stagiaire en Machine Learning",
    company: "Proptexx",
    period: "Dec 2024 - Apr 2025",
    period_fr: "Déc. 2024 - Avr. 2025",
    image: "/assets/experiences/proptexx.webp",
    imageAlt: "Proptexx logo",
    focus: "Full-stack and ML workflow tooling.",
    focus_fr: "Outils full-stack et workflows de Machine Learning.",
    summary:
      "Contributed to full-stack products and internal tools supporting machine-learning workflows, improving day-to-day iteration and team efficiency.",
    summary_fr:
      "Contribution à des produits full-stack et des outils internes pour les workflows de machine learning, améliorant l'itération quotidienne et l'efficacité de l'équipe.",
    stack: ["Full-stack", "ML Workflow Tools"],
  },
  {
    category: "Education",
    role: "Project-Based Software Engineering Program",
    role_fr: "Programme d'ingénierie logicielle par projets",
    company: "42 Nice",
    period: "Nov 2022 - Present",
    period_fr: "Nov. 2022 - Présent",
    image: "/assets/experiences/42logo.png",
    imageAlt: "42 School logo",
    logoVariant: "square",
    focus:
      "Intensive project-based training with a strong engineering mindset and collaborative problem solving.",
    focus_fr:
      "Formation intensive par projets avec un esprit d'ingénierie fort et une résolution collaborative de problèmes.",
    summary:
      "Built a rigorous foundation through peer-driven, project-based software engineering with emphasis on systems thinking and practical implementation.",
    summary_fr:
      "Construction d'une base rigoureuse à travers l'ingénierie logicielle par projets et par pairs, avec un accent sur la pensée systémique et l'implémentation pratique.",
    stack: ["Systems Programming", "Algorithms", "Networking", "Graphics"],
  },
  {
    category: "Education",
    role: "Cinema Studies",
    role_fr: "Études cinématographiques",
    company: "Pantheon-Sorbonne University",
    period: "2019 - 2021",
    image: "/assets/experiences/pantheon-sorbonne.svg",
    imageAlt: "Sorbonne logo",
    logoVariant: "square",
    focus: "Focus on visual storytelling, analysis, and artistic direction.",
    focus_fr:
      "Axé sur la narration visuelle, l'analyse et la direction artistique.",
    summary:
      "Studied cinema with an emphasis on narrative construction, visual language, critical analysis, and direction sensibility.",
    summary_fr:
      "Études cinématographiques avec un accent sur la construction narrative, le langage visuel, l'analyse critique et la sensibilité de mise en scène.",
    stack: ["Visual Storytelling", "Analysis", "Artistic Direction"],
  },
  {
    category: "Education",
    role: "International Curriculum",
    role_fr: "Cursus international",
    company: "Centre International de Valbonne",
    period: "2016 - 2019",
    image: "/assets/experiences/civlogo.png",
    imageAlt: "Centre International de Valbonne logo",
    focus: "International curriculum in a multicultural environment.",
    focus_fr: "Cursus international dans un environnement multiculturel.",
    summary:
      "Developed academic and interpersonal foundations in an international setting shaped by multicultural collaboration and adaptability.",
    summary_fr:
      "Développement de bases académiques et interpersonnelles dans un cadre international façonné par la collaboration multiculturelle et l'adaptabilité.",
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
