import { contact, sectionCopy } from '../data/home.js'
import useScrollReveal from '../hooks/useScrollReveal.js'
import './Contact.css'

const Contact = () => {
  const sectionRef = useScrollReveal({ threshold: 0.15 })

  return (
    <section className="section ct-section" id="contact" ref={sectionRef}>
      <div className="container ct-inner">
        <p className="eyebrow reveal reveal-up">{sectionCopy.contact.eyebrow}</p>
        <h2 className="section-title ct-title reveal reveal-up">
          {sectionCopy.contact.title}
        </h2>
        <p className="ct-sub reveal reveal-up" style={{ '--reveal-i': 1 }}>
          {sectionCopy.contact.subtitle}
        </p>

        <div className="ct-actions reveal reveal-up" style={{ '--reveal-i': 2 }}>
          <a className="btn ct-btn" href={`mailto:${contact.email}`}>
            Send an email
          </a>
          <a className="btn ghost ct-btn" href={contact.calendarUrl}>
            Book a call
          </a>
        </div>

        <a className="ct-email reveal reveal-up" href={`mailto:${contact.email}`} style={{ '--reveal-i': 3 }}>
          {contact.email}
        </a>
      </div>
    </section>
  )
}

export default Contact
