import { experiences } from "../data/home.js";
import { useLanguage } from "../i18n/useLanguage.js";
import useScrollReveal from "../hooks/useScrollReveal.js";
import "./Experience.css";

const workItems = experiences.filter((e) => e.category === "Experience");
const eduItems = experiences.filter((e) => e.category === "Education");

const Card = ({ item, index, l }) => (
  <article
    className="exp-card reveal reveal-up"
    style={{ "--reveal-i": index, "--card-i": index }}
  >
    <div className="exp-card-accent" aria-hidden="true" />
    <span className="exp-marker" aria-hidden="true">
      <span className="exp-marker-ping" />
    </span>
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
          <p className="exp-role">{l(item, "role")}</p>
          <p className="exp-company">{item.company}</p>
          {item.period ? (
            <p className="exp-period">{l(item, "period")}</p>
          ) : null}
        </div>
      </div>
      <p className="exp-summary">{l(item, "focus")}</p>
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
  const { t, l } = useLanguage();
  const revealRef = useScrollReveal({
    threshold: 0.05,
    rootMargin: "0px 0px 100px 0px",
    selector: ".reveal",
  });

  return (
    <section className="section exp-section" id="experience" ref={revealRef}>
      <div className="container exp-inner">
        <header className="exp-head">
          <p className="eyebrow reveal reveal-up">{t("experience.eyebrow")}</p>
          <h2 className="section-title reveal reveal-up">
            {t("experience.title")}
          </h2>
        </header>

        <div className="exp-columns reveal-stagger">
          {/* Experience column */}
          <div className="exp-col">
            <h3 className="exp-col-title reveal reveal-up">
              <span className="exp-col-icon">💼</span>
              {t("experience.experienceCol")}
            </h3>
            <div className="exp-timeline reveal-stagger">
              {workItems.map((item, i) => (
                <Card
                  item={item}
                  index={i}
                  l={l}
                  key={`${item.company}-${item.role}`}
                />
              ))}
            </div>
          </div>

          {/* Education column */}
          <div className="exp-col">
            <h3 className="exp-col-title reveal reveal-up">
              <span className="exp-col-icon">🎓</span>
              {t("experience.educationCol")}
            </h3>
            <div className="exp-timeline reveal-stagger">
              {eduItems.map((item, i) => (
                <Card
                  item={item}
                  index={i + workItems.length}
                  l={l}
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
