import { useState, useEffect, useCallback } from "react";
import { useLanguage } from "../i18n/useLanguage.js";
import "./PageLoader.css";

/**
 * Images that must be preloaded before revealing the page.
 * Add every critical src here (hero figures, project previews, logos, portrait).
 */
const CRITICAL_IMAGES = [
  // Hero chrome figures
  "https://assets.hpark.me/premium/fig1.webp",
  "https://assets.hpark.me/premium/fig2.webp",
  "https://assets.hpark.me/premium/fig3.webp",
  "https://assets.hpark.me/premium/fig4.webp",
  // Contact chrome figures
  "https://assets.hpark.me/premium/fig5.webp",
  "https://assets.hpark.me/premium/fig6.webp",
  // Project preview images
  "/works/rt1.webp",
  "/works/tetris-game.webp",
  "/works/42 Logtime.webp",
  "/works/so_long.webp",
  // Experience & education logos
  "/assets/experiences/thegoodcleaners.png",
  "/assets/experiences/amadeus.svg",
  "/assets/experiences/proptexx.webp",
  "/assets/experiences/42logo.png",
  "/assets/experiences/pantheon-sorbonne.svg",
  "/assets/experiences/civlogo.png",
  // About portrait
  "/assets/self_image.jpg",
];

function preloadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false); // don't block on failure
    img.src = src;
  });
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
      <div className="page-loader__spinner" />
      <span className="page-loader__label">{t("loader.loading")}</span>
    </div>
  );
};

export default PageLoader;
