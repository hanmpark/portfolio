import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { projects } from "../data/home.js";
import { useLanguage } from "../i18n/useLanguage.js";
import useImageDepth from "../hooks/useImageDepth.js";
import "./Work.css";

const clamp = (value, min = 0, max = 1) => Math.min(Math.max(value, min), max);

const Work = () => {
  const { t, l } = useLanguage();
  const sectionRef = useRef(null);
  useImageDepth(sectionRef);
  const title = t("work.title");

  useEffect(() => {
    const section = sectionRef.current;
    const opening = section.querySelector(".work-opening");
    const openingFrame = section.querySelector(".work-opening-frame");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;

    const update = () => {
      frame = 0;
      const rect = opening.getBoundingClientRect();
      const frameHeight = openingFrame.getBoundingClientRect().height;
      const hold = frameHeight * 0.12;
      const travel = Math.max(rect.height - frameHeight - hold, 1);
      const progress = reducedMotion.matches ? 0 : clamp((-rect.top - hold) / travel);
      const eased = progress * progress * (3 - 2 * progress);
      // Keep only the opening in view; the project list stays in normal flow.
      const frameOffset = reducedMotion.matches ? 0 : clamp(-rect.top, 0, Math.max(rect.height - frameHeight, 0));
      section.style.setProperty("--work-opening-y", `${frameOffset.toFixed(2)}px`);
      section.style.setProperty("--work-split-x", `${(eased * 65).toFixed(3)}vw`);
      section.style.setProperty("--work-split-opacity", String(1 - clamp((progress - 0.65) / 0.35)));

    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    const resizeObserver = new ResizeObserver(schedule);
    resizeObserver.observe(section);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    reducedMotion.addEventListener("change", schedule);
    update();

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      reducedMotion.removeEventListener("change", schedule);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section className="work-section" id="work" ref={sectionRef} aria-labelledby="work-title">
      <header className="work-opening">
        <div className="work-opening-frame">
          <h2 className="work-split-title" id="work-title" aria-label={title}>
            <span className="work-split-word work-split-word--left" aria-hidden="true">{title.slice(0, 3)}</span>
            <span className="work-split-word work-split-word--right" aria-hidden="true">{title.slice(3)}</span>
          </h2>
          <p className="work-opening-caption">{t("work.eyebrow")} <span aria-hidden="true">↓</span></p>
        </div>
      </header>
      <div className="container work-inner">
        <aside className="work-label">
          <p className="eyebrow">{t("work.eyebrow")}</p>
          <p className="work-intro">{t("work.intro")}</p>
        </aside>

        <div className="work-project-list">
          {projects.map((project, index) => (
            <Link
              className={`work-project-card work-project-card--${project.slug}`}
              to={`/project/${project.slug}`}
              key={project.slug}
              aria-label={`${t("work.viewProject")} : ${project.title}`}
            >
              <div
                className="work-project-visual"
                data-image-depth="project"
                data-depth-travel={project.slug === "compass" || project.slug === "scholarship-logtime" ? "0.05" : undefined}
                aria-hidden="true"
              >
                <div className="work-project-media">
                  <img
                    className="work-project-visual-image"
                    src={project.previewImage}
                    alt=""
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>
              <div className="work-project-copy">
                <div className="work-project-meta">
                  <span className="work-project-index" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                  <span>{t(project.featured ? "work.featured" : "work.caseStudy")}</span>
                </div>
                <div className="work-project-heading">
                  <h3>{project.title}</h3>
                  <p>{l(project, "subtitle")}</p>
                </div>
                <p className="work-project-description">{l(project, "description")}</p>
                <div className="work-project-footer">
                  <div className="work-project-tags">
                    {project.tags.map((tag) => <span key={tag}>{tag}</span>)}
                  </div>
                  <span className="work-project-action">
                    <span>{t("work.viewProject")}</span>
                    <span className="work-project-arrow" aria-hidden="true">↗</span>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Work;
