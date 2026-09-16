import { useEffect, useRef, useState } from "react";
import { contact, navLinks, socialLinks } from "../data/home.js";
import { useLanguage } from "../i18n/useLanguage.js";
import useScrollReveal from "../hooks/useScrollReveal.js";
import ArrowUpRight from "./ArrowUpRight.jsx";
import "./SiteFooter.css";

const SiteFooter = () => {
  const { t, lang } = useLanguage();
  const [now, setNow] = useState(() => new Date());
  const footerRef = useRef(null);
  const signatureRef = useScrollReveal({ threshold: 0.15, rootMargin: "0px", once: false, selector: ".sf-signature" });
  const returnToTop = (event) => {
    event.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    });
  };

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const footer = footerRef.current;
    const main = footer.previousElementSibling;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const update = () => {
      frame = 0;
      const height = window.innerHeight;
      const mainBottom = main.getBoundingClientRect().bottom;
      const overlap = Math.min(height * 0.2, 180);
      const progress = motion.matches ? 1 : Math.min(Math.max((height - mainBottom) / Math.max(height, 1), 0), 1);
      // Keep a shallow overlap, but release it across the entire viewport crossing.
      footer.style.setProperty("--sf-reveal-y", `${-(1 - progress) * overlap}px`);
      footer.style.setProperty("--sf-reveal-opacity", String(0.6 + progress * 0.4));
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const observer = new ResizeObserver(schedule);
    observer.observe(footer);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    motion.addEventListener("change", schedule);
    update();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      motion.removeEventListener("change", schedule);
    };
  }, []);

  const parisTime = new Intl.DateTimeFormat(lang === "fr" ? "fr-FR" : "en-GB", {
    timeZone: "Europe/Paris",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).format(now);

  return (
    <footer className="site-footer" ref={footerRef}>
      <div className="sf-reveal-content">
      <div className="container sf-inner">
        <div className="sf-topline">
          <span>Portfolio / Hanmin Park</span>
          <span className="sf-clock">{t("footer.time")} <time dateTime={now.toISOString()}>{parisTime}</time></span>
        </div>
        <div className="sf-main">
          <nav className="sf-navigation" aria-label={t("footer.navigation")}>
            <p className="sf-label">{t("footer.navigation")}</p>
            {[...navLinks, { key: "letsTalk", href: "#contact" }].map((link) => (
              <a href={link.href} key={link.key}>
                <span>{t(`nav.${link.key}`)}</span><ArrowUpRight className="sf-external-arrow" />
              </a>
            ))}
          </nav>
          <div className="sf-details">
            <div className="sf-contact">
              <p className="sf-label">{t("footer.details")}</p>
              <a className="sf-email" href={`mailto:${contact.email}`}>{contact.email}<ArrowUpRight className="sf-external-arrow" /></a>
              <p className="sf-role">{t("hero.role")}</p>
            </div>
            <div className="sf-socials">
              <p className="sf-label">{t("footer.socials")}</p>
              {socialLinks.filter((link) => /github|linkedin/i.test(link.label)).map((link) => (
                <a href={link.href} target="_blank" rel="noopener noreferrer" key={link.label}>{link.label}<ArrowUpRight className="sf-external-arrow" /></a>
              ))}
            </div>
          </div>
        </div>
        <div className="sf-bottomline">
          <span>© {now.getFullYear()} Hanmin Park</span>
          <span>{t("footer.credit")}</span>
          <a className="sf-back-to-top" href="#top" onClick={returnToTop}>
            {t("backToTop")}
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 19V5M6.5 10.5 12 5l5.5 5.5" />
            </svg>
          </a>
        </div>
      </div>
      <div className="sf-signature" ref={signatureRef}>
        <div className="container sf-signature-inner">
          <a className="sf-wordmark" href="#top" onClick={returnToTop} aria-label={`Hanmin Park — ${t("backToTop")}`}>
            <span className="sf-wordmark-text" aria-hidden="true">
              {Array.from("HANMIN PARK").map((letter, index) => (
                <span className="sf-letter" style={{ "--letter-index": index }} key={index}>{letter}</span>
              ))}
            </span>
            <ArrowUpRight className="sf-wordmark-arrow" />
          </a>
        </div>
      </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
