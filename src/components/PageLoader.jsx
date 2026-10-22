import { useState, useEffect, useRef } from "react";
import { useLanguage } from "../i18n/useLanguage.js";
import "./PageLoader.css";

const PageLoader = ({ onReady }) => {
  const { t } = useLanguage();
  const [hidden, setHidden] = useState(false);
  const loaderRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    let fadeTimer;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const load = async () => {
      // Decode the actual page images, including offscreen and inactive logos,
      // before allowing scroll. Do not download galleries from other routes.
      const images = [...loaderRef.current.parentElement.querySelectorAll("img")];
      images.forEach((image) => { image.loading = "eager"; });
      // A broken image must not prevent access to the page.
      await Promise.all(images.map((image) => image.decode().catch(() => {})));
      if (cancelled) return;
      setHidden(true);
      fadeTimer = window.setTimeout(() => {
        document.body.style.overflow = previousOverflow;
        onReady?.();
      }, 600);
    };
    load();
    return () => {
      cancelled = true;
      window.clearTimeout(fadeTimer);
      document.body.style.overflow = previousOverflow;
    };
  }, [onReady]);

  return (
    <div ref={loaderRef} className={`page-loader${hidden ? " page-loader--hidden" : ""}`}>
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
