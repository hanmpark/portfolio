import { useEffect, useState, useCallback } from "react";
import Hero from "../sections/Hero.jsx";
import Work from "../sections/Work.jsx";
import Experience from "../sections/Experience.jsx";
import About from "../sections/About.jsx";
import Contact from "../sections/Contact.jsx";
import ScrollProgress from "../components/ScrollProgress.jsx";
import BackToTopButton from "../components/BackToTopButton.jsx";
import PageLoader from "../components/PageLoader.jsx";
import "./App.css";

const App = () => {
  const [loaded, setLoaded] = useState(false);

  const handleReady = useCallback(() => setLoaded(true), []);

  // Lock scrolling while loading
  useEffect(() => {
    if (!loaded) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [loaded]);

  useEffect(() => {
    if (!loaded || window.location.hash !== "#contact") return;

    const scrollToContactEnd = () => {
      window.scrollTo({ top: Number.MAX_SAFE_INTEGER, behavior: "auto" });
    };

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(scrollToContactEnd);
    });

    const timeouts = [
      window.setTimeout(scrollToContactEnd, 400),
      window.setTimeout(scrollToContactEnd, 1200),
    ];
    return () => timeouts.forEach((timeout) => window.clearTimeout(timeout));
  }, [loaded]);

  return (
    <div className={`app${loaded ? " app--loaded" : ""}`}>
      <PageLoader onReady={handleReady} />
      <ScrollProgress />
      <BackToTopButton />
      <div className="hero-stage">
        <Hero />
      </div>
      <main>
        <div className="main-content-bg">
          <Work />
          <Experience />
          <About />
          <Contact />
        </div>
      </main>
    </div>
  );
};

export default App;
