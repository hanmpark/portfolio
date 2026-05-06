import { experiences } from "../data/home.js";
import { useLanguage } from "../i18n/useLanguage.js";
import useScrollReveal from "../hooks/useScrollReveal.js";
import "./Experience.css";

const extractYear = (period) => period?.match(/\d{4}/)?.[0] || "";

/* ── Entry row ───────────────────────────────────── */
const Entry = ({ item, index, l }) => (
  <article
    className="exp-entry reveal reveal-up"
    style={{ "--reveal-i": index }}
  >
    <span className="exp-entry-year" aria-hidden="true">
      {extractYear(item.period)}
    </span>
    <span className="exp-entry-accent" aria-hidden="true" />
    <div className="exp-entry-content">
      <div className="exp-entry-header">
        {item.image && (
          <figure
            className={`exp-logo${
              item.logoVariant ? ` exp-logo--${item.logoVariant}` : ""
            }`}
          >
            <img src={item.image} alt={item.imageAlt ?? ""} loading="lazy" />
          </figure>
        )}
        <div className="exp-entry-info">
          <h3 className="exp-entry-role">{l(item, "role")}</h3>
          <p className="exp-entry-company">
            {item.company}
            <span className="exp-entry-sep" aria-hidden="true">
              ·
            </span>
            <span className="exp-entry-period">{l(item, "period")}</span>
          </p>
        </div>
      </div>
      <p className="exp-entry-focus">{l(item, "focus")}</p>
      {item.stack?.length ? (
        <div className="exp-entry-tags">
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

/* ── Experience section ──────────────────────────── */
const Experience = () => {
  const { t, l } = useLanguage();
  const revealRef = useScrollReveal({
    threshold: 0.05,
    rootMargin: "0px 0px 100px 0px",
    selector: ".reveal",
  });

  const expItems = experiences.filter((i) => i.category === "Experience");
  const eduItems = experiences.filter((i) => i.category === "Education");

  const groups = [
    { label: t("experience.experienceCol"), items: expItems },
    { label: t("experience.educationCol"), items: eduItems },
  ];

  return (
    <section className="section exp-section" id="experience" ref={revealRef}>
      <div className="container exp-inner">
        <header className="exp-head">
          <p className="eyebrow reveal reveal-up">{t("experience.eyebrow")}</p>
          <h2 className="section-title reveal reveal-up">
            {t("experience.title")}
          </h2>
        </header>

        <div className="exp-groups">
          {groups.map((group) => (
            <div className="exp-group" key={group.label}>
              <div className="exp-group-header reveal reveal-up">
                <span className="exp-group-label">{group.label}</span>
                <span className="exp-group-rule" aria-hidden="true" />
              </div>
              <div className="exp-entries">
                {group.items.map((item, i) => (
                  <Entry
                    key={`${item.company}-${item.role}`}
                    item={item}
                    index={i}
                    l={l}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
