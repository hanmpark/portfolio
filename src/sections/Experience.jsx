import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { experiences } from "../data/home.js";
import { useLanguage } from "../i18n/useLanguage.js";
import useScrollReveal from "../hooks/useScrollReveal.js";
import "./Experience.css";

const extractYear = (period) => Number(period?.match(/\d{4}/)?.[0] || 0);

const journey = [...experiences].sort(
  (first, second) => extractYear(first.period) - extractYear(second.period),
);

const DetailContent = ({ item, category, t, l }) => (
  <div className="exp-detail-main">
    <div className="exp-detail-heading">
      {item.image && (
        <figure
          className={`exp-logo${
            item.logoVariant ? ` exp-logo--${item.logoVariant}` : ""
          }`}
        >
          <img
            src={item.image}
            alt={item.imageAlt ?? ""}
            decoding="async"
          />
        </figure>
      )}

      <div>
        <p className="exp-detail-kicker">
          {category} · {l(item, "period")}
        </p>
        <h3 className="exp-detail-role">{l(item, "role")}</h3>
        <p className="exp-detail-company">{item.company}</p>
      </div>
    </div>

    <p className="exp-detail-summary">{l(item, "summary")}</p>

    {item.stack?.length ? (
      <div className="exp-detail-tags" aria-label={t("experience.themes")}>
        {item.stack.map((tag) => (
          <span className="pill" key={tag}>
            {tag}
          </span>
        ))}
      </div>
    ) : null}
  </div>
);

const Experience = () => {
  const { t, l } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);
  const [mobileActiveIndex, setMobileActiveIndex] = useState(-1);
  const journeyRef = useRef(null);
  const detailRef = useRef(null);
  const mobileActiveIndexRef = useRef(-1);
  const revealRef = useScrollReveal({
    threshold: 0.05,
    rootMargin: "0px 0px 100px 0px",
    selector: ".reveal",
  });

  const activeItem = journey[activeIndex];

  const categoryLabel = (item) =>
    item.category === "Experience"
      ? t("experience.experienceCol")
      : t("experience.educationCol");

  const selectStep = useCallback((index) => {
    setActiveIndex(index);
    journeyRef.current?.style.setProperty(
      "--route-progress",
      `${(index / (journey.length - 1)) * 100}%`,
    );
  }, []);

  useEffect(() => {
    const panel = journeyRef.current;
    const route = panel?.querySelector(".exp-route");
    const detail = detailRef.current;
    if (!panel || !route || !detail) return undefined;

    let animationFrame = 0;

    const updateFromScroll = () => {
      animationFrame = 0;
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      const isCompact = window.matchMedia("(max-width: 760px)").matches;
      const rect = route.getBoundingClientRect();
      const stickyTop = Math.max(72, window.innerHeight * 0.08);
      const start = window.innerHeight * (isCompact ? 0.78 : 0.24);
      const end = isCompact
        ? window.innerHeight * 0.32
        : Math.min(window.innerHeight * 0.94, detail.offsetHeight + stickyTop);
      const travel = Math.max(1, rect.height + start - end);
      const progress = (start - rect.top) / travel;

      const clampedProgress = Math.min(1, Math.max(0, progress));
      let nextIndex;

      if (isCompact) {
        const activationLine = window.innerHeight * 0.5;
        const stops = Array.from(panel.querySelectorAll(".exp-stop"));
        nextIndex = 0;

        stops.forEach((stop, index) => {
          const stopRect = stop.getBoundingClientRect();
          const stopCenter = stopRect.top + stopRect.height / 2;
          if (stopCenter <= activationLine) nextIndex = index;
        });

        if (mobileActiveIndexRef.current !== nextIndex) {
          mobileActiveIndexRef.current = nextIndex;
          setMobileActiveIndex(nextIndex);
        }
      } else {
        nextIndex = Math.min(
          journey.length - 1,
          Math.round(clampedProgress * (journey.length - 1)),
        );
        if (mobileActiveIndexRef.current !== -1) {
          mobileActiveIndexRef.current = -1;
          setMobileActiveIndex(-1);
        }
      }

      panel.style.setProperty(
        "--route-progress",
        `${clampedProgress * 100}%`,
      );

      if (isCompact || prefersReducedMotion) {
        detail.style.removeProperty("--detail-offset");
      } else {
        const detailTravel = Math.max(
          0,
          route.offsetHeight - detail.offsetHeight,
        );
        const centeredTop =
          window.innerHeight / 2 - detail.offsetHeight / 2;
        const centeredOffset = Math.min(
          detailTravel,
          Math.max(0, centeredTop - rect.top),
        );
        detail.style.setProperty(
          "--detail-offset",
          `${centeredOffset}px`,
        );
      }

      setActiveIndex((current) =>
        current === nextIndex ? current : nextIndex,
      );
    };

    const requestUpdate = () => {
      if (animationFrame) return;
      animationFrame = window.requestAnimationFrame(updateFromScroll);
    };

    updateFromScroll();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <section className="section exp-section" id="experience" ref={revealRef}>
      <div className="container exp-inner">
        <header className="exp-head">
          <p className="eyebrow reveal reveal-up">{t("experience.eyebrow")}</p>
          <h2 className="section-title reveal reveal-up">
            {t("experience.title")}
          </h2>
        </header>

        <div className="exp-scroll-stage">
          <div className="exp-journey reveal reveal-up" ref={journeyRef}>
            <div
              className="exp-route"
              aria-label={t("experience.timelineLabel")}
            >
              <div className="exp-route-line" aria-hidden="true">
                <span className="exp-route-progress" />
              </div>

              <div className="exp-stops" role="list">
                {journey.map((item, index) => {
                  const isActive = index === activeIndex;
                  const type =
                    item.category === "Experience" ? "work" : "study";

                  return (
                    <div
                      className={`exp-stop-wrap${
                        isActive ? " is-active" : ""
                      }`}
                      role="listitem"
                      key={item.company}
                    >
                      <button
                        type="button"
                        className={`exp-stop exp-stop--${type}${
                          isActive ? " is-active" : ""
                        }`}
                        aria-pressed={isActive}
                        aria-label={`${extractYear(item.period)}, ${item.company}, ${l(item, "role")}`}
                        onClick={() => selectStep(index)}
                        onFocus={() => selectStep(index)}
                      >
                        <span className="exp-stop-copy">
                          <span className="exp-stop-year">
                            {extractYear(item.period)}
                          </span>
                          <span className="exp-stop-company">
                            {item.company}
                          </span>
                          <span className="exp-stop-category">
                            {categoryLabel(item)}
                          </span>
                        </span>
                        <span className="exp-stop-marker" aria-hidden="true">
                          <span />
                        </span>
                      </button>

                      <article
                        className={`exp-mobile-detail${
                          index === mobileActiveIndex ? " is-visible" : ""
                        }`}
                        aria-hidden={index !== mobileActiveIndex}
                      >
                        <DetailContent
                          item={item}
                          category={categoryLabel(item)}
                          t={t}
                          l={l}
                        />
                      </article>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="exp-detail-track">
              <article
                className="exp-detail"
                aria-live="polite"
                ref={detailRef}
              >
                <div className="exp-detail-number" aria-hidden="true">
                  {String(activeIndex + 1).padStart(2, "0")}
                </div>

                <DetailContent
                  key={`${activeItem.company}-${activeIndex}`}
                  item={activeItem}
                  category={categoryLabel(activeItem)}
                  t={t}
                  l={l}
                />

              </article>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
