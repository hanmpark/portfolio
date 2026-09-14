import { useEffect, useState, useCallback } from "react";
import Hero from "../sections/Hero.jsx";
import Work from "../sections/Work.jsx";
import Experience from "../sections/Experience.jsx";
import About from "../sections/About.jsx";
import ProjectCTA from "../sections/ProjectCTA.jsx";
import ScrollProgress from "../components/ScrollProgress.jsx";
import BackToTopButton from "../components/BackToTopButton.jsx";
import PageLoader from "../components/PageLoader.jsx";
import Navbar from "../components/Navbar.jsx";
import SiteFooter from "../components/SiteFooter.jsx";
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
    const sectionId = window.location.hash.slice(1);
    if (!loaded || !["contact", "work"].includes(sectionId)) return;

    const scrollToSection = () => {
      const section = document.getElementById(sectionId);
      if (!section) return;
      window.scrollTo({ top: section.getBoundingClientRect().top + window.scrollY, behavior: "instant" });
    };

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(scrollToSection);
    });

    const timeouts = [
      window.setTimeout(scrollToSection, 400),
      window.setTimeout(scrollToSection, 1200),
    ];
    return () => timeouts.forEach((timeout) => window.clearTimeout(timeout));
  }, [loaded]);

  return (
    <div className={`app${loaded ? " app--loaded" : ""}`}>
      <PageLoader onReady={handleReady} />
      <ScrollProgress />
      <BackToTopButton />
      <Navbar />
      <div className="hero-scroll-stage">
        <Hero />
      </div>
      <main>
        <div className="main-content-bg">
          <div className="about-scroll-stage">
            <About />
          </div>
          <Work />
          <Experience />
          <ProjectCTA />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
};

export default App;
