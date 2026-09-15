import { lazy, Suspense } from "react";
import { useLanguage } from "../i18n/useLanguage.js";
import "./Hero.css";

const LiquidChrome = lazy(() => import("../components/LiquidChrome.jsx"));

const Hero = () => {
  const { t } = useLanguage();
  return (
    <header className="hero" id="top">
      <div className="hero-stage">
        <Suspense fallback={null}><LiquidChrome /></Suspense>
        <div className="hero-intro">
          <p className="hero-role">{t("hero.role")}</p>
          <p className="hero-description">{t("hero.description")}</p>
          <a className="hero-discover" href="#about">
            {t("hero.viewAbout")}
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v16m-6-6 6 6 6-6" /></svg>
          </a>
        </div>
        <h1 className="hero-title">Hanmin Park</h1>
      </div>
    </header>
  );
};

export default Hero;
