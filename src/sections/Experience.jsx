import { useEffect, useRef } from "react";
import { experiences, sectionCopy } from "../data/home.js";
import useScrollReveal from "../hooks/useScrollReveal.js";
import "./Experience.css";

const workItems = experiences.filter((e) => e.category === "Experience");
const eduItems = experiences.filter((e) => e.category === "Education");

const Card = ({ item, index }) => (
  <article className="exp-card" style={{ "--card-i": index }}>
    <span className="exp-marker" aria-hidden="true" />
    <div className="exp-card-inner">
      <div className="exp-card-top">
        {item.image && (
          <figure
            className={`exp-logo${
              item.logoVariant ? ` exp-logo--${item.logoVariant}` : ""
            }`}
          >
            <img src={item.image} alt={item.imageAlt ?? ""} loading="lazy" />
          </figure>
        )}
        <div>
          <p className="exp-role">{item.role}</p>
          <p className="exp-company">{item.company}</p>
          {item.period ? <p className="exp-period">{item.period}</p> : null}
        </div>
      </div>
      <p className="exp-summary">{item.focus}</p>
      {item.stack?.length ? (
        <div className="tag-row exp-tags">
          {item.stack.map((tag) => (
            <span className="pill" key={tag}>
              {tag}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  </article>
);

const Experience = () => {
  const sectionRef = useRef(null);
  const revealRef = useScrollReveal({ threshold: 0.1, selector: ".reveal" });

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
      el.style.setProperty("--exp-scroll", progress.toFixed(4));
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
      className="section exp-section"
      id="experience"
      ref={(node) => {
        sectionRef.current = node;
        revealRef.current = node;
      }}
    >
      {/* Floating accent images */}
      <img
        className="exp-accent exp-accent--1"
        src="https://assets.hpark.me/premium/fig1.png"
        alt=""
        aria-hidden="true"
      />
      <img
        className="exp-accent exp-accent--2"
        src="https://assets.hpark.me/premium/fig2.png"
        alt=""
        aria-hidden="true"
      />

      <div className="container exp-inner">
        <header className="exp-head">
          <p className="eyebrow reveal reveal-up">
            {sectionCopy.experience.eyebrow}
          </p>
          <h2 className="section-title reveal reveal-up">
            {sectionCopy.experience.title}
          </h2>
        </header>

        <div className="exp-columns">
          {/* Experience column */}
          <div className="exp-col reveal reveal-up">
            <h3 className="exp-col-title">Experience</h3>
            <div className="exp-timeline">
              {workItems.map((item, i) => (
                <Card
                  item={item}
                  index={i}
                  key={`${item.company}-${item.role}`}
                />
              ))}
            </div>
          </div>

          {/* Education column */}
          <div className="exp-col reveal reveal-up" style={{ "--reveal-i": 1 }}>
            <h3 className="exp-col-title">Education</h3>
            <div className="exp-timeline">
              {eduItems.map((item, i) => (
                <Card
                  item={item}
                  index={i + workItems.length}
                  key={`${item.company}-${item.role}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
