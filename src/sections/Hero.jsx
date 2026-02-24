import { useEffect, useRef, useCallback } from "react";
import Navbar from "../components/Navbar.jsx";
import "./Hero.css";

const ENTER_DURATION = 1200; // ms – must match CSS animation duration

const Hero = () => {
  const heroRef = useRef(null);
  const frameRef = useRef(0);
  const pointerRef = useRef({ x: 0, y: 0 });
  const readyRef = useRef(false);

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
    return () => {
      clearTimeout(timer);
      if (frameRef.current) {
        window.cancelAnimationFrame(frameRef.current);
      }
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
          className="hero-fig hero-fig-1"
          src="/assets/premium/fig1.png"
          alt=""
        />
        <img
          className="hero-fig hero-fig-2"
          src="/assets/premium/fig2.png"
          alt=""
        />
        <img
          className="hero-fig hero-fig-3"
          src="/assets/premium/fig3.png"
          alt=""
        />
        <img
          className="hero-fig hero-fig-4"
          src="/assets/premium/fig4.png"
          alt=""
        />
      </div>

      <Navbar />

      <div className="hero-grid container">
        <div className="hero-copy">
          <h1 className="hero-title">
            <span className="hero-title-name hero-reveal hero-reveal-d1">Hanmin Park</span>
            <span className="hero-title-role hero-reveal hero-reveal-d2">Software Engineer</span>
          </h1>
          <p className="hero-template hero-reveal hero-reveal-d3">
            <span className="hero-template-lead">
              I design and build scalable web applications and intelligent
              systems, from frontend interfaces to backend architecture, with a
              focus on performance, clarity, and real-world impact.
            </span>
          </p>
          <div className="hero-actions hero-reveal hero-reveal-d4">
            <a className="btn" href="#work">View work</a>
            <a className="btn ghost" href="#contact">Get in touch</a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Hero;
