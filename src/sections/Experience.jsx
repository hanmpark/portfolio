import {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
  Fragment,
} from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { experiences } from "../data/home.js";
import { useLanguage } from "../i18n/useLanguage.js";
import useScrollReveal from "../hooks/useScrollReveal.js";
import "./Experience.css";

const workItems = experiences.filter((e) => e.category === "Experience");
const eduItems = experiences.filter((e) => e.category === "Education");
/* Chronological order: oldest first (data is newest-first) */
const allItems = [...experiences].reverse();

/* ── Generate smooth S-curve path with overflow ──── */
const OVERFLOW_TOP = 120;
const OVERFLOW_BOTTOM = 120;

function buildTimelinePath(height, count) {
  const cx = 100; // center x in 200-unit viewBox
  const amp = 70; // wave amplitude
  const segH = height / count;
  const totalH = height + OVERFLOW_TOP + OVERFLOW_BOTTOM;

  // Start at center, just above the cards
  let d = `M ${cx} ${-OVERFLOW_TOP}`;

  // Main S-curves through the cards
  for (let i = 0; i < count; i++) {
    const dir = i % 2 === 0 ? -1 : 1;
    d += ` Q ${cx + dir * amp} ${(segH * (i + 0.5)).toFixed(1)} ${cx} ${(
      segH *
      (i + 1)
    ).toFixed(1)}`;
  }

  // End at center, just below the cards
  d += ` L ${cx} ${height + OVERFLOW_BOTTOM}`;

  return { d, totalH };
}

