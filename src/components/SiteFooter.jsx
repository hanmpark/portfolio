import { useEffect, useState } from "react";
import { contact, navLinks, socialLinks } from "../data/home.js";
import { useLanguage } from "../i18n/useLanguage.js";
import useScrollReveal from "../hooks/useScrollReveal.js";
import "./SiteFooter.css";

const SiteFooter = () => {
  const { t, lang } = useLanguage();
  const [now, setNow] = useState(() => new Date());
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

  const parisTime = new Intl.DateTimeFormat(lang === "fr" ? "fr-FR" : "en-GB", {
    timeZone: "Europe/Paris",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).format(now);

  return (
    <footer className="site-footer">
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
                <span>{t(`nav.${link.key}`)}</span><span aria-hidden="true">↗</span>
              </a>
            ))}
          </nav>
          <div className="sf-details">
            <div className="sf-contact">
              <p className="sf-label">{t("footer.details")}</p>
              <a className="sf-email" href={`mailto:${contact.email}`}>{contact.email}<span aria-hidden="true">↗</span></a>
              <p className="sf-role">{t("hero.role")}</p>
            </div>
            <div className="sf-socials">
              <p className="sf-label">{t("footer.socials")}</p>
              {socialLinks.filter((link) => /github|linkedin/i.test(link.label)).map((link) => (
                <a href={link.href} target="_blank" rel="noopener noreferrer" key={link.label}>{link.label} <span aria-hidden="true">↗</span></a>
              ))}
            </div>
          </div>
        </div>
        <div className="sf-bottomline">
          <span>© {now.getFullYear()} Hanmin Park</span>
          <span>{t("footer.credit")}</span>
          <a href="#top" onClick={returnToTop}>{t("backToTop")} <span aria-hidden="true">↑</span></a>
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
            <span className="sf-wordmark-arrow" aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
