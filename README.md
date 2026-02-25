# hpark.me

My personal portfolio — a minimal, dark-themed single-page site with dedicated project pages, scroll-driven animations, and a glassmorphism design language.

**[hpark.me](https://hpark.me)**

---

## Overview

A hand-crafted portfolio built with React and Vite. No UI libraries, no templates — just clean CSS and vanilla React for full control over every detail.

### Sections

| Section        | Description                                                       |
| -------------- | ----------------------------------------------------------------- |
| **Hero**       | Animated intro with parallax figures and pointer-tracking effects |
| **Work**       | Project grid with hover-reveal cards linking to detail pages      |
| **Experience** | Scrollable timeline of professional and academic milestones       |
| **About**      | Personal introduction                                             |
| **Contact**    | Functional contact form                                           |

### Features

- **Project detail pages** — each project has its own route (`/project/:slug`) with hero banner, description, feature list, image gallery, and video embeds
- **Image lightbox** — click any gallery image for a full-screen preview with keyboard dismiss
- **Scroll reveal** — sections animate in as they enter the viewport
- **Scroll progress bar** — thin indicator at the top of the page
- **Back to top** — floating button that appears on scroll
- **Glassmorphism UI** — frosted-glass cards, navbar, and overlays with consistent design tokens
- **Dark theme** — neutral warm-gray palette with no accent colors
- **Fully responsive** — optimized for desktop, tablet, and mobile

## Tech Stack

- **React 18** — component architecture
- **Vite 7** — bundler and dev server
- **React Router** — client-side routing for project pages
- **CSS** — custom properties, `clamp()`, container queries, no preprocessors
- **PostCSS + Autoprefixer** — vendor prefixing

## Project Structure

```
src/
├── app/             # Root App component + global layout CSS
├── components/      # Navbar, ScrollProgress, BackToTopButton
├── data/            # Home page data + project detail entries
├── hooks/           # Custom hooks (scroll reveal)
├── pages/           # ProjectDetail page + lightbox
├── sections/        # Hero, Work, Experience, About, Contact
└── styles/          # Global CSS, shared utilities, animations
```

## Getting Started

```bash
# Clone
git clone https://github.com/hanmpark/portfolio.git
cd portfolio

# Install
npm install

# Dev server
npm run dev

# Production build
npm run build
npm run preview
```

---

Built by [Hanmin Park](https://hpark.me)
