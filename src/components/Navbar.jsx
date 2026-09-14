import { useEffect, useState } from "react";
import { navLinks, socialLinks } from "../data/home.js";
import { useLanguage } from "../i18n/useLanguage.js";
import "./Navbar.css";

const Navbar = () => {
  const { lang, setLang, t } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const [footerVisible, setFooterVisible] = useState(false);
  const hidden = footerVisible && !menuOpen;

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 961px)");
    const closeOnDesktop = () => {
      if (desktop.matches) setMenuOpen(false);
    };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);

  useEffect(() => {
    const footer = document.querySelector(".site-footer");
    if (!footer) return undefined;

    const observer = new IntersectionObserver(([entry]) => {
      setFooterVisible(entry.isIntersecting);
    });
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const closeOnEscape = (event) => event.key === "Escape" && setMenuOpen(false);
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav
      className={`nav${menuOpen ? " nav--open" : ""}${hidden ? " nav--hidden" : ""}`}
      aria-label="Primary"
      inert={hidden ? "" : undefined}
    >
      <div className="nav-shell container">
        <a className="nav-brand" href="#top" onClick={closeMenu} aria-label="Hanmin Park — home">
          <img src="/assets/LOGO_PRINCIPAL_HANMIN_BLANC.svg" alt="" />
          <span className="nav-brand-name">Hanmin<br />Park</span>
        </a>

        <div className="nav-links">
          {navLinks.map((link) => (
            <a href={link.href} key={link.key}>{t(`nav.${link.key}`)}</a>
          ))}
        </div>

        <div className="nav-actions">
          <button className="lang-toggle" type="button" onClick={() => setLang(lang === "en" ? "fr" : "en")} aria-label={lang === "en" ? "Passer en français" : "Switch to English"}>
            {lang.toUpperCase()} <span>/</span> {lang === "en" ? "FR" : "EN"}
          </button>
          <a className="nav-contact" href="#contact">{t("nav.letsTalk")} <span>↗</span></a>
        </div>

        <button className="nav-toggle" type="button" aria-controls="mobile-navigation" aria-expanded={menuOpen} aria-label={menuOpen ? "Close menu" : "Open menu"} onClick={() => setMenuOpen((open) => !open)}>
          <span /><span />
        </button>
      </div>

      <div className="nav-overlay" id="mobile-navigation" aria-hidden={!menuOpen} inert={!menuOpen ? "" : undefined}>
        <div className="container nav-overlay-inner">
          <p>Navigation / 2026</p>
          <div className="nav-overlay-links">
            {navLinks.map((link) => (
              <a href={link.href} key={link.key} onClick={closeMenu}><span>{t(`nav.${link.key}`)}</span></a>
            ))}
            <a href="#contact" onClick={closeMenu}><span>{t("nav.letsTalk")}</span></a>
          </div>
          <div className="nav-overlay-foot">
            <div>{socialLinks.filter((link) => /github|linkedin/i.test(link.label)).map((link) => <a href={link.href} target="_blank" rel="noopener noreferrer" key={link.label}>{link.label} ↗</a>)}</div>
            <button type="button" onClick={() => setLang(lang === "en" ? "fr" : "en")}>{lang === "en" ? "Français" : "English"}</button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
