import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { projects } from "../data/home.js";
import { useLanguage } from "../i18n/useLanguage.js";
import useScrollReveal from "../hooks/useScrollReveal.js";
import "./Work.css";

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const viewportHeightSum = (count) =>
  `calc(${Array.from(
    { length: count },
    () => "var(--work-viewport-height, var(--app-viewport-height))",
  ).join(" + ")})`;

const cardIndexLabel = (index) => String(index + 1).padStart(2, "0");

const getCardMotion = (index, projectProgress, viewport) => {
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
  const scale = isNarrow
    ? 1
    : 1 - Math.min(distance, 1.7) * 0.065;
  const opacity = distance > 1.75 ? 0 : clamp(1 - distance * 0.32, 0.24, 1);
  const depth = clamp(distance / 1.6, 0, 1);

  return {
    depth,
    opacity,
    transform: `translate3d(0, calc(-50% + ${translateY.toFixed(
      2,
    )}px), 0) scale(${scale.toFixed(4)})`,
    zIndex: Math.round(100 - distance * 20),
    pointerEvents: distance < 0.55 ? "auto" : "none",
  };
};

const Work = () => {
  const { t, l } = useLanguage();
  const sectionRef = useRef(null);
  const stackRef = useRef(null);
  const cardRefs = useRef([]);
  const activeIndexRef = useRef(0);
  const progressRef = useRef(-1);
  const pinStateRef = useRef("before");
  const mobileShowcaseRef = useRef(false);
  const viewportRef = useRef({ width: 1280, height: 800 });
  const [pinState, setPinState] = useState("before");
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobileShowcase, setIsMobileShowcase] = useState(false);
  const headRef = useScrollReveal({
    threshold: 0.05,
    rootMargin: "0px 0px 100px 0px",
    selector: ".reveal",
  });

  const scrollHeight = useMemo(
    () => viewportHeightSum(projects.length + 1),
    [],
  );

  useEffect(() => {
    let frame = 0;
    let lockedMobileHeight = 0;

    const updateViewport = () => {
      const width =
        window.innerWidth || document.documentElement.clientWidth || 1280;
      const measuredHeight = Math.max(
        window.innerHeight || 0,
        document.documentElement.clientHeight || 0,
        window.visualViewport?.height || 0,
        1,
      );
      const isMobile = width <= 720;
      const previous = viewportRef.current;
      const widthChanged = Math.abs(width - previous.width) > 24;
      const height =
        isMobile && !widthChanged
          ? lockedMobileHeight || measuredHeight
          : measuredHeight;

      if (isMobile) lockedMobileHeight = height;
      else lockedMobileHeight = 0;

      viewportRef.current = { width, height };

      if (mobileShowcaseRef.current !== isMobile) {
        mobileShowcaseRef.current = isMobile;
        progressRef.current = -1;
        setIsMobileShowcase(isMobile);

        cardRefs.current.forEach((card) => {
          if (!card) return;
          card.style.removeProperty("--card-depth");
          card.style.opacity = "";
          card.style.transform = "";
          card.style.zIndex = "";
          card.style.pointerEvents = "";
        });
      }

      sectionRef.current?.style.setProperty(
        "--work-viewport-height",
        `${height}px`,
      );
    };

    const updateMobileShowcase = () => {
      const stack = stackRef.current;
      if (!stack) return;

      const center = stack.scrollLeft + stack.clientWidth / 2;
      let nextActiveIndex = activeIndexRef.current;
      let closestDistance = Number.POSITIVE_INFINITY;

      cardRefs.current.forEach((card, index) => {
        if (!card) return;
        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        const distance = Math.abs(cardCenter - center);

        if (distance < closestDistance) {
          closestDistance = distance;
          nextActiveIndex = index;
        }
      });

      if (activeIndexRef.current !== nextActiveIndex) {
        activeIndexRef.current = nextActiveIndex;
        setActiveIndex(nextActiveIndex);
      }
    };

    const applyCardMotion = (nextProgress) => {
      const projectProgress = nextProgress * Math.max(projects.length - 1, 1);
      const viewport = viewportRef.current;
      const nextActiveIndex = clamp(
        Math.round(projectProgress),
        0,
        projects.length - 1,
      );

      cardRefs.current.forEach((card, index) => {
        if (!card) return;
        const motion = getCardMotion(index, projectProgress, viewport);
        card.style.setProperty("--card-depth", motion.depth.toFixed(3));
        card.style.opacity = motion.opacity.toFixed(3);
        card.style.transform = motion.transform;
        card.style.zIndex = `${motion.zIndex}`;
        card.style.pointerEvents = index === nextActiveIndex ? "auto" : "none";
      });

      if (activeIndexRef.current !== nextActiveIndex) {
        activeIndexRef.current = nextActiveIndex;
        setActiveIndex(nextActiveIndex);
      }
    };

    const updateProgress = () => {
      frame = 0;
      const section = sectionRef.current;
      if (!section) return;

      if (mobileShowcaseRef.current) {
        updateMobileShowcase();

        if (pinStateRef.current !== "before") {
          pinStateRef.current = "before";
          setPinState("before");
        }

        return;
      }

      const rect = section.getBoundingClientRect();
      const viewHeight = viewportRef.current.height || 1;
      const travel = Math.max(rect.height - viewHeight, 1);
      const nextProgress = clamp(-rect.top / travel, 0, 1);
      const nextPinState =
        rect.top > 0 ? "before" : rect.bottom < viewHeight ? "after" : "pinned";

      const minProgressDelta =
        viewportRef.current.width <= 720 ? 0.0018 : 0.0005;

      if (Math.abs(progressRef.current - nextProgress) > minProgressDelta) {
        progressRef.current = nextProgress;
        applyCardMotion(nextProgress);
      }

      if (pinStateRef.current !== nextPinState) {
        pinStateRef.current = nextPinState;
        setPinState(nextPinState);
      }
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

    const stack = stackRef.current;

    window.addEventListener("scroll", requestProgress, { passive: true });
    stack?.addEventListener("scroll", requestProgress, { passive: true });
    window.addEventListener("resize", handleResize);
    window.visualViewport?.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", requestProgress);
      stack?.removeEventListener("scroll", requestProgress);
      window.removeEventListener("resize", handleResize);
      window.visualViewport?.removeEventListener("resize", handleResize);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section
      className={`section work-section work-section--${pinState}${
        isMobileShowcase ? " work-section--mobile-showcase" : ""
      }`}
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
            <div className="work-card-stack" ref={stackRef}>
              {projects.map((project, index) => {
                const isInternal = Boolean(project.slug);
                const isActive = index === activeIndex;
                const isAccessible = isMobileShowcase || isActive;
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
                    ref={(element) => {
                      cardRefs.current[index] = element;
                    }}
                    aria-hidden={!isAccessible}
                    aria-current={isActive ? "true" : undefined}
                    key={project.title}
                  >
                    <CardLink
                      className="work-card-shell"
                      aria-label={
                        isInternal
                          ? `View ${project.title} project`
                          : `Open GitHub repository for ${project.title}`
                      }
                      tabIndex={isAccessible ? 0 : -1}
                      {...linkProps}
                    >
                      <div className="work-card-media" aria-hidden="true">
                        <img
                          src={project.previewImage}
                          alt=""
                          decoding="async"
                          loading="eager"
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
