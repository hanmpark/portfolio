export const navLinks = [
  { key: "about", href: "#about" },
  { key: "work", href: "#work" },
  { key: "experience", href: "#experience" },
];

export const projects = [
  {
    title: "Compass",
    subtitle: "Plan trips together",
    subtitle_fr: "Préparer ses voyages à plusieurs",
    slug: "compass",
    featured: true,
    description:
      "An application born from a trip to Prague, bringing itineraries, places, notes, and documents together to plan a stay with others.",
    description_fr:
      "Une application née d’un voyage à Prague, qui réunit itinéraires, lieux, notes et documents pour préparer un séjour à plusieurs.",
    previewImage: "/works/compass/social-preview-tropical.webp",
    previewImages: [
      "/works/compass/trip-overview.webp",
      "/works/compass/itinerary.webp",
      "/works/compass/trips-dashboard.webp",
    ],
    tags: ["React", "TypeScript", "Supabase"],
    links: {
      demo: "https://compass.hpark.me",
    },
  },
  {
    title: "Mini Ray Tracer",
    subtitle: "Ray tracing in C",
    subtitle_fr: "Rendu par lancer de rayons en C",
    slug: "miniraytracer",
    description:
      "A renderer developed as a team project at 42 to explore how 3D images are calculated: shapes, lighting, shadows, and reflections.",
    description_fr:
      "Un moteur de rendu développé en équipe à 42 pour explorer le calcul d’images 3D : formes, éclairage, ombres et réflexions.",
    previewImage: "/works/rt1.webp",
    previewImages: [
      "/works/rt1.webp",
      "/works/rt2.webp",
      "/works/rt3.webp",
    ],
    tags: ["C", "Ray Tracing", "Computer Graphics"],
    links: {
      repo: "https://github.com/hanmpark/miniraytracer",
    },
  },
  {
    title: "Red Tetris",
    subtitle: "Online multiplayer Tetris",
    subtitle_fr: "Tetris multijoueur en ligne",
    slug: "tetris",
    description:
      "A Tetris game with private rooms, several game modes, and a spectator view. Built as a pair at 42 with React and Socket.IO.",
    description_fr:
      "Un Tetris avec des salons privés, plusieurs modes de jeu et une vue spectateur. Développé en binôme à 42 avec React et Socket.IO.",
    previewImage: "/works/tetris-lobby.webp",
    previewImages: [
      "/works/tetris-game.webp",
      "/works/tetris-lobby.webp",
      "/works/tetris-history.webp",
    ],
    tags: ["TypeScript", "Multiplayer", "WebSockets"],
    links: {
      repo: "https://github.com/okbrandon/red-tetris",
    },
  },
  {
    title: "Scholarship Time Tracker",
    subtitle: "Attendance tracking for 42 Nice students",
    subtitle_fr: "Suivi des heures de présence à 42 Nice",
    slug: "scholarship-logtime",
    description:
      "A command-line tool that calculates attendance hours and a daily target for 42 Nice GEN scholarship students.",
    description_fr:
      "Un outil en ligne de commande qui calcule les heures de présence et un objectif quotidien pour les étudiants boursiers GEN de 42 Nice.",
    previewImage: "/works/42 Logtime.webp",
    previewImages: [
      "/works/logtime1.webp",
      "/works/logtime2.webp",
      "/works/42 Logtime.webp",
    ],
    tags: ["Time Tracking", "Productivity Tool", "42 Nice"],
    links: {
      repo: "https://github.com/hanmpark/scholarship_logtime",
    },
  },
  {
    title: "so_long",
    subtitle: "A 2D game in C",
    subtitle_fr: "Un jeu 2D en C",
    slug: "so_long",
    description:
      "A game made at 42 to learn how to display sprites, handle keyboard input, and manage memory in C. Collect the items and reach the exit while avoiding enemies.",
    description_fr:
      "Un jeu réalisé à 42 pour apprendre à afficher des sprites, gérer les commandes au clavier et manipuler la mémoire en C. Il faut ramasser les objets et atteindre la sortie en évitant les ennemis.",
    previewImage: "/works/so_long.webp",
    previewImages: ["/works/so_long.webp"],
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
    focus: "Web development and improvements to the booking process.",
    focus_fr: "Développement web et amélioration du parcours de réservation.",
    summary: "I work on the website’s forms and booking process to make them easier to use.",
    summary_fr:
      "J’interviens sur les formulaires et le parcours de réservation du site pour en faciliter l’utilisation.",
    stack: ["Freelance", "Web Development", "Product Support"],
  },
  {
    category: "Experience",
    role: "Software Developer",
    role_fr: "Développeur logiciel",
    company: "Amadeus",
    period: "Sep 2025 - Sep 2026",
    period_fr: "Sep. 2025 - Sep. 2026",
    image: "/assets/experiences/amadeus.svg",
    imageAlt: "Amadeus logo",
    focus: "Internal tools for developers.",
    focus_fr: "Outils internes pour les développeurs.",
    summary:
      "During my apprenticeship, I worked on internal tools to help developers with their day-to-day work, within my team and beyond.",
    summary_fr:
      "Pendant mon alternance, j’ai contribué à des outils internes destinés à faciliter le travail quotidien des développeurs, dans mon équipe et au-delà.",
    stack: ["Software Development", "Internal Tools"],
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
    focus: "Web applications and tools for machine learning projects.",
    focus_fr: "Applications web et outils pour des projets de machine learning.",
    summary:
      "During this internship, I contributed to web applications and internal tools used by the machine learning team.",
    summary_fr:
      "Lors de ce stage, j’ai participé au développement d’applications web et d’outils internes utilisés par l’équipe de machine learning.",
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
    focus: "Learning to code through projects and peer collaboration.",
    focus_fr: "Apprentissage du code par projets et échanges entre étudiants.",
    summary:
      "The curriculum has given me practice with C programming, algorithms, networking, and graphics through individual and team projects.",
    summary_fr:
      "Le cursus m’a permis de pratiquer la programmation en C, les algorithmes, le réseau et le graphisme à travers des projets individuels et collectifs.",
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
    focus: "Film studies and visual storytelling.",
    focus_fr: "Études du cinéma et de la narration visuelle.",
    summary:
      "I studied film analysis, visual language, and storytelling. This interest continues through filming and editing.",
    summary_fr:
      "J’y ai étudié l’analyse de films, le langage des images et la construction d’un récit. Je prolonge cet intérêt à travers la vidéo et le montage.",
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
    focus: "An international school environment.",
    focus_fr: "Une scolarité dans un environnement international.",
    summary:
      "I followed an international curriculum alongside students from different cultural backgrounds.",
    summary_fr: "J’ai suivi un cursus international aux côtés d’élèves de différentes cultures.",
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
