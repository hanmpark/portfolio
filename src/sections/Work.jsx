import { projects, sectionCopy } from '../data/home.js'
import './Work.css'

const Work = () => {
  return (
    <section className="section" id="work">
      <div className="container section-head">
        <div>
          <p className="eyebrow">{sectionCopy.work.eyebrow}</p>
          <h2 className="section-title">{sectionCopy.work.title}</h2>
        </div>
        <p className="section-subtitle">{sectionCopy.work.subtitle}</p>
      </div>
      <div className="container project-grid">
        {projects.map((project, index) => (
          <article
            className="card project-card"
            style={{ '--delay': `${index * 0.08}s` }}
            key={project.title}
          >
            <div className="project-meta">
              <span className="project-year">{project.year}</span>
              <span className="project-title">{project.title}</span>
            </div>
            <p>{project.description}</p>
            <div className="tag-row">
              {project.tags.map((tag) => (
                <span className="pill" key={tag}>
                  {tag}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default Work
