import { useEffect, useRef, useCallback } from "react";
import Navbar from "../components/Navbar.jsx";
import { useLanguage } from "../i18n/useLanguage.js";
import "./Hero.css";

const ENTER_DURATION = 1200; // ms – must match CSS animation duration

const Hero = () => {
  const { t } = useLanguage();
  const heroRef = useRef(null);
  const figuresRef = useRef([]);
  const frameRef = useRef(0);
  const pointerRef = useRef({ x: 0, y: 0 });
  const readyRef = useRef(false);
  const scrollRafRef = useRef(0);

  const flushPointer = () => {
    frameRef.current = 0;

    const hero = heroRef.current;
    if (!hero) return;

    hero.style.setProperty("--pointer-x", pointerRef.current.x.toFixed(3));
    hero.style.setProperty("--pointer-y", pointerRef.current.y.toFixed(3));
  };

  const queuePointer = (x, y) => {
    pointerRef.current = { x, y };
    if (frameRef.current) return;
    frameRef.current = window.requestAnimationFrame(flushPointer);
  };

  const handleMouseMove = (event) => {
    if (!readyRef.current) return;

    const hero = heroRef.current;
    if (!hero) return;

    const rect = hero.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;

    queuePointer(x, y);
  };

  const handleMouseLeave = () => {
    if (!readyRef.current) return;
    queuePointer(0, 0);
  };

  const handleScrollToBottom = (event) => {
    event.preventDefault();
    const root = document.scrollingElement ?? document.documentElement;
    window.scrollTo({
      top: root.scrollHeight,
      behavior: "smooth",
    });
  };

  const enableParallax = useCallback(() => {
    const hero = heroRef.current;
    if (!hero || readyRef.current) return;
    // Add no-transition to prevent a flash when switching from animation to static styles
    hero.classList.add("hero-entered", "no-transition");
    // Force a reflow so the browser applies the no-transition state first
    hero.offsetHeight; // eslint-disable-line no-unused-expressions
    hero.classList.remove("no-transition");
    readyRef.current = true;
  }, []);

  const handleAnimationEnd = useCallback(
    (e) => {
      if (e.animationName.startsWith("fig-enter")) {
        enableParallax();
      }
    },
    [enableParallax],
  );

  useEffect(() => {
    // Fallback: enable pointer tracking after the animation duration
    const timer = setTimeout(enableParallax, ENTER_DURATION + 100);

    // Per-figure scroll parallax speeds (higher = moves faster)
    const figSpeeds = [0.55, 0.7, 0.45, 0.85];
    // The scroll range over which the figures fully disappear (px)
    const SCROLL_RANGE = window.innerHeight * 0.7;

    const handleScroll = () => {
      if (scrollRafRef.current) return;
      scrollRafRef.current = window.requestAnimationFrame(() => {
        scrollRafRef.current = 0;
        const scrollY = window.scrollY;

        figuresRef.current.forEach((fig, i) => {
          if (!fig) return;
          const speed = figSpeeds[i] ?? 0.6;
          // progress 0→1 over the scroll range
          const t = Math.min(Math.max(scrollY / SCROLL_RANGE, 0), 1);
          // ease-out curve for smoother motion
          const ease = 1 - Math.pow(1 - t, 2.5);

          const translateY = ease * -window.innerHeight * speed * 0.55;
          const scale = 1 - ease * 0.25;
          const opacity = 1 - ease;

          // Use the individual `translate` property — it composes with
          // the CSS `transform` (pointer-tracking) automatically.
          fig.style.translate = `0 ${translateY}px`;
          fig.style.scale = `${scale}`;
          fig.style.opacity = `${opacity}`;
        });
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
      if (frameRef.current) window.cancelAnimationFrame(frameRef.current);
      if (scrollRafRef.current)
        window.cancelAnimationFrame(scrollRafRef.current);
    };
  }, []);

  return (
    <header
      className="hero"
      id="top"
      ref={heroRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="hero-figures"
        aria-hidden="true"
        onAnimationEnd={handleAnimationEnd}
      >
        <img
          ref={(el) => (figuresRef.current[0] = el)}
          className="hero-fig hero-fig-1"
          src="https://assets.hpark.me/premium/fig1.webp"
          alt=""
        />
        <img
          ref={(el) => (figuresRef.current[1] = el)}
          className="hero-fig hero-fig-2"
          src="https://assets.hpark.me/premium/fig2.webp"
          alt=""
        />
        <img
          ref={(el) => (figuresRef.current[2] = el)}
          className="hero-fig hero-fig-3"
          src="https://assets.hpark.me/premium/fig3.webp"
          alt=""
        />
        <img
          ref={(el) => (figuresRef.current[3] = el)}
          className="hero-fig hero-fig-4"
          src="https://assets.hpark.me/premium/fig4.webp"
          alt=""
        />
      </div>

      <Navbar />

      <div className="hero-grid container">
        <div className="hero-copy">
          <h1 className="hero-title">
            <span className="hero-title-name hero-reveal hero-reveal-d1">
              Hanmin Park
            </span>
            <span className="hero-title-role hero-reveal hero-reveal-d2">
              {t("hero.role")}
            </span>
          </h1>
          <p className="hero-template hero-reveal hero-reveal-d3">
            <span className="hero-template-lead">{t("hero.description")}</span>
          </p>
          <div className="hero-actions hero-reveal hero-reveal-d4">
            <a className="btn" href="#work">
              {t("hero.viewWork")}
            </a>
            <a
              className="btn ghost"
              href="#contact"
              onClick={handleScrollToBottom}
            >
              {t("hero.getInTouch")}
            </a>
          </div>
        </div>
      </div>

      <div className="container_mouse" aria-hidden="true">
        <span className="mouse-btn" aria-hidden="true">
          <span className="mouse-scroll" />
        </span>
      </div>
    </header>
  );
};

export default Hero;
