import { useState, useEffect, useCallback } from "react";
import { useLanguage } from "../i18n/useLanguage.js";
import "./PageLoader.css";

/**
 * Images that must be preloaded before revealing the page.
 * Keep this list limited to first-viewport imagery so the page does not wait
 * on below-the-fold assets before it becomes usable.
 */
const CRITICAL_IMAGES = [
  "https://assets.hpark.me/premium/fig1.webp",
  "https://assets.hpark.me/premium/fig2.webp",
  "https://assets.hpark.me/premium/fig3.webp",
  "https://assets.hpark.me/premium/fig4.webp",
];

function preloadImage(src) {
  const load = new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false); // don't block on failure
    img.src = src;
  });

  return Promise.race([
    load,
    new Promise((resolve) => {
      window.setTimeout(() => resolve(false), 3500);
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
      <div className="page-loader__spinner" />
      <span className="page-loader__label">{t("loader.loading")}</span>
    </div>
  );
};

export default PageLoader;
