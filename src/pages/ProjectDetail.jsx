import { useEffect, useState, useCallback } from "react";
import { useParams, Navigate, useNavigate } from "react-router-dom";
import { projectDetails } from "../data/projectDetails.js";
import { useLanguage } from "../i18n/useLanguage.js";
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

const ALLOWED_INLINE_TAGS = new Set(["A", "STRONG", "CODE"]);

const isSafeUrl = (href) => {
  try {
    const url = new URL(href, window.location.origin);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

const renderInlineNodes = (nodes, path = "node") =>
  Array.from(nodes).flatMap((node, index) => {
    const key = `${path}-${index}`;

    if (node.nodeType === Node.TEXT_NODE) return node.textContent;
    if (node.nodeType !== Node.ELEMENT_NODE) return null;

    const children = renderInlineNodes(node.childNodes, key);
    if (!ALLOWED_INLINE_TAGS.has(node.tagName)) return children;

    if (node.tagName === "STRONG") return <strong key={key}>{children}</strong>;
    if (node.tagName === "CODE") return <code key={key}>{children}</code>;

    const href = node.getAttribute("href");
    if (!href || !isSafeUrl(href)) return children;

    return (
      <a key={key} href={href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  });

const renderRichText = (html, key) => {
  const doc = new DOMParser().parseFromString(html, "text/html");
  return <p key={key}>{renderInlineNodes(doc.body.childNodes, `p-${key}`)}</p>;
};

const ProjectDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { t, l } = useLanguage();
  const project = projectDetails[slug];
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  const closeLightbox = useCallback(() => setLightbox(null), []);
  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e) => {
      if (e.key === "Escape") closeLightbox();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox, closeLightbox]);

  if (!project) return <Navigate to="/" replace />;

  return (
    <div className="pj">
      <button type="button" className="pj-back" onClick={() => navigate(-1)}>
        <ArrowLeft />
        {t("projectDetail.back")}
      </button>

      {/* Hero with title overlaid at bottom */}
      <header className="pj-hero">
        <img src={project.heroImage} alt={`${project.title} hero`} />
        <div className="pj-hero-body">
          <div className="pj-hero-inner">
            <h1 className="pj-title">{project.title}</h1>
            <p className="pj-subtitle">{l(project, "subtitle")}</p>
          </div>
        </div>
      </header>

      <div className="pj-content">
        {/* Meta bar: tags + links + notice */}
        <div className="pj-meta">
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
                {t("projectDetail.github")}
              </a>
            ) : null}
            {project.demo ? (
              <a
                className="btn small ghost"
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t("projectDetail.liveDemo")}
              </a>
            ) : null}
          </div>

          {project.demoNotice ? (
            <div className="pj-demo-notice">
              <InfoIcon />
              <span>{l(project, "demoNotice")}</span>
            </div>
          ) : null}
        </div>

        {/* Description */}
        <section className="pj-desc">
          <p className="pj-section-label">{t("projectDetail.aboutProject")}</p>
          {(l(project, "description") ?? project.description).map((para, i) =>
            renderRichText(para, i),
          )}

          {(l(project, "features") ?? project.features)?.length ? (
            <>
              <p className="pj-section-label">{t("projectDetail.keyFeatures")}</p>
              <ul className="pj-features">
                {(l(project, "features") ?? project.features).map((feat, i) => (
                  <li key={i}>{feat}</li>
                ))}
              </ul>
            </>
          ) : null}
        </section>

        {/* Gallery */}
        {project.gallery?.length ? (
          <section className="pj-gallery">
            <p className="pj-section-label">{t("projectDetail.gallery")}</p>
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
                  <div
                    className="pj-gallery-item pj-gallery-item--image"
                    key={i}
                    onClick={() => setLightbox(item.src)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") setLightbox(item.src);
                    }}
                  >
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

      {/* Lightbox */}
      {lightbox !== null && (
        <div className="pj-lightbox" onClick={closeLightbox}>
          <button
            className="pj-lightbox-close"
            onClick={closeLightbox}
            aria-label="Close preview"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6L6 18" />
              <path d="M6 6l12 12" />
            </svg>
          </button>
          <img
            className="pj-lightbox-img"
            src={lightbox}
            alt="Preview"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;
