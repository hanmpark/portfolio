import { useState, useEffect } from "react";
import { experiences, projects } from "../data/home.js";
import { useLanguage } from "../i18n/useLanguage.js";
import "./PageLoader.css";

/**
 * Images that must be preloaded before revealing the page.
 * The home page keeps its sections mounted and ready, so below-the-fold
 * visuals are warmed up before the first scroll reaches them.
 */
const PAGE_IMAGES = [
  "/assets/LOGO_PRINCIPAL_HANMIN_BLANC.svg",
  "/assets/self_image.jpg",
  "/assets/photo.webp",
  ...projects.flatMap((project) => [project.previewImage, ...(project.previewImages ?? [])]),
  ...experiences.map((experience) => experience.image).filter(Boolean),
];

const imageLoads = new Map();

function preloadImage(src) {
  const url = new URL(src, document.baseURI).href;
  if (imageLoads.has(url)) return imageLoads.get(url);
  const load = new Promise((resolve) => {
    const img = new Image();
    img.decoding = "async";
    img.loading = "eager";
    img.onload = async () => {
      try {
        await img.decode?.();
      } catch {
        // The browser may reject decode for SVGs or already decoded images.
      }
      resolve(true);
    };
    img.onerror = () => resolve(false); // don't block on failure
    img.src = url;
  });
  imageLoads.set(url, load);
  return load;
}

const PageLoader = ({ onReady }) => {
  const { t } = useLanguage();
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let fadeTimer;
    const load = async () => {
      // Include mounted images plus assets used by inactive slides and experiences.
      const images = [...document.querySelectorAll(".app img")];
      images.forEach((image) => { image.loading = "eager"; });
      const sources = new Set([
        ...PAGE_IMAGES,
        ...images.map((image) => image.currentSrc || image.src),
      ].filter(Boolean));
      await Promise.all([
        ...[...sources].map(preloadImage),
        ...images.map((image) => image.decode().catch(() => {})),
      ]);
      if (cancelled) return;
      setHidden(true);
      fadeTimer = window.setTimeout(() => onReady?.(), 600);
    };
    load();
    return () => {
      cancelled = true;
      window.clearTimeout(fadeTimer);
    };
  }, [onReady]);

  return (
    <div className={`page-loader${hidden ? " page-loader--hidden" : ""}`}>
      <img
        className="page-loader__logo"
        src="/assets/LOGO_PRINCIPAL_HANMIN_BLANC.svg"
        alt="Hanmin Park"
      />
      <div className="page-loader__spinner" />
      <span className="page-loader__label">{t("loader.loading")}</span>
    </div>
  );
};

export default PageLoader;
