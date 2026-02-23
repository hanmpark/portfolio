import { contact, sectionCopy } from '../data/home.js'
import './Contact.css'

const Contact = () => {
  return (
    <section className="section contact-section" id="contact">
      <div className="container contact-shell">
        <div className="contact-copy">
          <p className="eyebrow">{sectionCopy.contact.eyebrow}</p>
          <h2 className="section-title">{sectionCopy.contact.title}</h2>
          <p className="section-subtitle">{sectionCopy.contact.subtitle}</p>
        </div>

        <div className="contact-panel" aria-label="Contact actions">
          <div className="contact-panel-top">
            <span className="contact-status-dot" aria-hidden="true" />
            <p>Open to internships, junior roles, and project collaborations</p>
          </div>

          <div className="contact-primary">
            <p className="contact-label">Email</p>
            <a className="contact-email" href={`mailto:${contact.email}`}>
              {contact.email}
            </a>
          </div>

          <div className="contact-actions">
            <a className="btn contact-btn" href={`mailto:${contact.email}`}>
              Send an email
            </a>
            <a className="btn ghost contact-btn-secondary" href={contact.calendarUrl}>
              Book a call
            </a>
          </div>

          <div className="contact-meta-grid" aria-hidden="true">
            <div className="contact-meta-item">
              <span>Response</span>
              <strong>Within 48h</strong>
            </div>
            <div className="contact-meta-item">
              <span>Format</span>
              <strong>Remote / Hybrid</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact
