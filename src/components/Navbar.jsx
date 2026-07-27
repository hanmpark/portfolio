import { useEffect, useRef, useState, useCallback } from "react";
import { navLinks, socialLinks } from "../data/home.js";
import { useLanguage } from "../i18n/useLanguage.js";
import "./Navbar.css";

const navbarSocials = socialLinks.filter(
  (link) => link.label === "LinkedIn" || link.label === "GitHub",
);

const BrandLogo = () => (
  <img
    className="logo__image"
    src="/assets/LOGO_SECONDAIRE_HANMIN_BLANC.svg"
    alt="Hanmin Park"
  />
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
  const [compact, setCompact] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const scrolledRef = useRef(false);
  const compactRef = useRef(false);

  useEffect(() => {
    let raf = 0;

    const update = () => {
      raf = 0;
      const y = window.scrollY;
      const nextScrolled = y > 60;
      const nextCompact = y > 280;

      if (nextScrolled !== scrolledRef.current) {
        scrolledRef.current = nextScrolled;
        setScrolled(nextScrolled);
      }

      if (nextCompact !== compactRef.current) {
        compactRef.current = nextCompact;
        setCompact(nextCompact);
      }
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    const settleTimers = [
      window.setTimeout(update, 250),
      window.setTimeout(update, 800),
    ];
    window.addEventListener("scroll", schedule, { passive: true });
    return () => {
      if (raf) cancelAnimationFrame(raf);
      settleTimers.forEach((timer) => window.clearTimeout(timer));
      window.removeEventListener("scroll", schedule);
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    const handlePointerDown = (event) => {
      if (!navRef.current?.contains(event.target)) setMenuOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handlePointerDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [menuOpen]);

  useEffect(() => {
    if (
      !compact &&
      menuOpen &&
      window.matchMedia("(min-width: 721px)").matches
    ) {
      setMenuOpen(false);
    }
  }, [compact, menuOpen]);

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

  const toggleMenu = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
    setMenuOpen((open) => !open);
  }, []);

  const handleMenuKeyDown = useCallback(
    (event) => {
      if (event.key === "Enter" || event.key === " ") {
        toggleMenu(event);
      }
    },
    [toggleMenu],
  );

  const renderNavLinks = () => (
    <div className="nav-links">
      {navLinks.map((link) => (
        <a href={link.href} key={link.key} onClick={closeMenu}>
          {t(`nav.${link.key}`)}
        </a>
      ))}
    </div>
  );

  const renderNavActions = () => (
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
        aria-label={lang === "en" ? "Passer en français" : "Switch to English"}
      >
        <span className={lang === "en" ? "lang-toggle__active" : ""}>EN</span>
        <span className="lang-toggle__sep">/</span>
        <span className={lang === "fr" ? "lang-toggle__active" : ""}>FR</span>
      </button>
      <a className="btn small" href="#contact" onClick={handleScrollToBottom}>
        {t("nav.letsTalk")}
      </a>
    </div>
  );

  const renderBurger = (className = "") => (
    <button
      className={`nav-burger${className ? ` ${className}` : ""}`}
      aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
      aria-expanded={menuOpen}
      onPointerDown={toggleMenu}
      onKeyDown={handleMenuKeyDown}
    >
      <span />
      <span />
      <span />
    </button>
  );

  return (
    <nav
      ref={navRef}
      className={`nav${scrolled ? " nav--scrolled" : ""}${compact ? " nav--compact" : ""}${menuOpen ? " nav--open" : ""}`}
      aria-label="Primary"
    >
      <div className="nav-shell container">
        <a className="logo" href="#top" onClick={closeMenu} aria-label="Accueil">
          <BrandLogo />
        </a>
        {renderNavLinks()}
        {renderNavActions()}
      </div>

      <div className="nav-menu">
        {renderBurger("nav-menu__button")}
        <div className="nav-panel">
          <div className="nav-panel__head">
            <a
              className="logo"
              href="#top"
              onClick={closeMenu}
              aria-label="Accueil"
            >
              <BrandLogo />
            </a>
            {renderBurger("nav-panel__button")}
          </div>
          <div className="nav-drawer">
            {renderNavLinks()}
            {renderNavActions()}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
