import { useEffect } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { projectDetails } from "../data/projectDetails.js";
import "./ProjectDetail.css";

const ArrowLeft = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 12H5" />
    <path d="M12 19l-7-7 7-7" />
  </svg>
);

const InfoIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4" />
    <path d="M12 8h.01" />
  </svg>
);

const ProjectDetail = () => {
  const { slug } = useParams();
  const project = projectDetails[slug];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!project) return <Navigate to="/" replace />;

  return (
    <div className="pj">
      <Link to="/" className="pj-back">
        <ArrowLeft />
        Back
      </Link>

      <div className="pj-hero">
        <img src={project.heroImage} alt={`${project.title} hero`} />
      </div>

      <div className="pj-content">
        {/* Header */}
        <header className="pj-header">
          <h1 className="pj-title">{project.title}</h1>
          <p className="pj-subtitle">{project.subtitle}</p>

          {project.tags?.length ? (
            <div className="pj-tags">
              {project.tags.map((tag) => (
                <span className="pill" key={tag}>
                  {tag}
                </span>
              ))}
            </div>
          ) : null}

          <div className="pj-links">
            {project.repo ? (
              <a
                className="btn small"
                href={project.repo}
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
            ) : null}
            {project.demo ? (
              <a
                className="btn small ghost"
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
              >
                Live Demo
              </a>
            ) : null}
          </div>

          {project.demoNotice ? (
            <div className="pj-demo-notice">
              <InfoIcon />
              <span>{project.demoNotice}</span>
            </div>
          ) : null}
        </header>

        {/* Description */}
        <section className="pj-desc">
          <h3>About the project</h3>
          {project.description.map((para, i) => (
            <p key={i} dangerouslySetInnerHTML={{ __html: para }} />
          ))}

          {project.features?.length ? (
            <>
              <h3>Key features</h3>
              <ul className="pj-features">
                {project.features.map((feat, i) => (
                  <li key={i}>{feat}</li>
                ))}
              </ul>
            </>
          ) : null}
        </section>

        {/* Gallery */}
        {project.gallery?.length ? (
          <section className="pj-gallery">
            <h3>Gallery</h3>
            <div className="pj-gallery-grid">
              {project.gallery.map((item, i) =>
                item.type === "video" ? (
                  <div
                    className="pj-gallery-item pj-gallery-item--video"
                    key={i}
                  >
                    <video
                      src={item.src}
                      autoPlay
                      muted
                      loop
                      playsInline
                      controls
                    />
                  </div>
                ) : (
                  <div className="pj-gallery-item" key={i}>
                    <img
                      src={item.src}
                      alt={item.alt || `Screenshot ${i + 1}`}
                      loading="lazy"
                    />
                  </div>
                ),
              )}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
};

export default ProjectDetail;
