import Navbar from '../components/Navbar.jsx'
import { hero, heroCard, stats } from '../data/home.js'

const Hero = () => {
  return (
    <header className="hero" id="top">
      <Navbar />

      <div className="hero-grid container">
        <div className="hero-copy">
          <span className="badge">{hero.availability}</span>
          <h1 className="hero-title">{hero.title}</h1>
          <p className="hero-lede">{hero.lede}</p>
          <div className="hero-actions">
            <a className="btn" href={hero.primaryCta.href}>
              {hero.primaryCta.label}
            </a>
            <a className="btn ghost" href={hero.secondaryCta.href}>
              {hero.secondaryCta.label}
            </a>
          </div>
          <div className="stats">
            {stats.map((stat) => (
              <div className="stat" key={stat.label}>
                <span className="stat-value">{stat.value}</span>
                <span className="stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="hero-card">
          <p className="eyebrow">{heroCard.eyebrow}</p>
          <h3>{heroCard.title}</h3>
          <p>{heroCard.description}</p>
          <div className="hero-card-tags">
            {heroCard.tags.map((tag) => (
              <span className="pill" key={tag}>
                {tag}
              </span>
            ))}
          </div>
          <div className="hero-card-footer">
            <span>{heroCard.timelineLabel}</span>
            <strong>{heroCard.timelineValue}</strong>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Hero
