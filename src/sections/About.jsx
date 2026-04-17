import { useLanguage } from "../i18n/useLanguage.js";
import useScrollReveal from "../hooks/useScrollReveal.js";
import "./About.css";

const highlightKeys = [
  { key: "systems" },
  { key: "fullStack" },
  { key: "graphics" },
  { key: "aiTooling" },
];

const About = () => {
  const { t } = useLanguage();
  const revealRef = useScrollReveal({
    threshold: 0.05,
    rootMargin: "0px 0px 100px 0px",
  });
  const paragraphs = t("about.paragraphs");

  return (
    <section className="section abt-section" id="about" ref={revealRef}>
      <div className="container abt-inner">
        <div className="abt-content">
          <p className="eyebrow reveal reveal-up">{t("about.eyebrow")}</p>
          <h2 className="section-title abt-title reveal reveal-up">
            {t("about.title")}
          </h2>

          <div
            className="abt-prose reveal reveal-up"
            style={{ "--reveal-i": 1 }}
          >
            {Array.isArray(paragraphs) &&
              paragraphs.map((p, i) => <p key={i}>{p}</p>)}
          </div>

          <dl
            className="abt-creds reveal reveal-up"
            style={{ "--reveal-i": 2 }}
          >
            <div className="abt-cred">
              <dt>42 Nice</dt>
              <dd>Engineering · 2022</dd>
            </div>
            <div className="abt-cred-sep" aria-hidden="true" />
            <div className="abt-cred">
              <dt>Amadeus</dt>
              <dd>Apprentice · 2025</dd>
            </div>
            <div className="abt-cred-sep" aria-hidden="true" />
            <div className="abt-cred">
              <dt>Sorbonne</dt>
              <dd>Cinema · 2019</dd>
            </div>
          </dl>

          <div
            className="abt-highlights reveal reveal-up"
            style={{ "--reveal-i": 3 }}
          >
            {highlightKeys.map((h) => (
              <span className="abt-chip" key={h.key}>
                {t(`about.highlights.${h.key}`)}
              </span>
            ))}
          </div>
        </div>

        <figure
          className="abt-portrait reveal reveal-up"
          style={{ "--reveal-i": 4 }}
        >
          <div className="abt-portrait-glow" aria-hidden="true" />
          <img src="/assets/self_image.jpg" alt="Hanmin Park" loading="lazy" />
        </figure>
      </div>
    </section>
  );
};

export default About;