/* ── Card ────────────────────────────────────────── */
const Card = ({ item, index, l, showMarker = true }) => (
  <article
    className="exp-card reveal reveal-up"
    style={{ "--reveal-i": index, "--card-i": index }}
  >
    <div className="exp-card-accent" aria-hidden="true" />
    {showMarker && (
      <span className="exp-marker" aria-hidden="true">
        <span className="exp-marker-ping" />
      </span>
    )}
    <div className="exp-card-inner">
      <div className="exp-card-top">
        {item.image && (
          <figure
            className={`exp-logo${
              item.logoVariant ? ` exp-logo--${item.logoVariant}` : ""
            }`}
          >
            <img src={item.image} alt={item.imageAlt ?? ""} loading="lazy" />
          </figure>
        )}
        <div>
          <p className="exp-role">{l(item, "role")}</p>
          <p className="exp-company">{item.company}</p>
          {item.period ? (
            <p className="exp-period">{l(item, "period")}</p>
          ) : null}
        </div>
      </div>
      <p className="exp-summary">{l(item, "focus")}</p>
      {item.stack?.length ? (
        <div className="tag-row exp-tags">
          {item.stack.map((tag) => (
            <span className="pill" key={tag}>
              {tag}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  </article>
);

/* ── Desktop SVG path + travelling dot ───────────── */
const cx = 100;

const PathTimeline = ({ smoothProgress, wrapRef }) => {
  const pathRef = useRef(null);
  const [containerH, setContainerH] = useState(1000);
  const [pathLen, setPathLen] = useState(0);
  const [dotPos, setDotPos] = useState({ x: 100, y: 0 });

  /* Track container height so path scales to content */
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const update = () => setContainerH(el.clientHeight || 1000);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [wrapRef]);

  /* Rebuild path data when height changes */
  const { d: pathD, totalH } = useMemo(
    () => buildTimelinePath(containerH, allItems.length),
    [containerH],
  );

  /* Measure path length whenever path data changes */
  useEffect(() => {
    const p = pathRef.current;
    if (!p) return;
    setPathLen(p.getTotalLength());
  }, [pathD]);

  /* Move dot along path as user scrolls */
  useEffect(() => {
    const p = pathRef.current;
    if (!p || pathLen === 0) return;
    return smoothProgress.on("change", (v) => {
      const pt = p.getPointAtLength(pathLen * v);
      setDotPos({ x: pt.x, y: pt.y });
    });
  }, [smoothProgress, pathLen]);

  return (
    <svg
      className="exp-path-svg"
      viewBox={`0 ${-OVERFLOW_TOP} 200 ${totalH}`}
      style={{
        top: `-${OVERFLOW_TOP}px`,
        height: `calc(100% + ${OVERFLOW_TOP + OVERFLOW_BOTTOM}px)`,
      }}
      aria-hidden="true"
    >
      <defs>
        <filter id="exp-glow" x="-200%" y="-200%" width="500%" height="500%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Hidden path for measurement */}
      <path ref={pathRef} d={pathD} fill="none" stroke="none" />

      {/* Wide ambient glow — always visible */}
      <path
        d={pathD}
        fill="none"
        stroke="rgba(200,215,240,0.04)"
        strokeWidth="28"
        strokeLinecap="round"
      />

      {/* Main stroke — draws on scroll */}
      <motion.path
        d={pathD}
        fill="none"
        stroke="rgba(200,215,240,0.12)"
        strokeWidth="2"
        strokeLinecap="round"
        style={{ pathLength: smoothProgress }}
      />

      {/* Center dashes — draws on scroll */}
      <motion.path
        d={pathD}
        fill="none"
        stroke="rgba(200,215,240,0.06)"
        strokeWidth="1"
        strokeLinecap="round"
        strokeDasharray="8 14"
        style={{ pathLength: smoothProgress }}
      />

      {/* Dot — outer halo */}
      <circle
        cx={dotPos.x}
        cy={dotPos.y}
        r="16"
        fill="rgba(200,215,240,0.05)"
      />
      {/* Dot — core */}
      <circle
        cx={dotPos.x}
        cy={dotPos.y}
        r="6"
        fill="rgba(200,215,240,0.8)"
        filter="url(#exp-glow)"
      />
    </svg>
  );
};

/* ── Experience section ──────────────────────────── */
const Experience = () => {
  const { t, l } = useLanguage();
  const sectionRef = useRef(null);
  const wrapRef = useRef(null);
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== "undefined" && window.innerWidth >= 1024,
  );

  /* Match-media listener for responsive switching */
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const handler = (e) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  /* Scroll progress for the section */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
  });

  /* Intersection-observer reveal */
  const revealRef = useScrollReveal({
    threshold: 0.05,
    rootMargin: "0px 0px 100px 0px",
    selector: ".reveal",
  });

  /* Merge framer-motion ref + scroll-reveal ref */
  const mergedRef = useCallback(
    (node) => {
      sectionRef.current = node;
      if (typeof revealRef === "object") revealRef.current = node;
    },
    [revealRef],
  );

  return (
    <section className="section exp-section" id="experience" ref={mergedRef}>
      <div className="container exp-inner">
        <header className="exp-head">
          <p className="eyebrow reveal reveal-up">{t("experience.eyebrow")}</p>
          <h2 className="section-title reveal reveal-up">
            {t("experience.title")}
          </h2>
        </header>

        {/* ── Desktop: path timeline ──────────────── */}
        {isDesktop ? (
          <div className="exp-path-wrap exp-path-wrap--overflow" ref={wrapRef}>
            <PathTimeline smoothProgress={smoothProgress} wrapRef={wrapRef} />

            <div className="exp-path-grid">
              {allItems.map((item, i) => {
                const side = i % 2 === 0 ? "left" : "right";
                return (
                  <Fragment key={`${item.company}-${item.role}`}>
                    <div
                      className={`exp-path-item exp-path-item--${side}`}
                      style={{ gridRow: i + 1 }}
                    >
                      <Card item={item} index={i} l={l} showMarker={false} />
                    </div>

                    <div
                      className="exp-path-node reveal reveal-scale"
                      style={{ gridRow: i + 1, "--reveal-i": i }}
                    >
                      <span className="exp-path-icon">
                        {item.category === "Experience" ? "💼" : "🎓"}
                      </span>
                    </div>
                  </Fragment>
                );
              })}
            </div>
          </div>
        ) : (
          /* ── Mobile / tablet: two-column layout ── */
          <div className="exp-columns reveal-stagger">
            <div className="exp-col">
              <h3 className="exp-col-title reveal reveal-up">
                <span className="exp-col-icon">🎓</span>
                {t("experience.educationCol")}
              </h3>
              <div className="exp-timeline reveal-stagger">
                {[...eduItems].reverse().map((item, i) => (
                  <Card
                    item={item}
                    index={i}
                    l={l}
                    key={`${item.company}-${item.role}`}
                  />
                ))}
              </div>
            </div>

            <div className="exp-col">
              <h3 className="exp-col-title reveal reveal-up">
                <span className="exp-col-icon">💼</span>
                {t("experience.experienceCol")}
              </h3>
              <div className="exp-timeline reveal-stagger">
                {[...workItems].reverse().map((item, i) => (
                  <Card
                    item={item}
                    index={i + eduItems.length}
                    l={l}
                    key={`${item.company}-${item.role}`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Experience;
