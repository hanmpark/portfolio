import { Link } from "react-router-dom";
import { projects } from "../data/home.js";
import useScrollReveal from "../hooks/useScrollReveal.js";
import "./Work.css";

const Work = () => {
  const headRef = useScrollReveal({ threshold: 0.15, selector: ".reveal" });

  return (
    <section className="section work-section" id="work">
      {/* Noise texture */}
      <div className="noise-overlay" aria-hidden="true" />

      <div className="container work-inner" ref={headRef}>
        <header className="work-head">
          <p className="eyebrow reveal reveal-up">Selected work</p>
          <h2 className="section-title reveal reveal-up">Projects</h2>
        </header>

        <div className="work-grid reveal-stagger">
          {projects.map((project, index) => {
            const isInternal = Boolean(project.slug);
            const CardLink = isInternal ? Link : "a";
            const linkProps = isInternal
              ? { to: `/project/${project.slug}` }
              : {
                  href: project.links?.repo,
                  target: "_blank",
                  rel: "noopener noreferrer",
                };

            return (
              <article
                className="work-card reveal reveal-up"
                style={{ "--reveal-i": index }}
                key={project.title}
              >
                <CardLink
                  className="work-card-main"
                  aria-label={
                    isInternal
                      ? `View ${project.title} project`
                      : `Open GitHub repository for ${project.title}`
                  }
                  {...linkProps}
                >
                  <span className="work-card-cue" aria-hidden="true">
                    {isInternal ? "View project" : "Open repo"}
                    <span className="work-card-cue-arrow">{"->"}</span>
                  </span>

                  <figure className="work-card-img">
                    <img
                      src={project.previewImage}
                      alt={`${project.title} preview`}
                      loading="lazy"
                    />
                  </figure>

                  <div className="work-card-body">
                    <span className="work-card-number">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className="work-card-title">{project.title}</h3>
                    <p className="work-card-subtitle">{project.subtitle}</p>

                    {project.tags?.length ? (
                      <div className="tag-row">
                        {project.tags.map((tag) => (
                          <span className="pill" key={tag}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </CardLink>

                {project.links?.demo && !isInternal ? (
                  <div className="work-card-actions">
                    <a
                      className="btn small work-card-demo"
                      href={project.links.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Demo
                    </a>
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Work;
