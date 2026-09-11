import { useEffect, useRef } from "react";
import HeroDotField from "../components/HeroDotField.jsx";
import { useLanguage } from "../i18n/useLanguage.js";
import "./Hero.css";

const Hero = () => {
  const { t } = useLanguage();
  const heroRef = useRef(null);
  const stageRef = useRef(null);

  useEffect(() => {
    const hero = heroRef.current;
    const stage = stageRef.current;
    if (!hero || !stage) return undefined;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let animationFrame = 0;

    const clamp = (value) => Math.min(Math.max(value, 0), 1);
    const smoothstep = (value) => value * value * (3 - 2 * value);
    const updateStack = () => {
      animationFrame = 0;

      if (reducedMotion.matches) {
        stage.style.removeProperty("--hero-stack-y");
        stage.style.removeProperty("--hero-stack-opacity");
        hero.style.removeProperty("--hero-copy-y");
        hero.style.removeProperty("--hero-copy-opacity");
        hero.style.removeProperty("--hero-bottom-y");
        hero.style.removeProperty("--hero-bottom-opacity");
        return;
      }

      const about = document.getElementById("about");
      if (!about) return;

      const viewportHeight = Math.max(window.innerHeight, 1);
      const aboutTop = about.getBoundingClientRect().top;
      const progress = clamp((viewportHeight - aboutTop) / viewportHeight);
      const easedProgress = smoothstep(progress);
      const copyFade = 1 - smoothstep(clamp((progress - 0.06) / 0.68));
      const bottomFade = 1 - smoothstep(clamp(progress / 0.5));

      stage.style.setProperty(
        "--hero-stack-y",
        `${(easedProgress * 50).toFixed(2)}vh`,
      );
      stage.style.setProperty(
        "--hero-stack-opacity",
        (1 - easedProgress).toFixed(3),
      );
      hero.style.setProperty(
        "--hero-copy-y",
        `${(-easedProgress * 16).toFixed(2)}vh`,
      );
      hero.style.setProperty("--hero-copy-opacity", copyFade.toFixed(3));
      hero.style.setProperty(
        "--hero-bottom-y",
        `${(-easedProgress * 9).toFixed(2)}vh`,
      );
      hero.style.setProperty("--hero-bottom-opacity", bottomFade.toFixed(3));
    };

    const requestUpdate = () => {
      if (animationFrame) return;
      animationFrame = window.requestAnimationFrame(updateStack);
    };

    updateStack();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    reducedMotion.addEventListener("change", requestUpdate);

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      reducedMotion.removeEventListener("change", requestUpdate);
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <header className="hero" id="top" ref={heroRef}>
      <div className="hero-stage" ref={stageRef}>
        <HeroDotField hostRef={stageRef} />
        <div className="hero-shade" aria-hidden="true" />
      </div>

      <div className="container hero-frame">
        <div className="hero-copy">
          <h1 className="hero-title">
            <span className="hero-title-name hero-reveal hero-reveal-d1">
              Hanmin Park
            </span>
            <em className="hero-title-role hero-reveal hero-reveal-d2">
              {t("hero.role")}
            </em>
          </h1>
        </div>

        <div className="hero-bottom-parallax">
          <div className="hero-bottom hero-reveal hero-reveal-d3">
            <p className="hero-description">{t("hero.description")}</p>
            <a className="btn" href="#about">
              {t("hero.viewAbout")}
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Hero;
