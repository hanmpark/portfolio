import { contact, sectionCopy } from '../data/home.js'
import './Contact.css'

const Contact = () => {
  return (
    <section className="section" id="contact">
      <div className="container contact-card">
        <div>
          <p className="eyebrow">{sectionCopy.contact.eyebrow}</p>
          <h2 className="section-title">{sectionCopy.contact.title}</h2>
          <p className="section-subtitle">{sectionCopy.contact.subtitle}</p>
        </div>
        <div className="contact-actions">
          <a className="btn" href={`mailto:${contact.email}`}>
            Email {contact.email}
          </a>
          <a className="btn ghost" href={contact.calendarUrl}>
            Book a call
          </a>
        </div>
      </div>
    </section>
  )
}

export default Contact
