import { useEffect, useRef, useState } from 'react'
import { experiences, sectionCopy } from '../data/home.js'
import './Experience.css'

const clamp = (value, min, max) => Math.min(Math.max(value, min), max)

const Experience = () => {
  const sectionRef = useRef(null)
  const listRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [revealedCards, setRevealedCards] = useState(() => new Set())

  useEffect(() => {
    const cards = listRef.current?.querySelectorAll('.experience-card')
    if (!cards?.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return

          const index = Number(entry.target.getAttribute('data-index'))
          if (!Number.isNaN(index)) {
            setRevealedCards((previous) => {
              if (previous.has(index)) return previous

              const next = new Set(previous)
              next.add(index)
              return next
            })
          }

          observer.unobserve(entry.target)
        })
      },
      { threshold: 0.14, rootMargin: '0px 0px -8% 0px' },
    )

    cards.forEach((card) => observer.observe(card))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const sectionEl = sectionRef.current
    const listEl = listRef.current
    const cards = listEl ? Array.from(listEl.querySelectorAll('.experience-card')) : []
    if (!sectionEl || !cards.length) return

    let rafId = 0

    const updateFrame = () => {
      rafId = 0

      const sectionRect = sectionEl.getBoundingClientRect()
      const viewportHeight = window.innerHeight || 1
      const anchorY = viewportHeight * 0.46

      const sectionProgress = clamp(
        (viewportHeight - sectionRect.top) / (sectionRect.height + viewportHeight),
        0,
        1,
      )

      sectionEl.style.setProperty('--experience-scroll', sectionProgress.toFixed(4))

      let nextActiveIndex = 0
      let bestDistance = Number.POSITIVE_INFINITY

      cards.forEach((card, index) => {
        const rect = card.getBoundingClientRect()
        const centerY = rect.top + rect.height / 2
        const rawDistance = centerY - anchorY
        const distance = Math.abs(rawDistance)
        const normalizedOffset = clamp(rawDistance / (viewportHeight * 0.68), -1.1, 1.1)
        const proximity = 1 - clamp(distance / (viewportHeight * 0.82), 0, 1)

        card.style.setProperty('--scroll-offset', normalizedOffset.toFixed(4))
        card.style.setProperty('--scroll-proximity', proximity.toFixed(4))

        if (distance < bestDistance) {
          bestDistance = distance
          nextActiveIndex = index
        }
      })

      setActiveIndex((currentIndex) =>
        currentIndex === nextActiveIndex ? currentIndex : nextActiveIndex,
      )

      if (cards.length > 1) {
        const firstRect = cards[0].getBoundingClientRect()
        const lastRect = cards.at(-1)?.getBoundingClientRect()

        if (lastRect) {
          const firstCenter = firstRect.top + firstRect.height / 2
          const lastCenter = lastRect.top + lastRect.height / 2
          const span = Math.max(lastCenter - firstCenter, 1)
          const lineProgress = clamp((anchorY - firstCenter) / span, 0, 1)

          sectionEl.style.setProperty('--experience-line-progress', lineProgress.toFixed(4))
        }
      } else {
        sectionEl.style.setProperty('--experience-line-progress', '1')
      }
    }

    const scheduleUpdate = () => {
      if (rafId) return
      rafId = window.requestAnimationFrame(updateFrame)
    }

    updateFrame()

    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate)

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId)
      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)
    }
  }, [])

  return (
    <section className="section experience-section" id="experience" ref={sectionRef}>
      <div className="container section-head experience-head">
        <div>
          <p className="eyebrow">{sectionCopy.experience.eyebrow}</p>
          <h2 className="section-title">{sectionCopy.experience.title}</h2>
        </div>
        <p className="section-subtitle">{sectionCopy.experience.subtitle}</p>
      </div>

      <div className="container experience-shell">
        <div className="experience-list" ref={listRef}>
          {experiences.map((item, index) => {
            const delta = index - activeIndex
            const distance = Math.abs(delta)
            const isActive = index === activeIndex
            const isVisible = revealedCards.has(index)
            const cardMeta = [item.period, item.location].filter(Boolean)

            return (
              <article
                className={`experience-card${isActive ? ' is-active' : ''}${isVisible ? ' is-visible' : ''}`}
                data-index={index}
                key={`${item.company}-${item.role}`}
                style={{
                  '--delta': String(delta),
                  '--distance': String(distance),
                }}
              >
                <span className="experience-marker" aria-hidden="true" />

                <div className="experience-card-shell">
                  <span className="experience-card-index" aria-hidden="true">
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  {item.image ? (
                    <figure className="experience-card-visual">
                      <img
                        src={item.image}
                        alt={item.imageAlt ?? `${item.company} logo`}
                        loading="lazy"
                      />
                    </figure>
                  ) : null}

                  <div className="experience-card-head">
                    <div>
                      <p className="experience-card-role">{item.role}</p>
                      <p className="experience-card-company">{item.company}</p>
                    </div>

                    {cardMeta.length ? (
                      <div className="experience-card-meta">
                        {cardMeta.map((value) => (
                          <span key={value}>{value}</span>
                        ))}
                      </div>
                    ) : null}
                  </div>

                  <p className="experience-card-summary">{item.summary}</p>

                  {item.highlights?.length ? (
                    <ul className="experience-card-highlights">
                      {item.highlights.map((highlight) => (
                        <li key={highlight}>{highlight}</li>
                      ))}
                    </ul>
                  ) : null}

                  {item.stack?.length ? (
                    <div className="tag-row experience-card-tags">
                      {item.stack.map((tag) => (
                        <span className="pill" key={tag}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Experience
