import useScrollReveal from "../hooks/useScrollReveal.js";
import "./About.css";

const aboutParagraphs = [
  "I am Hanmin Park. I'm a software developer who enjoys building reliable, well-structured products with a strong focus on clarity and long-term maintainability.",
  "My background at 42 shaped the way I work: I like understanding systems deeply before abstracting them into clean architectures. I've worked across systems programming, graphics, full-stack web applications, and AI-driven tooling.",
  "I also studied cinema, which influences how I think about composition, rhythm, and user experience. I bring that perspective into my engineering work to build products that feel both solid and thoughtful.",
];

const highlights = [
  { label: "Systems", icon: "⚙️" },
  { label: "Full-Stack", icon: "🌐" },
  { label: "Graphics", icon: "🎨" },
  { label: "AI Tooling", icon: "🤖" },
];

const About = () => {
  const revealRef = useScrollReveal({ threshold: 0.12 });

  return (
    <section className="section abt-section" id="about" ref={revealRef}>
      <div className="container abt-inner">
        <div className="abt-content">
          <p className="eyebrow reveal reveal-up">About</p>
          <h2 className="section-title abt-title reveal reveal-up">
            Hey there !
          </h2>

          <div
            className="abt-prose reveal reveal-up"
            style={{ "--reveal-i": 1 }}
          >
            {aboutParagraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          <div
            className="abt-highlights reveal reveal-up"
            style={{ "--reveal-i": 2 }}
          >
            {highlights.map((h) => (
              <span className="abt-chip" key={h.label}>
                <span className="abt-chip-icon">{h.icon}</span>
                {h.label}
              </span>
            ))}
          </div>
        </div>

        <figure
          className="abt-portrait reveal reveal-scale"
          style={{ "--reveal-i": 3 }}
        >
          <div className="abt-portrait-glow" aria-hidden="true" />
          <img src="/assets/self_image.jpg" alt="Hanmin Park" loading="lazy" />
        </figure>
      </div>
    </section>
  );
};

export default About;
