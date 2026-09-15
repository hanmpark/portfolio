import { useEffect, useRef } from "react";
import * as THREE from "three";

const fragmentShader = `
  varying vec2 vUv;
  uniform float uTime;
  uniform float uAspect;

  float surface(vec2 p) {
    float t = uTime * 0.07;
    p += 0.65 * vec2(sin(p.y * 1.8 + t), cos(p.x * 1.35 - t));
    return sin(p.x * 1.9 + p.y * 0.65 + t)
      + 0.65 * sin(p.y * 2.3 - p.x * 0.8 - t * 0.7)
      + 0.22 * sin(p.x * 3.7 + p.y * 2.1 + t * 0.5);
  }

  void main() {
    vec2 p = (vUv - 0.5) * vec2(uAspect, 1.0) * 3.0;
    float h = surface(p);
    vec2 slope = vec2(surface(p + vec2(0.003, 0.0)) - h,
                      surface(p + vec2(0.0, 0.003)) - h) / 0.003;
    vec3 normal = normalize(vec3(-slope * 0.65, 1.0));
    vec3 ray = reflect(vec3(0.0, 0.0, -1.0), normal);
    // Broad studio strips reflected by a continuously flowing metal surface.
    float band = dot(ray, normalize(vec3(0.2, 0.9, 0.4)));
    float silver = smoothstep(0.12, 0.24, band) * (1.0 - smoothstep(0.29, 0.58, band));
    float rim = pow(max(0.0, dot(ray, normalize(vec3(-0.8, 0.1, 0.5)))), 28.0);
    float soft = pow(max(0.0, ray.y * 0.5 + 0.5), 5.0);
    vec3 chrome = vec3(0.035, 0.038, 0.039) + silver * vec3(0.38, 0.39, 0.38)
      + rim * vec3(0.5, 0.51, 0.49) + soft * 0.055;
    // Keep the introduction and the large signature in quiet, darker areas.
    float center = exp(-dot((vUv - vec2(0.5, 0.58)) * vec2(3.8, 4.2),
                           (vUv - vec2(0.5, 0.58)) * vec2(3.8, 4.2)));
    chrome *= (1.0 - center * 0.83) * mix(0.25, 1.0, smoothstep(0.03, 0.40, vUv.y));
    gl_FragColor = vec4(mix(vec3(0.031, 0.031, 0.027), chrome, 0.85), 1.0);
  }
`;

export default function LiquidChrome() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: "low-power" });
    } catch {
      return undefined;
    }
    const scene = new THREE.Scene();
    const camera = new THREE.Camera();
    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 }, uAspect: { value: 1 } },
      vertexShader: `varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`,
      fragmentShader,
      depthTest: false,
      depthWrite: false,
    });
    scene.add(new THREE.Mesh(geometry, material));
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let last = 0;
    let visible = true;
    let contextLost = false;
    const render = (now) => {
      frame = 0;
      if (!visible || document.hidden || contextLost) return;
      if (!motion.matches && last) material.uniforms.uTime.value += Math.min((now - last) / 1000, 0.05);
      last = now;
      renderer.render(scene, camera);
      if (!motion.matches) frame = requestAnimationFrame(render);
    };
    const stop = () => { cancelAnimationFrame(frame); frame = 0; last = 0; };
    const start = () => { if (!frame && visible && !document.hidden && !contextLost) frame = requestAnimationFrame(render); };
    const resize = () => {
      const { width, height } = canvas.getBoundingClientRect();
      renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.25));
      renderer.setSize(Math.max(width, 1), Math.max(height, 1), false);
      material.uniforms.uAspect.value = width / Math.max(height, 1);
      start();
    };
    const visibility = () => { stop(); start(); };
    const lost = (event) => { event.preventDefault(); contextLost = true; stop(); };
    const restored = () => { contextLost = false; resize(); };
    const observer = new ResizeObserver(resize);
    const intersection = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; visibility(); });
    observer.observe(canvas);
    intersection.observe(canvas);
    document.addEventListener("visibilitychange", visibility);
    motion.addEventListener("change", visibility);
    canvas.addEventListener("webglcontextlost", lost);
    canvas.addEventListener("webglcontextrestored", restored);
    resize();
    return () => {
      stop();
      observer.disconnect();
      intersection.disconnect();
      document.removeEventListener("visibilitychange", visibility);
      motion.removeEventListener("change", visibility);
      canvas.removeEventListener("webglcontextlost", lost);
      canvas.removeEventListener("webglcontextrestored", restored);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);
  return <canvas className="hero-liquid-chrome" ref={canvasRef} aria-hidden="true" />;
}
