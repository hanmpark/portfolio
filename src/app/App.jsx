import { useEffect, useState, useCallback, useRef } from "react";
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
  const [contactInFront, setContactInFront] = useState(false);
  const contactRevealRef = useRef(null);

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

    const scrollToContact = () => {
      const root = document.scrollingElement ?? document.documentElement;
      setContactInFront(true);

      if (window.matchMedia("(max-width: 900px)").matches) {
        window.scrollTo({
          top: root.scrollHeight,
          behavior: "auto",
        });
        return;
      }

      window.scrollTo({
        top: root.scrollHeight,
        behavior: "auto",
      });
    };

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(scrollToContact);
    });

    const timeouts = [
      window.setTimeout(scrollToContact, 250),
      window.setTimeout(scrollToContact, 900),
    ];
    return () => timeouts.forEach((timeout) => window.clearTimeout(timeout));
  }, [loaded]);

  useEffect(() => {
    let raf = 0;
    let lastValue = null;

    const update = () => {
      raf = 0;
      const contactReveal = contactRevealRef.current;
      if (!contactReveal) return;

      const rect = contactReveal.getBoundingClientRect();
      const nextValue = rect.top <= window.innerHeight * 0.45;

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
    <div className={`app${loaded ? " app--loaded" : ""}`}>
      <PageLoader onReady={handleReady} />
      <ScrollProgress />
      <BackToTopButton />
      <Hero />
      <main>
        <div className="main-content-bg">
          <Work />
          <Experience />
          <About />
        </div>
      </main>
      <div
        id="contact"
        ref={contactRevealRef}
        className={`contact-reveal${contactInFront ? " contact-reveal--front" : ""}`}
      >
        <Contact />
      </div>
    </div>
  );
};

export default App;
