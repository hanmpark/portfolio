import { aboutNote, processSteps, sectionCopy, toolkit } from '../data/home.js'

const About = () => {
  return (
    <section className="section" id="about">
      <div className="container about-grid">
        <div>
          <p className="eyebrow">{sectionCopy.about.eyebrow}</p>
          <h2 className="section-title">{sectionCopy.about.title}</h2>
          <p className="section-subtitle">{sectionCopy.about.subtitle}</p>
          <div className="process-list">
            {processSteps.map((step) => (
              <div className="process-item" key={step.title}>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="about-card">
          <h3>Toolkit</h3>
          <p>Tools and platforms I reach for when turning strategy into shipped UI.</p>
          <div className="tag-row">
            {toolkit.map((tool) => (
              <span className="pill" key={tool}>
                {tool}
              </span>
            ))}
          </div>
          <div className="about-note">
            <p className="eyebrow">{aboutNote.eyebrow}</p>
            <p>{aboutNote.text}</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
