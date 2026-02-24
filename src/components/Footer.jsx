import { footerCopy } from '../data/home.js'
import './Footer.css'

const socials = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com', icon: '/assets/linkedinlogo.png' },
  { label: 'GitHub', href: 'https://github.com', icon: '/assets/github.svg' },
]

const Footer = () => (
  <footer className="footer">
    <div className="container footer-inner">
      <span className="footer-copy">{footerCopy}</span>
      <nav className="footer-socials" aria-label="Social links">
        {socials.map((s) => (
          <a href={s.href} key={s.label} target="_blank" rel="noopener noreferrer" aria-label={s.label}>
            <img src={s.icon} alt={s.label} />
          </a>
        ))}
      </nav>
    </div>
  </footer>
)

export default Footer
