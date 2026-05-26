import { Link } from "react-router-dom";
import { projects } from "../data/home.js";
import { useLanguage } from "../i18n/useLanguage.js";
import useScrollReveal from "../hooks/useScrollReveal.js";
import "./Work.css";

const Work = () => {
  const { t, l } = useLanguage();
  const headRef = useScrollReveal({
    threshold: 0.05,
    rootMargin: "0px 0px 100px 0px",
    selector: ".reveal",
  });

  return (
    <section className="section work-section" id="work">
      <div className="container work-inner" ref={headRef}>
        <header className="work-head">
          <p className="eyebrow reveal reveal-up">{t("work.eyebrow")}</p>
          <h2 className="section-title reveal reveal-up">{t("work.title")}</h2>
        </header>

        <div className="work-grid">
          {projects.map((project, index) => {
            const isInternal = Boolean(project.slug);
            const Tag = isInternal ? Link : "a";
            const linkProps = isInternal
              ? { to: `/project/${project.slug}` }
              : {
                  href: project.links?.repo,
                  target: "_blank",
                  rel: "noopener noreferrer",
                };

            return (
              <article
                className={`work-card reveal reveal-up${index === 0 ? " work-card--feature" : ""}`}
                style={{ "--reveal-i": index }}
                key={project.title}
              >
                <div className="work-card-shell">
                  <div className="work-card-media" aria-hidden="true">
                    <img src={project.previewImage} alt="" decoding="async" />
                    <span className="work-card-index">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <div className="work-card-content">
                    <h3 className="work-card-title">{project.title}</h3>
                    <p className="work-card-subtitle">
                      {l(project, "subtitle")}
                    </p>
                    <p className="work-card-description">
                      {l(project, "description")}
                    </p>

                    {project.tags?.length ? (
                      <div className="work-card-tags">
                        {project.tags.map((tag) => (
                          <span className="pill" key={tag}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    ) : null}

                    <div className="work-card-actions">
                      <Tag
                        className="work-card-primary"
                        aria-label={
                          isInternal
                            ? `View ${project.title} project`
                            : `Open GitHub repository for ${project.title}`
                        }
                        {...linkProps}
                      >
                        {isInternal ? t("work.viewProject") : t("work.openRepo")}
                        <svg
                          className="work-card-arrow"
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          aria-hidden="true"
                        >
                          <path
                            d="M3 8h10M9 4l4 4-4 4"
                            stroke="currentColor"
                            strokeWidth="1.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </Tag>

                      {project.links?.demo && !isInternal ? (
                        <a
                          className="work-card-demo"
                          href={project.links.demo}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <span
                            className="work-card-demo-dot"
                            aria-hidden="true"
                          />
                          {t("work.demo")}
                        </a>
                      ) : null}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Work;
