import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { projects } from "../data/home.js";
import { useLanguage } from "../i18n/useLanguage.js";
import useScrollReveal from "../hooks/useScrollReveal.js";
import "./Work.css";

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const viewportHeightSum = (count) =>
  `calc(${Array.from(
    { length: count },
    () => "var(--app-viewport-height)",
  ).join(" + ")})`;

const cardIndexLabel = (index) => String(index + 1).padStart(2, "0");

const Work = () => {
  const { t, l } = useLanguage();
  const sectionRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [pinState, setPinState] = useState("before");
  const [viewport, setViewport] = useState({ width: 1280, height: 800 });
  const headRef = useScrollReveal({
    threshold: 0.05,
    rootMargin: "0px 0px 100px 0px",
    selector: ".reveal",
  });

  const scrollHeight = useMemo(
    () => viewportHeightSum(projects.length + 1),
    [],
  );
  const projectProgress = progress * Math.max(projects.length - 1, 1);
  const activeIndex = clamp(
    Math.round(projectProgress),
    0,
    projects.length - 1,
  );

  useEffect(() => {
    let frame = 0;

    const updateViewport = () => {
      setViewport({
        width: window.innerWidth || document.documentElement.clientWidth || 1280,
        height:
          window.innerHeight || document.documentElement.clientHeight || 800,
      });
    };

    const updateProgress = () => {
      frame = 0;
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const viewHeight =
        window.innerHeight || document.documentElement.clientHeight || 1;
      const travel = Math.max(rect.height - viewHeight, 1);
      const nextProgress = clamp(-rect.top / travel, 0, 1);
      const nextPinState =
        rect.top > 0 ? "before" : rect.bottom < viewHeight ? "after" : "pinned";

      setProgress((current) =>
        Math.abs(current - nextProgress) < 0.001 ? current : nextProgress,
      );
      setPinState((current) =>
        current === nextPinState ? current : nextPinState,
      );
    };

    const requestProgress = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updateProgress);
    };

    const handleResize = () => {
      updateViewport();
      requestProgress();
    };

    updateViewport();
    updateProgress();

    window.addEventListener("scroll", requestProgress, { passive: true });
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", requestProgress);
      window.removeEventListener("resize", handleResize);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  const getCardStyle = useCallback(
    (index) => {
      const offset = index - projectProgress;
      const distance = Math.min(Math.abs(offset), 2);
      const isNarrow = viewport.width <= 720;
      const isMedium = viewport.width <= 920;
      const spacing = isNarrow
        ? clamp(viewport.height * 0.31, 180, 260)
        : isMedium
          ? clamp(viewport.height * 0.34, 205, 300)
          : clamp(viewport.height * 0.36, 210, 330);
      const translateY = offset * spacing;
      const scale = 1 - Math.min(distance, 1.7) * (isNarrow ? 0.05 : 0.065);
      const opacity =
        distance > 1.75 ? 0 : clamp(1 - distance * 0.32, 0.24, 1);
      const dim = clamp(distance / 1.6, 0, 1);

      return {
        "--card-depth": dim.toFixed(3),
        opacity,
        transform: `translate3d(0, calc(-50% + ${translateY.toFixed(
          2,
        )}px), 0) scale(${scale.toFixed(4)})`,
        zIndex: Math.round(100 - distance * 20),
        pointerEvents: distance < 0.55 ? "auto" : "none",
      };
    },
    [projectProgress, viewport.height, viewport.width],
  );

  return (
    <section
      className={`section work-section work-section--${pinState}`}
      id="work"
      ref={sectionRef}
      style={{ "--work-scroll-height": scrollHeight }}
    >
      <div className="work-pin" ref={headRef}>
        <div className="container work-inner">
          <header className="work-head">
            <p className="eyebrow reveal reveal-up">{t("work.eyebrow")}</p>
            <h2 className="section-title reveal reveal-up">
              {t("work.title")}
            </h2>
            <div className="work-counter reveal reveal-up" aria-hidden="true">
              <span>{cardIndexLabel(activeIndex)}</span>
              <span>/</span>
              <span>{cardIndexLabel(projects.length - 1)}</span>
            </div>
            <div className="work-rail" aria-hidden="true">
              {projects.map((project, index) => (
                <span
                  className={
                    index === activeIndex
                      ? "work-rail-dot is-active"
                      : "work-rail-dot"
                  }
                  key={project.title}
                />
              ))}
            </div>
          </header>

          <div className="work-stage">
            <div className="work-card-stack">
              {projects.map((project, index) => {
                const isInternal = Boolean(project.slug);
                const isActive = index === activeIndex;
                const CardLink = isInternal ? Link : "a";
                const linkProps = isInternal
                  ? { to: `/project/${project.slug}` }
                  : {
                      href: project.links?.repo,
                      target: "_blank",
                      rel: "noopener noreferrer",
                    };

                return (
                  <article
                    className={
                      isActive ? "work-card is-active" : "work-card"
                    }
                    style={getCardStyle(index)}
                    aria-hidden={!isActive}
                    key={project.title}
                  >
                    <CardLink
                      className="work-card-shell"
                      aria-label={
                        isInternal
                          ? `View ${project.title} project`
                          : `Open GitHub repository for ${project.title}`
                      }
                      tabIndex={isActive ? 0 : -1}
                      {...linkProps}
                    >
                      <div className="work-card-media" aria-hidden="true">
                        <img
                          src={project.previewImage}
                          alt=""
                          decoding="async"
                          loading={index === 0 ? "eager" : "lazy"}
                        />
                        <span className="work-card-index">
                          {cardIndexLabel(index)}
                        </span>
                      </div>

                      <div className="work-card-content">
                        <div>
                          <h3 className="work-card-title">{project.title}</h3>
                          <p className="work-card-subtitle">
                            {l(project, "subtitle")}
                          </p>
                        </div>
                        <p className="work-card-description">
                          {l(project, "description")}
                        </p>

                        {project.tags?.length ? (
                          <div className="work-card-tags">
                            {project.tags.map((tag) => (
                              <span className="pill" key={tag}>
                                {tag}
                              </span>
                            ))}
                          </div>
                        ) : null}

                        <div className="work-card-actions">
                          <span
                            className="work-card-primary"
                          >
                            {isInternal
                              ? t("work.viewProject")
                              : t("work.openRepo")}
                            <svg
                              className="work-card-arrow"
                              width="16"
                              height="16"
                              viewBox="0 0 16 16"
                              fill="none"
                              aria-hidden="true"
                            >
                              <path
                                d="M3 8h10M9 4l4 4-4 4"
                                stroke="currentColor"
                                strokeWidth="1.2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </span>
                        </div>
                      </div>
                    </CardLink>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Work;
