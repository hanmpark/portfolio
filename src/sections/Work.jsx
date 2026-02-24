import { useEffect, useRef } from 'react'
import { projects } from '../data/home.js'
import useScrollReveal from '../hooks/useScrollReveal.js'
import './Work.css'

const Work = () => {
  const sectionRef = useRef(null)
  const headRef = useScrollReveal({ threshold: 0.15, selector: '.reveal' })

  /* Scroll-driven parallax on accent images */
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    let raf = 0

    const update = () => {
      raf = 0
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight || 1
      const progress = Math.min(Math.max((vh - rect.top) / (rect.height + vh), 0), 1)
      el.style.setProperty('--section-scroll', progress.toFixed(4))
    }

    const schedule = () => { if (!raf) raf = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', schedule, { passive: true })
    return () => {
      if (raf) cancelAnimationFrame(raf)
      window.removeEventListener('scroll', schedule)
    }
  }, [])

  return (
    <section className="section work-section" id="work" ref={sectionRef}>
      {/* Floating accent images */}
      <img
        className="work-accent work-accent--1"
        src="/assets/premium/fig5.png"
        alt=""
        aria-hidden="true"
      />
      <img
        className="work-accent work-accent--2"
        src="/assets/premium/fig6.png"
        alt=""
        aria-hidden="true"
      />

      <div className="container work-inner" ref={headRef}>
        <header className="work-head">
          <p className="eyebrow reveal reveal-up">Selected work</p>
          <h2 className="section-title reveal reveal-up">Projects</h2>
        </header>

        <div className="work-grid reveal-stagger">
          {projects.map((project, index) => (
            <article
              className="work-card reveal reveal-up"
              style={{ '--reveal-i': index }}
              key={project.title}
            >
              <figure className="work-card-img">
                <img
                  src={project.previewImage}
                  alt={`${project.title} preview`}
                  loading="lazy"
                />
              </figure>

              <div className="work-card-body">
                <span className="work-card-number">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="work-card-title">{project.title}</h3>
                <p className="work-card-subtitle">{project.subtitle}</p>

                {project.tags?.length ? (
                  <div className="tag-row">
                    {project.tags.map((tag) => (
                      <span className="pill" key={tag}>{tag}</span>
                    ))}
                  </div>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Work
