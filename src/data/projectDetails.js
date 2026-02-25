export const projectDetails = {
  "scholarship-logtime": {
    title: "Scholarship Logtime",
    subtitle:
      "A CLI tool for 42 Nice GEN scholarship students that calculates cumulative logtime from the 27th to the 26th, including bonus hours carried over from the previous month.",
    heroImage: "/works/logtime1.png",
    tags: ["C", "Shell", "42 API", "CLI", "Productivity"],
    repo: "https://github.com/hanmpark/scholarship_logtime",
    demo: null,
    demoNotice: null,
    description: [
      "scholarship_logtime is a <strong>command-line tool</strong> built in C and Shell, exclusively designed for 42 Nice GEN scholarship students. It calculates cumulative logtime spanning from the 27th of one month to the 26th of the next, connecting to the <strong>42 API</strong> to pull real session data.",
      "The program gives students a clear picture of their progress: <strong>time remaining</strong> until the deadline, <strong>days left</strong> (accounting for planned days off), and a <strong>daily target</strong> so they can pace their hours intelligently. It even factors in up to 70 bonus hours earned in the preceding month.",
      "Public holidays automatically add 7 hours to the logtime counter, and any additional time spent on-site stacks on top. With 17 stars on GitHub and contributions from <strong>Leo Fresnay</strong>, the tool has become a go-to utility for scholarship students managing their monthly hour requirements.",
    ],
    features: [
      "Calculates cumulative logtime from the 27th to the 26th using the 42 API.",
      "Shows time remaining and days left until the monthly deadline.",
      "Computes a daily target accounting for planned days off.",
      "Carries over up to 70 bonus hours from the previous month.",
      "Public holidays automatically credited with 7 base hours.",
      "Optional date display with the -s flag for detailed breakdowns.",
      "Runs from any directory after initial setup with init_sslog.",
    ],
    gallery: [
      {
        type: "image",
        src: "/works/logtime2.png",
        alt: "Scholarship Logtime output",
      },
    ],
  },
  so_long: {
    title: "so_long",
    subtitle:
      "A 2D tile-based game built in C for the 42 Common Core — the first graphical project introducing window management, event handling, and texture rendering with the MLX42 library.",
    heroImage: "/works/so_long.png",
    tags: ["C", "2D Graphics", "Game Development", "MLX42", "Tile-Based"],
    repo: "https://github.com/hanmpark/so_long",
    demo: null,
    demoNotice: null,
    description: [
      "so_long is a <strong>2D tile-based game</strong> written in C as the first graphical project of the 42 Common Core. It introduces the fundamentals of window management, event handling (keyboard and mouse), and color and texture rendering using the MLX42 library.",
      "The player navigates a map filled with <strong>walls, collectibles, and an exit</strong>. A simple enemy AI patrols left to right, and collision with an enemy triggers a Game Over. The game parses and validates <code>.ber</code> map files to ensure correct layout before rendering.",
      "Under the hood the project exercises <strong>low-level graphics programming</strong> in C — sprite management, a custom rendering loop, memory control, and efficient event-driven game logic, all without a high-level engine.",
    ],
    features: [
      "2D tile-based map rendering with walls, collectibles, player, and exit.",
      "Simple enemy AI that patrols left to right across the map.",
      "Collision detection: touching an enemy ends the game.",
      "Map parsing and validation from .ber files before gameplay.",
      "Keyboard controls for player movement.",
      "Sprite and texture management using the MLX42 library.",
      "Custom rendering loop with frame-rate control.",
    ],
    gallery: [
      {
        type: "video",
        src: "/works/so_long.mp4",
        alt: "so_long gameplay demo",
      },
    ],
  },
  miniraytracer: {
    title: "RT",
    subtitle:
      "A CPU ray tracer written in C for the 42 RT project — rendering spheres, planes, cylinders, and cones with lighting, shadows, reflections, and procedural textures.",
    heroImage: "/works/rt1.png",
    tags: [
      "C",
      "Ray Tracing",
      "Computer Graphics",
      "MiniLibX",
      "Multithreading",
    ],
    repo: "https://github.com/hanmpark/miniraytracer",
    demo: null,
    demoNotice: null,
    description: [
      "RT is a <strong>CPU ray tracer</strong> written in C that parses <code>.rt</code> scene files and renders full 3D scenes from scratch. It supports spheres, planes, cylinders, and cones with diffuse color, specular highlights, reflections, and a procedural checker texture.",
      "The renderer features <strong>ambient lighting plus multiple colored point lights</strong>, hard shadows, and recursive reflections with configurable depth. A 2×2 antialiasing pass (4 samples per pixel) ensures smooth edges, while multithreaded rendering keeps frame times practical.",
      "A fast preview mode disables AA and specular calculations so you can <strong>interactively move the camera</strong> with WASD + arrow keys, then switch back to full quality for a final render. MiniLibX handles the display window on both Linux and macOS.",
      "Built collaboratively with <a href='https://github.com/YounesBouhlel' target='_blank'><strong>Younes Bouhlel</strong></a>, <a href='https://github.com/Shazway' target='_blank'><strong>Shazway</strong></a>, and <a href='https://github.com/evnsh' target='_blank'><strong>evnsh</strong></a> as part of the 42 curriculum.",
    ],
    features: [
      "Shapes: sphere, plane, cylinder (with end caps), and cone.",
      "Materials: diffuse color, specular highlights, reflections, and procedural checker pattern.",
      "Ambient light plus multiple colored point lights with hard shadows.",
      "Recursive reflections with configurable depth and shadow bias.",
      "2×2 antialiasing (4 samples per pixel) for smooth edges.",
      "Interactive fast-preview mode for real-time camera movement.",
      "Multithreaded rendering for faster frame computation.",
      "Progressive refresh and render-time logging per frame.",
    ],
    gallery: [
      {
        type: "image",
        src: "/works/rt2.png",
        alt: "RT rendered scene with reflections",
      },
      {
        type: "image",
        src: "/works/rt3.png",
        alt: "RT rendered objects showcase",
      },
    ],
  },
  tetris: {
    title: "Red Tetris",
    subtitle:
      "A multiplayer-first Tetris game built with real-time Socket.IO networking, a React/Vite frontend, and persistent player history backed by MongoDB.",
    heroImage: "/works/tetris-game.png",
    tags: [
      "TypeScript",
      "React",
      "Socket.IO",
      "MongoDB",
      "Multiplayer",
      "WebSockets",
    ],
    repo: "https://github.com/okbrandon/red-tetris",
    demo: "https://tetris.brandoncodes.dev/",
    demoNotice:
      "The live demo is designed for desktop browsers only and is not optimized for mobile devices.",
    description: [
      'Red Tetris is a <strong>full-stack remake</strong> of the classic game with a strong focus on social play. Players can spin up private lobbies, spectate friends, or speed-run solo "journeys." The backend implements the game engine, line-clear logic, and a persistence layer, while the Vite/React frontend handles routing, lobby UX, notifications, and the arena views.',
      "MongoDB stores the latest five results per player so the <strong>history view</strong> can recap recent runs. The project is built as a 42 School project and is still evolving, but the gameplay loop, lobby flow, stats storage, and CI checks are already in place.",
      "Built collaboratively with <a href='https://github.com/okbrandon' target='_blank'><strong>okbrandon</strong></a> — combining real-time game networking, state management, and polished UI/UX into a cohesive multiplayer experience.",
    ],
    features: [
      "Real-time multiplayer powered by Socket.IO rooms with owner hand-offs and configurable game modes (classic, fast-paced, invisible pieces, morph pieces).",
      "Solo Journey mode that auto-starts a private arena with your preferred difficulty.",
      "Lobby management with owner-only controls, mode previews, and an animated notification system.",
      "Spectator view and specter columns so eliminated players can keep watching opponents.",
      "Persistent player history stored in MongoDB and surfaced through Redux slices.",
      "Full CI pipeline with GitHub Actions, Docker Compose stack, and automated release workflows.",
    ],
    gallery: [
      {
        type: "image",
        src: "/works/tetris-lobby.png",
        alt: "Tetris lobby screen",
      },
      {
        type: "image",
        src: "/works/tetris-history.png",
        alt: "Tetris game history",
      },
      {
        type: "video",
        src: "/works/tetris-multiplayer.mp4",
        alt: "Tetris multiplayer gameplay",
      },
    ],
  },
};
