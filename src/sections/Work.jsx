import { useEffect, useRef } from "react";
import { projects } from "../data/home.js";
import "./Work.css";

const Work = () => {
  const listRef = useRef(null);

  useEffect(() => {
    const cards = listRef.current?.querySelectorAll(".project-card");
    if (!cards?.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle("is-visible", entry.isIntersecting);
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" },
    );

    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="section work-section" id="work">
      <div className="container work-head">
        <h2 className="section-title">Selected works</h2>
      </div>

      <img
        className="work-rocket"
        src="/assets/premium/space-rocket.png"
        alt=""
        aria-hidden="true"
        loading="lazy"
      />

      <div className="container project-list" ref={listRef}>
        {projects.map((project, index) => (
          <article
            className={`project-card${index % 2 !== 0 ? " project-card--reverse" : ""}`}
            style={{ "--index": index }}
            key={project.title}
          >
            <figure className="project-preview">
              <img
                src={project.previewImage}
                alt={`${project.title} preview`}
                loading="lazy"
              />
            </figure>

            <div className="project-content">
              <span className="project-number">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="project-title">{project.title}</h3>
              <p className="project-subtitle">{project.subtitle}</p>
              <p className="project-description">{project.description}</p>

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
          </article>
        ))}
      </div>
    </section>
  );
};

export default Work;
