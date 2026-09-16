import { useLayoutEffect, useRef, useState } from "react";
import { experiences } from "../data/home.js";
import { useLanguage } from "../i18n/useLanguage.js";
import "./Experience.css";

const extractYear = (period) => period?.match(/\d{4}/)?.[0] ?? "";
const journey = [...experiences].sort(
  (a, b) => Number(extractYear(b.period)) - Number(extractYear(a.period)),
);

const Experience = () => {
  const { t, l, lang } = useLanguage();
  const [selected, setSelected] = useState(0);
  const browserRef = useRef(null);
  const lastPointer = useRef({ x: null, y: null });
  const item = journey[selected];

  useLayoutEffect(() => {
    const browser = browserRef.current;
    const entries = [...browser.querySelectorAll(".exp-entry")];
    const identity = browser.querySelector(".exp-identity");
    const headings = entries.map(entry => entry.querySelector(".exp-entry-heading"));
    const details = entries.map(entry => entry.querySelector(".exp-detail"));

    const updateLayout = () => {
      const headingHeights = headings.map(heading => heading.getBoundingClientRect().height);
      // The inner content keeps its natural size even when its accordion is closed.
      const detailHeights = details.map(detail => detail.getBoundingClientRect().height);
      const borders = entries.map(entry => {
        const style = getComputedStyle(entry);
        return parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth);
      });
      const identityHeight = identity.getBoundingClientRect().height;
      const height = Math.ceil(Math.max(identityHeight,
        headingHeights.reduce((sum, value, index) => sum + value + borders[index], 0)
          + Math.max(...detailHeights)));
      // Position relative to the selected row's final layout, independent of scroll.
      const rowTop = headingHeights.slice(0, selected)
        .reduce((sum, value, index) => sum + value + borders[index], 0);
      const center = rowTop + (headingHeights[selected] + detailHeights[selected]) / 2;
      const offset = Math.max(0, Math.min(center - identityHeight / 2, height - identityHeight));
      browser.style.setProperty("--exp-browser-height", `${height}px`);
      browser.style.setProperty("--exp-logo-y", `${offset}px`);
    };

    updateLayout();
    const observer = new ResizeObserver(updateLayout);
    [...headings, ...details, identity].forEach(element => observer.observe(element));
    return () => observer.disconnect();
  }, [selected, lang]);

  const openOnHover = (event, index) => {
    if (event.pointerType !== "mouse") return;
    // Expanding a row can move another beneath a stationary pointer.
    // Only an actual pointer movement should change the active experience.
    if (event.clientX === lastPointer.current.x && event.clientY === lastPointer.current.y) return;
    lastPointer.current = { x: event.clientX, y: event.clientY };
    setSelected(index);
  };

  return (
    <section className="exp-section" id="experience" aria-labelledby="experience-title">
      <div className="exp-layout">
        <header className="exp-head">
          <p className="eyebrow">{t("experience.eyebrow")}</p>
          <h2 id="experience-title">{t("experience.title")}</h2>
        </header>
        <div className="exp-browser" ref={browserRef}>
          <div className="exp-list" role="group" aria-label={t("experience.timelineLabel")}>
            {journey.map((entry, index) => {
              const active = selected === index;
              const category = entry.category === "Experience" ? t("experience.experienceCol") : t("experience.educationCol");
              return (
                <article className={`exp-entry${active ? " is-selected" : ""}`} key={`${entry.company}-${entry.period}`}
                  onPointerMove={(event) => openOnHover(event, index)}>
                  <h3 className="exp-entry-heading">
                    <button className="exp-choice" type="button" id={`experience-trigger-${index}`}
                      aria-expanded={active} aria-controls={`experience-details-${index}`}
                      onFocus={() => setSelected(index)} onClick={() => setSelected(index)}>
                      <time dateTime={extractYear(entry.period)}>{extractYear(entry.period)}</time>
                      <span className="exp-company">{entry.company}</span>
                      <span className="exp-choice-icon" aria-hidden="true" />
                    </button>
                  </h3>
                  <div className="exp-expansion" id={`experience-details-${index}`} role="region"
                    aria-labelledby={`experience-trigger-${index}`} aria-hidden={!active} inert={!active ? "" : undefined}>
                    <div className="exp-expansion-clip">
                      <div className="exp-detail">
                        {entry.image && <img className="exp-inline-logo" src={entry.image} alt="" decoding="async" />}
                        <p className="exp-period">{category} <span aria-hidden="true">/</span> {l(entry, "period")}</p>
                        <p className="exp-role" lang={lang}>{l(entry, "role")}</p>
                        <p className="exp-summary">{l(entry, "summary")}</p>
                        <div className="exp-stack">{entry.stack?.map(tag => <span key={tag}>{tag}</span>)}</div>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
          <figure className="exp-identity" aria-hidden="true">
            <div className="exp-logo-stage">
              {journey.map((entry, index) => entry.image && (
                <img className={selected === index ? "is-active" : ""} src={entry.image} alt="" decoding="async" key={entry.company} />
              ))}
            </div>
            <figcaption><span>{item.company}</span></figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
};

export default Experience;
