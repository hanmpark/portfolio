import { useState, useEffect, useCallback } from "react";
import { experiences, projects } from "../data/home.js";
import { useLanguage } from "../i18n/useLanguage.js";
import "./PageLoader.css";

/**
 * Images that must be preloaded before revealing the page.
 * The home page keeps its sections mounted and ready, so below-the-fold
 * visuals are warmed up before the first scroll reaches them.
 */
const CRITICAL_IMAGES = [
  "/assets/LOGO_PRINCIPAL_HANMIN_BLANC.svg",
  "/assets/LOGO_SECONDAIRE_HANMIN_BLANC.svg",
  "https://assets.hpark.me/premium/fig1.webp",
  "https://assets.hpark.me/premium/fig2.webp",
  "https://assets.hpark.me/premium/fig3.webp",
  "https://assets.hpark.me/premium/fig4.webp",
  "/assets/self_image.jpg",
  ...projects.flatMap((project) =>
    project.previewImages?.length
      ? project.previewImages
      : [project.previewImage],
  ),
  ...experiences.map((experience) => experience.image).filter(Boolean),
];

function preloadImage(src) {
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
    img.src = src;
  });

  return Promise.race([
    load,
    new Promise((resolve) => {
      window.setTimeout(() => resolve(false), 5000);
    }),
  ]);
}

const PageLoader = ({ onReady }) => {
  const { t } = useLanguage();
  const [hidden, setHidden] = useState(false);

  const load = useCallback(async () => {
    await Promise.all(CRITICAL_IMAGES.map(preloadImage));
    // Small delay so the transition doesn't feel abrupt
    setHidden(true);
    // Wait for fade-out transition, then signal parent
    setTimeout(() => onReady?.(), 600);
  }, [onReady]);

  useEffect(() => {
    load();
  }, [load]);

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
