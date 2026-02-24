import { useEffect, useRef } from "react";

const ScrollProgress = () => {
  const barRef = useRef(null);

  useEffect(() => {
    let raf = 0;

    const update = () => {
      raf = 0;
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0;
      barRef.current?.style.setProperty(
        "--scroll-progress",
        progress.toFixed(4),
      );
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return <div className="scroll-progress" ref={barRef} aria-hidden="true" />;
};

export default ScrollProgress;
