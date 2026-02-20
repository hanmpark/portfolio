import { navLinks } from '../data/home.js'
import './Navbar.css'

const Navbar = () => {
  return (
    <nav className="nav container" aria-label="Primary">
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
