import './About.css'

const aboutParagraphs = [
  "I'm a software engineer focused on building robust, well-structured systems. My background at 42 shaped the way I approach problems: understanding how things work at a low level before abstracting them into clean architectures.",
  "I've worked on projects ranging from systems programming and graphics to full-stack web applications and AI-driven image analysis. I care about performance, clarity, and writing code that lasts.",
  'Beyond engineering, my background in cinema studies influences the way I think about structure, composition and user experience — combining technical depth with visual awareness.',
]

const About = () => {
  return (
    <section className="section about-section" id="about">
      <div className="container about-shell">
        <div className="about-head">
          <p className="eyebrow">About</p>
          <h2 className="section-title">About</h2>
        </div>

        <div className="about-prose" aria-label="About description">
          {aboutParagraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </div>
    </section>
  )
}

export default About
