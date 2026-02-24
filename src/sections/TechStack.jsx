import { useEffect, useRef } from "react";
import { sectionCopy } from "../data/home.js";
import useScrollReveal from "../hooks/useScrollReveal.js";
import "./TechStack.css";

const icons = {
  C: "/assets/stacks/c.svg",
  Python: "/assets/stacks/python.svg",
  JavaScript: "/assets/stacks/javascript.svg",
  TypeScript: "/assets/stacks/typescript.svg",
  React: "/assets/stacks/react.svg",
  Redux: "/assets/stacks/redux.svg",
  "Styled‑components": "/assets/stacks/styled-components.svg",
  HTML: "/assets/stacks/html.svg",
  CSS: "/assets/stacks/css.svg",
  Flask: "/assets/stacks/flask.svg",
  "Node.js": "/assets/stacks/nodejs.svg",
  Unix: "/assets/stacks/bash.svg",
  Git: "/assets/stacks/git.svg",
  Docker: "/assets/stacks/docker.svg",
  Linux: "/assets/stacks/linux.svg",
};

const allItems = [
  "C",
  "Python",
  "JavaScript",
  "TypeScript",
  "React",
  "Redux",
  "HTML",
  "CSS",
  "Flask",
  "Node.js",
  "Unix",
  "Git",
  "Docker",
  "Linux",
];

const TechStack = () => {
  const sectionRef = useRef(null);
  const revealRef = useScrollReveal({ threshold: 0.1 });

  /* Scroll-driven parallax for accent images */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const progress = Math.min(
        Math.max((vh - rect.top) / (rect.height + vh), 0),
        1,
      );
      el.style.setProperty("--section-scroll", progress.toFixed(4));
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
    };
  }, []);

  return (
    <section
      className="section ts-section"
      id="tech-stack"
      ref={(node) => {
        sectionRef.current = node;
        revealRef.current = node;
      }}
    >
      {/* Floating accent images */}
      <img
        className="ts-accent ts-accent--1"
        src="/assets/premium/fig3.png"
        alt=""
        aria-hidden="true"
      />
      <img
        className="ts-accent ts-accent--2"
        src="/assets/premium/space-rocket.png"
        alt=""
        aria-hidden="true"
      />

      <div className="container ts-inner">
        <header className="ts-head">
          <p className="eyebrow reveal reveal-up">
            {sectionCopy.stack.eyebrow}
          </p>
          <h2 className="section-title reveal reveal-up">
            {sectionCopy.stack.title}
          </h2>
        </header>

        <div className="ts-grid reveal-stagger" aria-label="Tech stack">
          {allItems.map((item, i) => {
            const src = icons[item];
            return (
              <div
                className="ts-item reveal reveal-scale"
                style={{ "--reveal-i": i }}
                key={item}
              >
                <span className="ts-icon">
                  {src ? (
                    <img src={src} alt="" loading="lazy" />
                  ) : (
                    <span className="ts-mono">{item.slice(0, 2)}</span>
                  )}
                </span>
                <span className="ts-label">{item}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TechStack;
