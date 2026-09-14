import { useEffect, useState } from "react";
import { experiences } from "../data/home.js";
import { useLanguage } from "../i18n/useLanguage.js";
import useScrollReveal from "../hooks/useScrollReveal.js";
import "./Experience.css";

const extractYear = (period) => period?.match(/\d{4}/)?.[0] ?? "";
const journey = [...experiences].sort(
  (a, b) => Number(extractYear(b.period)) - Number(extractYear(a.period)),
);

const Experience = () => {
  const { t, l, lang } = useLanguage();
  const [compact, setCompact] = useState(() => window.matchMedia("(max-width: 720px)").matches);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const revealRef = useScrollReveal({ threshold: 0.03, rootMargin: "0px 0px 80px 0px", selector: ".reveal" });
  const categoryLabel = (item) => item.category === "Experience" ? t("experience.experienceCol") : t("experience.educationCol");

  useEffect(() => {
    const media = window.matchMedia("(max-width: 720px)");
    const update = () => setCompact(media.matches);
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const section = revealRef.current;
    if (!section) return undefined;

    const rows = [...section.querySelectorAll(".exp-row")];
    if (compact) {
      rows.forEach((row) => row.classList.remove("is-active"));
      return undefined;
    }
    let frame = 0;
    let activeIndex = -1;

    const render = () => {
      frame = 0;
      const viewportHeight = Math.max(window.innerHeight, 1);
      const activationLine = viewportHeight * 0.52;
      let nextIndex = 0;
      let closestDistance = Number.POSITIVE_INFINITY;

      rows.forEach((row, index) => {
        const rect = row.getBoundingClientRect();
        const distance = Math.abs(rect.top + rect.height / 2 - activationLine);
        if (distance < closestDistance) {
          closestDistance = distance;
          nextIndex = index;
        }
      });

      if (nextIndex !== activeIndex) {
        activeIndex = nextIndex;
        rows.forEach((row, index) => row.classList.toggle("is-active", index === nextIndex));
      }
    };

    const requestRender = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(render);
    };

    render();
    window.addEventListener("scroll", requestRender, { passive: true });
    window.addEventListener("resize", requestRender);

    return () => {
      window.removeEventListener("scroll", requestRender);
      window.removeEventListener("resize", requestRender);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [revealRef, compact]);

  return (
    <section className="section exp-section" id="experience" ref={revealRef}>
      <div className="container exp-layout">
        <header className="section-head exp-head">
          <p className="eyebrow reveal reveal-up">{t("experience.eyebrow")}</p>
          <h2 className="section-title reveal reveal-up">{t("experience.title")}</h2>
        </header>

        <div className="exp-list reveal-stagger" aria-label={t("experience.timelineLabel")}>
          {journey.map((item, index) => (
            <article className="exp-row reveal reveal-up" key={`${item.company}-${item.period}`}>
              <div className="exp-date">
                <time dateTime={extractYear(item.period)}>{extractYear(item.period)}</time>
                <small>{l(item, "period")}</small>
                {compact ? <span className="exp-date-category">{categoryLabel(item)}</span> : null}
              </div>
              <span className="exp-node" aria-hidden="true" />
              <div className="exp-content">
                <div className="exp-role">
                  <span className="exp-category">{categoryLabel(item)}</span>
                  <h3 lang={lang}>
                    {compact ? (
                      <button
                        className="exp-toggle"
                        type="button"
                        aria-expanded={expandedIndex === index}
                        aria-controls={`experience-details-${index}`}
                        onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                      >
                        <span>{l(item, "role")}</span>
                        <span className="exp-toggle-icon" aria-hidden="true" />
                      </button>
                    ) : l(item, "role")}
                  </h3>
                  <p>{item.company}</p>
                </div>
                <div
                  className="exp-summary"
                  id={`experience-details-${index}`}
                  hidden={compact && expandedIndex !== index}
                >
                  <p>{l(item, "summary")}</p>
                  <div>{item.stack?.map((tag) => <span key={tag}>{tag}</span>)}</div>
                </div>
              </div>
              {item.image ? <figure className="exp-mark"><img src={item.image} alt={item.imageAlt ?? ""} loading="lazy" /></figure> : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
