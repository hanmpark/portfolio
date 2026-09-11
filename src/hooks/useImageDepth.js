import { useEffect } from "react";

const clamp = (value, min = -1, max = 1) => Math.min(Math.max(value, min), max);

// Measure the stable wrapper so tilting an image never feeds back into the pointer position.
export default function useImageDepth(rootRef) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const elements = root.matches("[data-image-depth]")
      ? [root]
      : [...root.querySelectorAll("[data-image-depth]")];
    const items = elements.map((element) => ({ element, x: 0, y: 0, targetX: 0, targetY: 0, progress: null, active: 0, lift: 0 }));
    let frame = 0;
    let previousTime = 0;

    const render = (time) => {
      frame = 0;
      const elapsed = previousTime ? Math.min(time - previousTime, 64) : 16;
      previousTime = time;
      const ease = 1 - Math.exp(-elapsed / 85);
      let moving = false;

      items.forEach((item) => {
        const { element } = item;
        const rect = element.getBoundingClientRect();
        const visible = rect.bottom > -100 && rect.top < window.innerHeight + 100;
        if (!visible && !reduced.matches) {
          item.x = item.y = item.targetX = item.targetY = item.active = item.lift = 0;
          item.progress = null;
          element.style.setProperty("--depth-active", "0");
          return;
        }
        const targetProgress = reduced.matches ? 0 : clamp(
          (window.innerHeight / 2 - rect.top - rect.height / 2) / ((window.innerHeight + rect.height) / 2),
        );
        if (reduced.matches || !finePointer.matches) item.targetX = item.targetY = item.active = 0;
        item.x += (item.targetX - item.x) * ease;
        item.y += (item.targetY - item.y) * ease;
        item.lift = reduced.matches ? 0 : item.lift + (item.active - item.lift) * ease;
        item.progress = item.progress === null ? targetProgress : item.progress + (targetProgress - item.progress) * ease;
        const full = element.dataset.imageDepth === "full";
        const travel = Math.min(full ? 110 : 70, rect.height * Number(element.dataset.depthTravel || (full ? 0.11 : 0.12)));
        const pointerTilt = full ? 2.5 : 8;
        const value = (name, number, unit = "") => element.style.setProperty(name, `${number.toFixed(3)}${unit}`);
        value("--depth-rotate-x", reduced.matches ? 0 : item.progress * (full ? 2 : 5) - item.y * pointerTilt, "deg");
        value("--depth-rotate-y", reduced.matches ? 0 : item.x * pointerTilt, "deg");
        value("--depth-image-x", reduced.matches ? 0 : -item.x * (full ? 20 : 12), "px");
        value("--depth-image-y", reduced.matches ? 0 : item.progress * travel - item.y * 12, "px");
        value("--depth-light-x", 50 + item.x * 35, "%");
        value("--depth-light-y", 50 + item.y * 35, "%");
        value("--depth-active", item.lift);
        moving ||= Math.abs(item.targetX - item.x) + Math.abs(item.targetY - item.y) + Math.abs(item.active - item.lift) + Math.abs(targetProgress - item.progress) > 0.002;
      });
      if (moving && !reduced.matches) frame = window.requestAnimationFrame(render);
    };

    const schedule = () => {
      if (!frame) {
        previousTime = 0;
        frame = window.requestAnimationFrame(render);
      }
    };
    const listeners = items.map((item) => {
      const move = (event) => {
        if (reduced.matches || !finePointer.matches || event.pointerType === "touch") return;
        const rect = item.element.getBoundingClientRect();
        item.targetX = clamp((event.clientX - rect.left) / rect.width * 2 - 1);
        item.targetY = clamp((event.clientY - rect.top) / rect.height * 2 - 1);
        item.active = 1;
        schedule();
      };
      const reset = () => {
        item.targetX = item.targetY = item.active = 0;
        schedule();
      };
      item.element.addEventListener("pointermove", move, { passive: true });
      item.element.addEventListener("pointerleave", reset);
      item.element.addEventListener("pointercancel", reset);
      return { element: item.element, move, reset };
    });
    const resize = new ResizeObserver(schedule);
    elements.forEach((element) => resize.observe(element));
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    reduced.addEventListener("change", schedule);
    finePointer.addEventListener("change", schedule);
    schedule();

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      resize.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      reduced.removeEventListener("change", schedule);
      finePointer.removeEventListener("change", schedule);
      listeners.forEach(({ element, move, reset }) => {
        element.removeEventListener("pointermove", move);
        element.removeEventListener("pointerleave", reset);
        element.removeEventListener("pointercancel", reset);
      });
    };
  }, [rootRef]);
}
