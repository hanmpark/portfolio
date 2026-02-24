import { useEffect, useRef, useState, useCallback } from "react";
import { navLinks, socialLinks } from "../data/home.js";
import "./Navbar.css";

const navbarSocials = socialLinks.filter(
  (link) => link.label === "LinkedIn" || link.label === "GitHub",
);

const Navbar = () => {
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
            <a href={link.href} key={link.label} onClick={closeMenu}>
              {link.label}
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
              >
                {link.label}
              </a>
            ))}
          </div>
          <a
            className="btn small"
            href="#contact"
            onClick={handleScrollToBottom}
          >
            Let&apos;s talk
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
