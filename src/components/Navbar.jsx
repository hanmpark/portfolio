import { useEffect, useRef, useState, useCallback } from "react";
import { navLinks, socialLinks } from "../data/home.js";
import { useLanguage } from "../i18n/useLanguage.js";
import "./Navbar.css";

const navbarSocials = socialLinks.filter(
  (link) => link.label === "LinkedIn" || link.label === "GitHub",
);

const socialIcons = {
  GitHub: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
      <path d="M12 .5C5.37.5 0 5.78 0 12.3c0 5.21 3.44 9.64 8.2 11.21.6.11.82-.26.82-.57v-2.17c-3.34.72-4.04-1.42-4.04-1.42-.55-1.37-1.33-1.74-1.33-1.74-1.09-.73.08-.72.08-.72 1.2.09 1.84 1.22 1.84 1.22 1.07 1.8 2.8 1.28 3.49.98.1-.76.42-1.28.76-1.57-2.66-.3-5.47-1.31-5.47-5.84 0-1.29.47-2.35 1.24-3.18-.13-.3-.54-1.5.12-3.13 0 0 1-.32 3.3 1.21a11.6 11.6 0 016.01 0c2.3-1.53 3.3-1.21 3.3-1.21.66 1.63.25 2.83.12 3.13.77.83 1.24 1.89 1.24 3.18 0 4.55-2.82 5.54-5.5 5.83.43.37.82 1.1.82 2.22v3.29c0 .31.21.69.83.57C20.57 21.93 24 17.51 24 12.3 24 5.78 18.63.5 12 .5z" />
    </svg>
  ),
  LinkedIn: (
    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 110-4.12 2.06 2.06 0 010 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
    </svg>
  ),
};

const Navbar = () => {
  const { lang, setLang, t } = useLanguage();
  const navRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    let raf = 0;

    const update = () => {
      raf = 0;
      const y = window.scrollY;
      setScrolled(y > 60);
      setHidden(y > 300 && y > lastY.current);
      lastY.current = y;
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", schedule, { passive: true });
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
    };
  }, []);

  /* Close menu on resize past mobile breakpoint */
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 721px)");
    const close = () => mq.matches && setMenuOpen(false);
    mq.addEventListener("change", close);
    return () => mq.removeEventListener("change", close);
  }, []);

  const handleScrollToBottom = (event) => {
    event.preventDefault();
    setMenuOpen(false);
    const root = document.scrollingElement ?? document.documentElement;
    window.scrollTo({
      top: root.scrollHeight,
      behavior: "smooth",
    });
  };

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <nav
      ref={navRef}
      className={`nav container${scrolled ? " nav--scrolled" : ""}${hidden ? " nav--hidden" : ""}${menuOpen ? " nav--open" : ""}`}
      aria-label="Primary"
    >
      <a className="logo" href="#top">
        Hanmin
      </a>

      {/* Hamburger — visible only on mobile via CSS */}
      <button
        className="nav-burger"
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((o) => !o)}
      >
        <span />
        <span />
        <span />
      </button>

      <div className="nav-drawer">
        <div className="nav-links">
          {navLinks.map((link) => (
            <a href={link.href} key={link.key} onClick={closeMenu}>
              {t(`nav.${link.key}`)}
            </a>
          ))}
        </div>
        <div className="nav-actions">
          <div className="nav-socials" aria-label="Social links">
            {navbarSocials.map((link) => (
              <a
                className="nav-social"
                href={link.href}
                key={link.label}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
              >
                {socialIcons[link.label]}
              </a>
            ))}
          </div>
          <button
            className="lang-toggle"
            onClick={() => setLang(lang === "en" ? "fr" : "en")}
            aria-label={
              lang === "en" ? "Passer en français" : "Switch to English"
            }
          >
            <span className={lang === "en" ? "lang-toggle__active" : ""}>
              EN
            </span>
            <span className="lang-toggle__sep">/</span>
            <span className={lang === "fr" ? "lang-toggle__active" : ""}>
              FR
            </span>
          </button>
          <a
            className="btn small"
            href="#contact"
            onClick={handleScrollToBottom}
          >
            {t("nav.letsTalk")}
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
