import { useEffect, useRef } from "react";
import * as THREE from "three";
import { SVGLoader } from "three/addons/loaders/SVGLoader.js";
import { toCreasedNormals } from "three/addons/utils/BufferGeometryUtils.js";
import "./HeroLogo.css";
import logoSvg from "../../public/assets/LOGO_PRINCIPAL_HANMIN_BLANC.svg?raw";

// The source SVG contains zero-length segments and near-duplicate endpoints.
// Clean them before beveling so the closing seam cannot produce a spike.
const cleanContour = (path) => {
  const points = path.getPoints(32).filter((point, index, all) =>
    index === 0 || point.distanceToSquared(all[index - 1]) > 0.01,
  );
  if (points.length > 1 && points[0].distanceToSquared(points.at(-1)) < 0.01) points.pop();
  return points.filter((point, index) => {
    const before = points[(index + points.length - 1) % points.length];
    const after = points[(index + 1) % points.length];
    const incoming = point.clone().sub(before);
    const outgoing = after.clone().sub(point);
    return Math.abs(incoming.cross(outgoing)) > 0.001 || incoming.dot(outgoing) < 0;
  });
};

const HeroLogo = ({ hostRef, showcase = false }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return undefined;

    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobile = window.matchMedia("(max-width: 720px)");
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    } catch {
      return undefined;
    }
    renderer.setClearColor(0x080807, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x080807);
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    const paths = new SVGLoader().parse(logoSvg).paths;
    const shapes = paths.flatMap((path) => path.toShapes()).map((source) => {
      const shape = new THREE.Shape(cleanContour(source));
      shape.holes = source.holes.map((hole) => new THREE.Path(cleanContour(hole)));
      return shape;
    });
    const extrusion = new THREE.ExtrudeGeometry(shapes, {
      depth: 105,
      bevelEnabled: true,
      bevelThickness: 22,
      bevelSize: 14,
      bevelSegments: 12,
      curveSegments: 24,
      steps: 1,
    });
    extrusion.center();
    const originalNormals = extrusion.getAttribute("normal");
    const geometry = toCreasedNormals(extrusion, Math.PI / 3);
    // Smooth the bevels without bending the broad, polished front/back faces.
    const normals = geometry.getAttribute("normal");
    for (const group of geometry.groups) {
      if (group.materialIndex !== 0) continue;
      for (let index = group.start; index < group.start + group.count; index += 1) {
        normals.setXYZ(index, originalNormals.getX(index), originalNormals.getY(index), originalNormals.getZ(index));
      }
    }
    geometry.scale(0.006, 0.006, 0.006);
    geometry.rotateX(Math.PI);
    if (geometry !== extrusion) extrusion.dispose();
    const material = new THREE.MeshPhysicalMaterial({
      color: 0xbfc2c5,
      metalness: 0.38,
      roughness: 0.09,
      transmission: 0.92,
      thickness: 1.65,
      ior: 1.5,
      dispersion: 2.8,
      envMapIntensity: 0.85,
    });
    const logo = new THREE.Mesh(geometry, material);
    scene.add(logo);

    // Broad neutral reflections give the transmissive surface a silver finish.
    const environmentCanvas = document.createElement("canvas");
    environmentCanvas.width = 512;
    environmentCanvas.height = 256;
    const context = environmentCanvas.getContext("2d");
    const gradient = context.createLinearGradient(0, 0, 512, 256);
    gradient.addColorStop(0, "#080807");
    gradient.addColorStop(0.25, "#c1c4c7");
    gradient.addColorStop(0.45, "#444648");
    gradient.addColorStop(0.7, "#b4b7bb");
    gradient.addColorStop(1, "#080807");
    context.fillStyle = gradient;
    context.fillRect(0, 0, 512, 256);
    const environmentTexture = new THREE.CanvasTexture(environmentCanvas);
    environmentTexture.colorSpace = THREE.SRGBColorSpace;
    environmentTexture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = environmentTexture;

    // A real backdrop lets the glass refract the lettering.
    let backdrop;
    let backdropTexture;
    if (showcase) {
      const backdropCanvas = document.createElement("canvas");
      backdropCanvas.width = 1600;
      backdropCanvas.height = 1200;
      const paint = backdropCanvas.getContext("2d");
      paint.fillStyle = "#080807";
      paint.fillRect(0, 0, 1600, 1200);
      paint.textAlign = "center";
      paint.textBaseline = "middle";
      paint.font = "500 180px Arial, sans-serif";
      paint.fillStyle = "#d7d6d0";
      for (const y of [370, 600, 830]) paint.fillText("build and repeat", 800, y);
      backdropTexture = new THREE.CanvasTexture(backdropCanvas);
      backdropTexture.colorSpace = THREE.SRGBColorSpace;
      backdrop = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: backdropTexture, toneMapped: false }));
      backdrop.position.z = -3;
      scene.add(backdrop);
    }

    const pointer = new THREE.Vector2();
    const tilt = new THREE.Vector2();
    const interactionHost = host.closest(".hero") || host;
    let frame = 0;
    let visible = true;
    let contextLost = false;
    let lastTime = 0;
    let elapsed = 0;

    const render = (timestamp) => {
      frame = 0;
      if (!visible || document.hidden || contextLost) return;
      const reducedMotion = motionPreference.matches;
      const delta = lastTime ? Math.min((timestamp - lastTime) / 1000, 0.05) : 0;
      lastTime = timestamp;
      if (!reducedMotion) elapsed += delta;
      if (reducedMotion) tilt.set(0, 0);
      else tilt.lerp(pointer, 1 - Math.exp(-delta * 4));
      const time = reducedMotion ? 0 : elapsed;
      logo.rotation.set(
        -0.20 + Math.sin(time * 0.36) * 0.12 + tilt.y * 0.12,
        -0.40 + Math.sin(time * 0.26) * 0.28 + tilt.x * 0.18,
        -0.10 + Math.sin(time * 0.30) * 0.055,
      );
      renderer.render(scene, camera);
      canvas.classList.add("is-ready");
      if (!reducedMotion) frame = window.requestAnimationFrame(render);
    };

    const requestRender = () => {
      if (!frame && visible && !document.hidden && !contextLost) {
        lastTime = 0;
        frame = window.requestAnimationFrame(render);
      }
    };
    const stop = () => {
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
      lastTime = 0;
    };
    const resize = () => {
      const { width, height } = host.getBoundingClientRect();
      camera.aspect = Math.max(width, 1) / Math.max(height, 1);
      const fieldOfView = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
      // Reserve enough space for the silhouette, its bevel and its rotation.
      camera.position.z = Math.max(6.8 / (2 * fieldOfView * camera.aspect * 0.82), 3.4 / (2 * fieldOfView * 0.42));
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile.matches ? 1.5 : 2));
      renderer.setSize(Math.max(width, 1), Math.max(height, 1), false);
      if (backdrop) {
        const backdropHeight = 2 * fieldOfView * (camera.position.z - backdrop.position.z);
        const backdropWidth = backdropHeight * camera.aspect;
        backdrop.scale.set(backdropWidth, backdropHeight, 1);
      }
      requestRender();
    };
    const onPointerMove = (event) => {
      if (motionPreference.matches || event.pointerType === "touch") return;
      const rect = interactionHost.getBoundingClientRect();
      pointer.set((event.clientX - rect.left) / rect.width * 2 - 1, (event.clientY - rect.top) / rect.height * 2 - 1);
    };
    const onPointerLeave = () => pointer.set(0, 0);
    const onVisibility = () => document.hidden ? stop() : requestRender();
    const onMotionChange = () => {
      stop();
      tilt.set(0, 0);
      requestRender();
    };
    const onContextLost = (event) => {
      event.preventDefault();
      contextLost = true;
      canvas.classList.remove("is-ready");
      stop();
    };
    const onContextRestored = () => {
      contextLost = false;
      requestRender();
    };
    const resizeObserver = new ResizeObserver(resize);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) requestRender();
      else stop();
    });
    resize();
    resizeObserver.observe(host);
    intersectionObserver.observe(interactionHost);
    interactionHost.addEventListener("pointermove", onPointerMove, { passive: true });
    interactionHost.addEventListener("pointerleave", onPointerLeave);
    document.addEventListener("visibilitychange", onVisibility);
    motionPreference.addEventListener("change", onMotionChange);
    canvas.addEventListener("webglcontextlost", onContextLost);
    canvas.addEventListener("webglcontextrestored", onContextRestored);

    return () => {
      stop();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      interactionHost.removeEventListener("pointermove", onPointerMove);
      interactionHost.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("visibilitychange", onVisibility);
      motionPreference.removeEventListener("change", onMotionChange);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      canvas.removeEventListener("webglcontextrestored", onContextRestored);
      canvas.classList.remove("is-ready");
      geometry.dispose();
      material.dispose();
      environmentTexture.dispose();
      if (backdrop) {
        backdrop.geometry.dispose();
        backdrop.material.dispose();
        backdropTexture.dispose();
      }
      renderer.dispose();
    };
  }, [hostRef, showcase]);

  return (
    <>
      <canvas className="hero-logo-canvas" ref={canvasRef} aria-hidden="true" />
      <img className="hero-logo-fallback" src="/assets/LOGO_PRINCIPAL_HANMIN_BLANC.svg" alt="" aria-hidden="true" />
    </>
  );
};

export default HeroLogo;
