import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../i18n/useLanguage.js";
import useScrollReveal from "../hooks/useScrollReveal.js";
import "./About.css";

const highlightKeys = ["systems", "fullStack", "graphics", "aiTooling"];

const testimonialCompanies = {
  proptexx: { logo: "/assets/experiences/proptexx.webp", name: "PropTexx" },
  theGoodCleaners: { logo: "/assets/experiences/thegoodcleaners.png", name: "The Good Cleaners" },
};

const testimonialLogo = (company) => {
  const details = testimonialCompanies[company];
  if (!details) return null;

  return (
    <img
      className={`abt-testimonial-logo abt-testimonial-logo--${company}`}
      src={details.logo}
      alt={details.name}
      width="112"
      height="36"
      loading="lazy"
      decoding="async"
    />
  );
};

const testimonialWords = (quote) => quote.split(" ").map((word, index) => (
  <span className="abt-testimonial-word" key={`${word}-${index}`}>
    <span style={{ "--word-index": index }}>{word}</span>
  </span>
));

const About = () => {
  const { t } = useLanguage();
  const revealRef = useScrollReveal({ threshold: 0.04, rootMargin: "0px 0px 80px 0px", selector: ".reveal" });
  const paragraphs = t("about.paragraphs");
  const safeParagraphs = Array.isArray(paragraphs) ? paragraphs : [];
  const [leadParagraph = ""] = safeParagraphs;
  const testimonials = t("testimonials.items");
  const testimonialItems = Array.isArray(testimonials) ? testimonials : [];
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [carouselPaused, setCarouselPaused] = useState(false);
  const highlightRef = useRef(null);

  useEffect(() => {
    if (testimonialItems.length < 2 || carouselPaused) return undefined;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) return undefined;

    const interval = window.setInterval(() => {
      setActiveTestimonial((current) =>
        (current + 1) % testimonialItems.length,
      );
    }, 6500);

    return () => window.clearInterval(interval);
  }, [carouselPaused, testimonialItems.length]);

  useEffect(() => {
    const heading = highlightRef.current;
    if (!heading) return undefined;

    const characters = Array.from(
      heading.querySelectorAll(".abt-highlight-char"),
    );
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let measureCharacters = true;
    let characterOffsets = [];

    const clamp = (value) => Math.min(Math.max(value, 0), 1);
    const smoothstep = (value) => value * value * (3 - 2 * value);

    const updateHighlight = () => {
      frame = 0;

      if (reducedMotion.matches) {
        characters.forEach((character) => {
          character.style.setProperty("--char-opacity", "1");
        });
        return;
      }

      const rect = heading.getBoundingClientRect();
      if (measureCharacters) {
        // Follow the rendered lines so the light travels from top left to bottom right.
        const positions = characters.map((character) => {
          const characterRect = character.getBoundingClientRect();
          return (characterRect.left - rect.left) / Math.max(rect.width, 1)
            + (characterRect.top - rect.top) / Math.max(rect.height, 1);
        });
        const first = Math.min(...positions);
        const distance = Math.max(Math.max(...positions) - first, 1e-6);
        characterOffsets = positions.map((position) => (position - first) / distance * 0.58);
        measureCharacters = false;
      }
      const viewportHeight = Math.max(window.innerHeight, 1);
      // Begin slightly above the viewport center and finish at the top edge.
      const startTop = viewportHeight * 0.6;
      const progress = clamp((startTop - rect.top) / Math.max(startTop, 1));
      characters.forEach((character, index) => {
        const characterOffset = characterOffsets[index];
        const reveal = smoothstep(clamp((progress - characterOffset) / 0.42));
        character.style.setProperty(
          "--char-opacity",
          (0.35 + reveal * 0.65).toFixed(3),
        );
      });
    };

    const requestUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updateHighlight);
    };
    const requestMeasure = () => {
      measureCharacters = true;
      requestUpdate();
    };
    const resizeObserver = new ResizeObserver(requestMeasure);
    resizeObserver.observe(heading);

    updateHighlight();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestMeasure);
    document.fonts.addEventListener("loadingdone", requestMeasure);
    reducedMotion.addEventListener("change", requestUpdate);

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestMeasure);
      document.fonts.removeEventListener("loadingdone", requestMeasure);
      resizeObserver.disconnect();
      reducedMotion.removeEventListener("change", requestUpdate);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [leadParagraph]);

  useEffect(() => {
    const section = revealRef.current;
    if (!section) return undefined;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;

    const clamp = (value) => Math.min(Math.max(value, 0), 1);
    const smoothstep = (value) => value * value * (3 - 2 * value);

    const updateDepthTransition = () => {
      frame = 0;

      if (reducedMotion.matches) {
        section.style.removeProperty("--abt-depth-y");
        section.style.removeProperty("--abt-depth-scale");
        section.style.removeProperty("--abt-depth-opacity");
        return;
      }

      const work = document.getElementById("work");
      if (!work) return;

      const viewportHeight = Math.max(window.innerHeight, 1);
      const workTop = work.getBoundingClientRect().top;
      const progress = clamp((viewportHeight - workTop) / viewportHeight);
      const easedProgress = smoothstep(progress);
      const fade = 1 - smoothstep(clamp((progress - 0.08) / 0.82));

      section.style.setProperty(
        "--abt-depth-y",
        `${(easedProgress * 22).toFixed(2)}vh`,
      );
      section.style.setProperty(
        "--abt-depth-scale",
        (1 - easedProgress * 0.035).toFixed(4),
      );
      section.style.setProperty("--abt-depth-opacity", fade.toFixed(3));
    };

    const requestUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updateDepthTransition);
    };

    updateDepthTransition();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    reducedMotion.addEventListener("change", requestUpdate);

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      reducedMotion.removeEventListener("change", requestUpdate);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [revealRef]);

  const currentTestimonial = testimonialItems[
    activeTestimonial % Math.max(testimonialItems.length, 1)
  ];
  const [portraitName = "", ...portraitRoleParts] = String(
    t("about.portraitCaption"),
  ).split(" — ");
  const portraitRole = portraitRoleParts.join(" — ");

  const showPreviousTestimonial = () => {
    setActiveTestimonial((current) =>
      (current - 1 + testimonialItems.length) % testimonialItems.length,
    );
  };

  const showNextTestimonial = () => {
    setActiveTestimonial((current) =>
      (current + 1) % testimonialItems.length,
    );
  };

  const resumeCarouselOnBlur = (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setCarouselPaused(false);
    }
  };

  return (
    <section className="section abt-section" id="about" aria-labelledby="about-title" ref={revealRef}>
      <div className="container abt-depth-content">
        <div className="abt-statement">

          <div className="abt-statement-copy">
            <p className="eyebrow reveal reveal-up">{t("about.eyebrow")}</p>
            <h2
              id="about-title"
              className="abt-scroll-heading"
              ref={highlightRef}
              aria-label={leadParagraph}
            >
              <span className="abt-highlight-words" aria-hidden="true">
                {leadParagraph.split(" ").map((word, wordIndex, words) => (
                  <span key={`${word}-${wordIndex}`}>
                    <span className="abt-highlight-word">
                      {Array.from(word).map((character, characterIndex) => (
                        <span
                          className="abt-highlight-char"
                          key={`${character}-${characterIndex}`}
                        >
                          {character}
                        </span>
                      ))}
                    </span>
                    {wordIndex < words.length - 1 ? " " : null}
                  </span>
                ))}
              </span>
            </h2>
          </div>
          <figure className="abt-portrait reveal reveal-up">
            <div className="abt-portrait-media">
              <img src="/assets/self_image.jpg" alt="Hanmin Park" decoding="async" loading="lazy" />
            </div>
            <figcaption>
              <span>{portraitName}</span>
              {portraitRole ? <span>{portraitRole}</span> : null}
            </figcaption>
          </figure>
        </div>

        <div className="abt-layout">
          {currentTestimonial ? (
            <aside
              className="abt-testimonial-carousel reveal reveal-up"
              aria-label={t("testimonials.label")}
              style={{
                "--testimonial-progress": `${((activeTestimonial + 1) / testimonialItems.length) * 100}%`,
              }}
              onMouseEnter={() => setCarouselPaused(true)}
              onMouseLeave={() => setCarouselPaused(false)}
              onFocusCapture={() => setCarouselPaused(true)}
              onBlurCapture={resumeCarouselOnBlur}
            >
              <div className="abt-testimonial-head">
                <span>{t("testimonials.label")}</span>
                <span>
                  {String(activeTestimonial + 1).padStart(2, "0")} /{" "}
                  {String(testimonialItems.length).padStart(2, "0")}
                </span>
              </div>

              <div className="abt-testimonial-progress" aria-hidden="true">
                <span />
              </div>

              <div
                className="abt-testimonial-body"
                aria-live="polite"
                key={`${activeTestimonial}-${currentTestimonial.name}`}
              >
                <blockquote aria-label={currentTestimonial.quote}>
                  <span aria-hidden="true">
                    {testimonialWords(currentTestimonial.quote)}
                  </span>
                </blockquote>
                {testimonialItems.map((item) => (
                  <blockquote className="abt-testimonial-sizer" aria-hidden="true" key={item.name}>
                    <span>{testimonialWords(item.quote)}</span>
                  </blockquote>
                ))}
              </div>

              <div
                className="abt-testimonial-footer"
                key={`${activeTestimonial}-${currentTestimonial.name}-footer`}
              >
                <div className="abt-testimonial-authors">
                  <div className="abt-testimonial-author">
                    {testimonialLogo(currentTestimonial.company)}
                    <strong>{currentTestimonial.name}</strong>
                    <span>{currentTestimonial.role}</span>
                  </div>
                  {testimonialItems.map((item) => (
                    <div className="abt-testimonial-author abt-testimonial-sizer" aria-hidden="true" key={item.name}>
                      {testimonialLogo(item.company)}
                      <strong>{item.name}</strong>
                      <span>{item.role}</span>
                    </div>
                  ))}
                </div>

                <div className="abt-testimonial-controls">
                  <button
                    type="button"
                    onClick={showPreviousTestimonial}
                    aria-label={t("testimonials.previous")}
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    onClick={showNextTestimonial}
                    aria-label={t("testimonials.next")}
                  >
                    →
                  </button>
                </div>
              </div>
            </aside>
          ) : null}

          <div className="abt-highlights reveal reveal-up">
              <p>{t("about.expertise")}</p>
              <div>
                {highlightKeys.map((key, index) => (
                  <span key={key}><i>{String(index + 1).padStart(2, "0")}</i>{t(`about.highlights.${key}`)}</span>
                ))}
              </div>
            </div>
        </div>
      </div>
    </section>
  );
};

export default About;
