import { footerCopy, socialLinks } from '../data/home.js'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <span>{footerCopy}</span>
        <div className="footer-links">
          {socialLinks.map((link) => (
            <a href={link.href} key={link.label}>
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}

export default Footer
