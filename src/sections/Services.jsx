import { sectionCopy, services } from '../data/home.js'

const Services = () => {
  return (
    <section className="section" id="services">
      <div className="container section-head">
        <div>
          <p className="eyebrow">{sectionCopy.services.eyebrow}</p>
          <h2 className="section-title">{sectionCopy.services.title}</h2>
        </div>
        <p className="section-subtitle">{sectionCopy.services.subtitle}</p>
      </div>
      <div className="container service-grid">
        {services.map((service) => (
          <article className="card service-card" key={service.title}>
            <h3>{service.title}</h3>
            <p>{service.description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default Services
