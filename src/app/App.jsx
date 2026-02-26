import { useEffect, useState } from "react";
import Hero from "../sections/Hero.jsx";
import Work from "../sections/Work.jsx";
import Experience from "../sections/Experience.jsx";
import About from "../sections/About.jsx";
import Contact from "../sections/Contact.jsx";
import ScrollProgress from "../components/ScrollProgress.jsx";
import BackToTopButton from "../components/BackToTopButton.jsx";
import "./App.css";

const App = () => {
  const [contactInFront, setContactInFront] = useState(false);

  useEffect(() => {
    let raf = 0;
    let lastValue = null;

    const update = () => {
      raf = 0;
      const doc = document.documentElement;
      const maxScroll = Math.max(doc.scrollHeight - window.innerHeight, 1);
      const nextValue = window.scrollY >= maxScroll * 0.5;

      if (nextValue !== lastValue) {
        lastValue = nextValue;
        setContactInFront(nextValue);
      }
    };

    const schedule = () => {
      if (!raf) raf = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="app">
      <ScrollProgress />
      <BackToTopButton />
      <Hero />
      <main>
        <div className="main-content-bg">
          {/* Unified background elements contained within content sections */}
          <div className="main-orb main-orb--1" aria-hidden="true" />
          <div className="main-orb main-orb--2" aria-hidden="true" />
          <div className="main-orb main-orb--3" aria-hidden="true" />
          <div className="main-orb main-orb--4" aria-hidden="true" />
          <div className="main-noise" aria-hidden="true" />

          <Work />
          <Experience />
          <About />
        </div>
      </main>
      <div
        className={`contact-reveal${contactInFront ? " contact-reveal--front" : ""}`}
      >
        <Contact />
      </div>
    </div>
  );
};

export default App;
