import { useRef } from "react";
import { contact } from "../data/home.js";
import { useLanguage } from "../i18n/useLanguage.js";
import useImageDepth from "../hooks/useImageDepth.js";
import "./ProjectCTA.css";

const ProjectCTA = () => {
  const { t } = useLanguage();
  const sectionRef = useRef(null);
  useImageDepth(sectionRef);

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
        <a className="project-cta-button" href={`mailto:${contact.email}`}>
          <span>{t("cta.action")}</span><span aria-hidden="true">↗</span>
        </a>
        <div className="project-cta-caption">
          <span>Hanmin Park / {t("hero.role")}</span>
          <span>{t("cta.caption")}</span>
        </div>
      </div>
    </section>
  );
};

export default ProjectCTA;
