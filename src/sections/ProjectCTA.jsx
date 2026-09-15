import { useRef } from "react";
import { useLanguage } from "../i18n/useLanguage.js";
import useImageDepth from "../hooks/useImageDepth.js";
import ArrowUpRight from "../components/ArrowUpRight.jsx";
import "./ProjectCTA.css";

const ProjectCTA = () => {
  const { t } = useLanguage();
  const sectionRef = useRef(null);
  useImageDepth(sectionRef, { pointer: false });

  return (
    <section className="project-cta" id="contact" ref={sectionRef} data-image-depth="full" aria-labelledby="project-cta-title">
      <img className="project-cta-photo" src="/assets/photo.webp" alt="" loading="lazy" decoding="async" />
      <div className="container project-cta-inner">
        <p className="project-cta-eyebrow">{t("cta.eyebrow")}</p>
        <h2 className="project-cta-title" id="project-cta-title" aria-label={t("cta.title")}>
          <span aria-hidden="true">{t("cta.lineOne")}</span>
          <span aria-hidden="true">{t("cta.lineTwo")}</span>
          <span aria-hidden="true">{t("cta.lineThree")}</span>
          <span aria-hidden="true"><i>→</i> {t("cta.lineFour")}</span>
        </h2>
        <a className="project-cta-button" href="https://calendly.com/hanmin-hpark/one-on-one" target="_blank" rel="noopener noreferrer">
          <span>{t("cta.action")}</span><ArrowUpRight className="project-cta-arrow" />
        </a>
        <div className="project-cta-caption">
          <span>Hanmin Park / {t("hero.role")}</span>
        </div>
      </div>
    </section>
  );
};

export default ProjectCTA;
