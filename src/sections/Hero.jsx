import { useEffect, useRef } from 'react'
import Navbar from '../components/Navbar.jsx'
import './Hero.css'

const Hero = () => {
  const heroRef = useRef(null)
  const frameRef = useRef(0)
  const pointerRef = useRef({ x: 0, y: 0 })

  const flushPointer = () => {
    frameRef.current = 0

    const hero = heroRef.current
    if (!hero) return

    hero.style.setProperty('--pointer-x', pointerRef.current.x.toFixed(3))
    hero.style.setProperty('--pointer-y', pointerRef.current.y.toFixed(3))
  }

  const queuePointer = (x, y) => {
    pointerRef.current = { x, y }
    if (frameRef.current) return
    frameRef.current = window.requestAnimationFrame(flushPointer)
  }

  const handleMouseMove = (event) => {
    const hero = heroRef.current
    if (!hero) return

    const rect = hero.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2

    queuePointer(x, y)
  }

  const handleMouseLeave = () => {
    queuePointer(0, 0)
  }

  useEffect(
    () => () => {
      if (frameRef.current) {
        window.cancelAnimationFrame(frameRef.current)
      }
    },
    []
  )

  return (
    <header
      className="hero"
      id="top"
      ref={heroRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="hero-figures" aria-hidden="true">
        <img className="hero-fig hero-fig-1" src="/assets/premium/fig1.png" alt="" />
        <img className="hero-fig hero-fig-2" src="/assets/premium/fig2.png" alt="" />
        <img className="hero-fig hero-fig-3" src="/assets/premium/fig3.png" alt="" />
        <img className="hero-fig hero-fig-4" src="/assets/premium/fig4.png" alt="" />
      </div>

      <Navbar />

      <div className="hero-grid container">
        <div className="hero-copy">
          <h1 className="hero-title">
            <span className="hero-title-name">Hanmin Park</span>
            <span className="hero-title-role">Software Engineer</span>
          </h1>
          <p className="hero-template">
            <span className="hero-template-lead">
              I build reliable products from concept to production.
            </span>
          </p>
        </div>
      </div>
    </header>
  )
}

export default Hero
