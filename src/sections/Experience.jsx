import { useState } from "react";
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
  const item = journey[selected];
  const category = item.category === "Experience" ? t("experience.experienceCol") : t("experience.educationCol");

  return (
    <section className="exp-section" id="experience" aria-labelledby="experience-title">
      <div className="exp-layout">
        <header className="exp-head">
          <p className="eyebrow">{t("experience.eyebrow")}</p>
          <h2 id="experience-title"><span>{t("experience.title")}</span></h2>
        </header>
        <div className="exp-browser">
          <div className="exp-list" role="group" aria-label={t("experience.timelineLabel")}>
            {journey.map((entry, index) => (
              <button className={`exp-choice${selected === index ? " is-selected" : ""}`}
                key={`${entry.company}-${entry.period}`} type="button"
                aria-pressed={selected === index} aria-controls="experience-detail"
                onPointerEnter={(event) => {
                  if (event.pointerType === "mouse") setSelected(index);
                }}
                onFocus={() => setSelected(index)}
                onClick={() => setSelected(index)}>
                <time dateTime={extractYear(entry.period)}>{extractYear(entry.period)}</time>
                <span>{entry.company}<small>{l(entry, "role")}</small></span>
                <span className="exp-choice-arrow" aria-hidden="true">→</span>
              </button>
            ))}
          </div>
          <article className="exp-detail" id="experience-detail" aria-live="polite" aria-atomic="true">
            <div className="exp-detail-inner" key={selected}>
              <div className="exp-detail-top">
                <div className="exp-detail-meta">
                  <span>{category}</span>
                  <p className="exp-period">{l(item, "period")}</p>
                </div>
                {item.image && <figure className="exp-mark"><img src={item.image} alt={item.imageAlt ?? item.company} /></figure>}
              </div>
              <h3 lang={lang}>{l(item, "role")}</h3>
              <p className="exp-company">{item.company}</p>
              <p className="exp-summary">{l(item, "summary")}</p>
              <div className="exp-stack">{item.stack?.map(tag => <span key={tag}>{tag}</span>)}</div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
};

export default Experience;
