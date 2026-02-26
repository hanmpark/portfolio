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
  const revealRef = useScrollReveal({ threshold: 0.1, selector: ".reveal" });

  return (
    <section className="section exp-section" id="experience" ref={revealRef}>
      {/* Noise texture */}
      <div className="noise-overlay" aria-hidden="true" />

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
