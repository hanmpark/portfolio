import { useEffect, useRef } from "react";
import useScrollReveal from "../hooks/useScrollReveal.js";
import "./About.css";

const aboutParagraphs = [
  "I am Hanmin Park. I'm a software developer who enjoys building reliable, well-structured products with a strong focus on clarity and long-term maintainability.",
  "My background at 42 shaped the way I work: I like understanding systems deeply before abstracting them into clean architectures. I've worked across systems programming, graphics, full-stack web applications, and AI-driven tooling.",
  "I also studied cinema, which influences how I think about composition, rhythm, and user experience. I bring that perspective into my engineering work to build products that feel both solid and thoughtful.",
];

const About = () => {
  const sectionRef = useRef(null);
  const revealRef = useScrollReveal({ threshold: 0.12 });

  /* Scroll-driven parallax */
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
      className="section abt-section"
      id="about"
      ref={(node) => {
        sectionRef.current = node;
        revealRef.current = node;
      }}
    >
      {/* Floating accent */}
      <img
        className="abt-accent"
        src="/assets/premium/fig4.png"
        alt=""
        aria-hidden="true"
      />

      <div className="container abt-inner">
        <div className="abt-content">
          <p className="eyebrow reveal reveal-up">About</p>
          <h2 className="section-title abt-title reveal reveal-up">
            Hey there !
          </h2>

          <div
            className="abt-prose reveal reveal-up"
            style={{ "--reveal-i": 1 }}
          >
            {aboutParagraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>

        <figure
          className="abt-portrait reveal reveal-scale"
          style={{ "--reveal-i": 2 }}
        >
          <img src="/assets/self_image.jpg" alt="Hanmin Park" loading="lazy" />
        </figure>
      </div>
    </section>
  );
};

export default About;
