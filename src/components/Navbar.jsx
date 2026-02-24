import { useEffect, useRef, useState } from 'react'
import { navLinks } from '../data/home.js'
import './Navbar.css'

const Navbar = () => {
  const navRef = useRef(null)
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const lastY = useRef(0)

  useEffect(() => {
    let raf = 0

    const update = () => {
      raf = 0
      const y = window.scrollY
      setScrolled(y > 60)
      setHidden(y > 300 && y > lastY.current)
      lastY.current = y
    }

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }

    window.addEventListener('scroll', schedule, { passive: true })
    return () => {
      if (raf) cancelAnimationFrame(raf)
      window.removeEventListener('scroll', schedule)
    }
  }, [])

  return (
    <nav
      ref={navRef}
      className={`nav container${scrolled ? ' nav--scrolled' : ''}${hidden ? ' nav--hidden' : ''}`}
      aria-label="Primary"
    >
      <a className="logo" href="#top">
        Hanm Park
      </a>
      <div className="nav-links">
        {navLinks.map((link) => (
          <a href={link.href} key={link.label}>
            {link.label}
          </a>
        ))}
      </div>
      <a className="btn small" href="#contact">
        Let&apos;s talk
      </a>
    </nav>
  )
}

export default Navbar
