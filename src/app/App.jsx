import { lazy, Suspense, useEffect, useState, useCallback } from "react";
import Hero from "../sections/Hero.jsx";
import Work from "../sections/Work.jsx";
import Experience from "../sections/Experience.jsx";
import About from "../sections/About.jsx";
import ProjectCTA from "../sections/ProjectCTA.jsx";
import BackToTopButton from "../components/BackToTopButton.jsx";
import PageLoader from "../components/PageLoader.jsx";
import Navbar from "../components/Navbar.jsx";
import SiteFooter from "../components/SiteFooter.jsx";
import "./App.css";

const LogoShowcase = lazy(() => import("../components/LogoShowcase.jsx"));
// Keep the showcase available without loading or mounting its 3D scene.
const SHOW_LOGO_SHOWCASE = false;

const App = () => {
  const [loaded, setLoaded] = useState(false);

  const handleReady = useCallback(() => setLoaded(true), []);

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
      <BackToTopButton />
      <Navbar />
      <Hero />
      <main>
        <div className="main-content-bg">
          <div className="about-scroll-stage">
            <About />
          </div>
          <Work />
          {SHOW_LOGO_SHOWCASE && (
            <Suspense fallback={<div style={{ height: "100dvh", background: "#080807" }} />}>
              <LogoShowcase />
            </Suspense>
          )}
          <Experience />
          <ProjectCTA />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
};

export default App;
