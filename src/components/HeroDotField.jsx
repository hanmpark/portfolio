import { useEffect, useRef } from "react";
import * as THREE from "three";

const planeVertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.999, 1.0);
  }
`;

const atmosphereFragmentShader = `
  precision highp float;

  uniform float uTime;
  uniform vec2 uResolution;
  varying vec2 vUv;

  float hash21(vec2 point) {
    point = fract(point * vec2(123.34, 456.21));
    point += dot(point, point + 45.32);
    return fract(point.x * point.y);
  }

  float noise21(vec2 point) {
    vec2 cell = floor(point);
    vec2 local = fract(point);
    local = local * local * (3.0 - 2.0 * local);

    return mix(
      mix(hash21(cell), hash21(cell + vec2(1.0, 0.0)), local.x),
      mix(hash21(cell + vec2(0.0, 1.0)), hash21(cell + vec2(1.0)), local.x),
      local.y
    );
  }

  float fbm(vec2 point) {
    float value = 0.0;
    float amplitude = 0.5;
    mat2 rotation = mat2(0.80, 0.60, -0.60, 0.80);

    for (int octave = 0; octave < 4; octave++) {
      value += noise21(point) * amplitude;
      point = rotation * point * 2.03 + 7.31;
      amplitude *= 0.5;
    }

    return value;
  }

  void main() {
    float aspect = uResolution.x / max(uResolution.y, 1.0);
    vec2 point = (vUv - 0.5) * vec2(aspect, 1.0);
    float time = uTime * 0.025;

    float cloud = fbm(point * 1.15 + vec2(time, -time * 0.72));
    float softCloud = fbm(point * 0.62 + vec2(-time * 0.42, time * 0.35) + 4.7);
    float bloom = exp(-length(point - vec2(-aspect * 0.22, 0.18)) * 1.55);

    vec3 charcoal = vec3(0.031, 0.031, 0.027);
    vec3 graphite = vec3(0.125, 0.132, 0.130);
    vec3 smoke = vec3(0.260, 0.272, 0.265);
    vec3 pearl = vec3(0.590, 0.600, 0.580);

    vec3 color = mix(charcoal, graphite, smoothstep(0.18, 0.82, cloud));
    color = mix(color, smoke, smoothstep(0.44, 0.94, softCloud) * 0.38);
    color = mix(color, pearl, bloom * 0.075);

    float vignette = smoothstep(1.1, 0.18, length((vUv - 0.5) * vec2(0.82, 1.0)));
    color *= mix(0.62, 1.02, vignette);
    color += (hash21(gl_FragCoord.xy) - 0.5) * 0.012;

    gl_FragColor = vec4(color, 1.0);
  }
`;

const dotVertexShader = `
  precision highp float;

  attribute float aSize;
  uniform float uPixelRatio;
  uniform float uTime;
  varying float vOpacity;
  varying float vTone;

  float dotHash(vec2 point) {
    point = fract(point * vec2(127.1, 311.7));
    point += dot(point, point + 34.23);
    return fract(point.x * point.y);
  }

  float dotNoise(vec2 point) {
    vec2 cell = floor(point);
    vec2 local = fract(point);
    local = local * local * (3.0 - 2.0 * local);

    return mix(
      mix(dotHash(cell), dotHash(cell + vec2(1.0, 0.0)), local.x),
      mix(dotHash(cell + vec2(0.0, 1.0)), dotHash(cell + vec2(1.0)), local.x),
      local.y
    );
  }

  float dotFbm(vec2 point) {
    float value = 0.0;
    float amplitude = 0.5;

    for (int octave = 0; octave < 3; octave++) {
      value += dotNoise(point) * amplitude;
      point = mat2(0.84, 0.54, -0.54, 0.84) * point * 2.06 + 5.17;
      amplitude *= 0.5;
    }

    return value;
  }

  void main() {
    vec2 uv = position.xy * 0.5 + 0.5;
    float time = uTime * 0.14;
    float warpA = dotFbm(uv * 2.35 + vec2(time * 0.18, -time * 0.12));
    float warpB = dotFbm(uv * 4.15 + vec2(-time * 0.10, time * 0.16) + 6.4);
    vec2 organicUv = uv + vec2(warpA - 0.5, warpB - 0.5) * 0.085;

    float waveA = sin(
      organicUv.x * 8.0 +
      organicUv.y * 1.4 +
      warpB * 3.5 +
      time * 0.88
    );
    float waveB = sin(
      organicUv.y * 9.8 -
      organicUv.x * 3.1 +
      warpA * 4.2 -
      time * 0.66
    );
    float waveC = sin(
      (organicUv.x + organicUv.y) * 12.2 +
      (warpA - warpB) * 4.8 +
      time * 0.46
    );

    float maskA = 1.0 - smoothstep(
      0.18,
      0.82,
      length((uv - vec2(0.27, 0.34)) * vec2(0.88, 1.18))
    );
    float maskB = 1.0 - smoothstep(
      0.14,
      0.76,
      length((uv - vec2(0.75, 0.63)) * vec2(0.92, 1.12))
    );
    float maskC = 1.0 - smoothstep(
      0.22,
      0.70,
      length((uv - vec2(0.53, 0.48)) * vec2(1.0, 1.26))
    );

    float ridgeA = smoothstep(0.18, 0.90, waveA) * maskA;
    float ridgeB = smoothstep(0.30, 0.93, waveB) * maskB;
    float ridgeC = smoothstep(0.46, 0.96, waveC) * maskC * 0.58;
    float ridge = max(ridgeA, ridgeB);
    ridge = clamp(ridge + ridgeC * (1.0 - ridge), 0.0, 1.0);

    float crestA = (1.0 - smoothstep(0.0, 0.15, abs(waveA - 0.76))) * maskA;
    float crestB = (1.0 - smoothstep(0.0, 0.13, abs(waveB - 0.80))) * maskB;
    float crest = max(crestA, crestB);

    vec2 displaced = position.xy;
    displaced.y += waveA * maskA * 0.011;
    displaced.y += waveB * maskB * 0.007;
    displaced.y += (warpA - 0.5) * 0.004;
    displaced.x += waveB * maskB * 0.004;
    displaced.x += (warpB - 0.5) * 0.002;

    vTone = clamp(ridge * 0.72 + crest * 0.28, 0.0, 1.0);
    vOpacity = mix(0.12, 0.82, ridge) + crest * 0.12;
    gl_PointSize = uPixelRatio * aSize * (0.78 + ridge * 1.15 + crest * 0.26);
    gl_Position = vec4(displaced, 0.0, 1.0);
  }
`;

const dotFragmentShader = `
  precision highp float;

  varying float vOpacity;
  varying float vTone;

  void main() {
    float distanceToCenter = length(gl_PointCoord - 0.5);
    float dot = 1.0 - smoothstep(0.28, 0.5, distanceToCenter);
    vec3 smoke = vec3(0.500, 0.515, 0.500);
    vec3 silver = vec3(0.900, 0.905, 0.880);
    vec3 color = mix(smoke, silver, vTone);

    gl_FragColor = vec4(color, dot * vOpacity);
  }
`;

const HeroDotField = ({ hostRef }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return undefined;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.matchMedia("(max-width: 720px)").matches;
    let renderer;

    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: false,
        antialias: !mobile,
        powerPreference: "high-performance",
      });
    } catch {
      canvas.classList.add("is-unavailable");
      return undefined;
    }

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x080807, 1);

    const scene = new THREE.Scene();
    const camera = new THREE.Camera();
    const sharedUniforms = {
      uTime: { value: reducedMotion ? 3.4 : 0 },
    };
    const atmosphereUniforms = {
      ...sharedUniforms,
      uResolution: { value: new THREE.Vector2(1, 1) },
    };
    const dotUniforms = {
      ...sharedUniforms,
      uPixelRatio: { value: 1 },
    };

    const atmosphereGeometry = new THREE.PlaneGeometry(2, 2);
    const atmosphereMaterial = new THREE.ShaderMaterial({
      uniforms: atmosphereUniforms,
      vertexShader: planeVertexShader,
      fragmentShader: atmosphereFragmentShader,
      depthTest: false,
      depthWrite: false,
    });
    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    atmosphere.renderOrder = 0;
    scene.add(atmosphere);

    const dotGeometry = new THREE.BufferGeometry();
    const dotMaterial = new THREE.ShaderMaterial({
      uniforms: dotUniforms,
      vertexShader: dotVertexShader,
      fragmentShader: dotFragmentShader,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      blending: THREE.NormalBlending,
    });
    const dotField = new THREE.Points(dotGeometry, dotMaterial);
    dotField.frustumCulled = false;
    dotField.renderOrder = 1;
    scene.add(dotField);

    let width = 1;
    let height = 1;
    let animationFrame = 0;
    let visible = true;

    const createGrid = () => {
      const spacing = mobile ? 8.5 : 7.5;
      const columns = Math.max(2, Math.ceil(width / spacing) + 2);
      const rows = Math.max(2, Math.ceil(height / spacing) + 2);
      const count = columns * rows;
      const positions = new Float32Array(count * 3);
      const sizes = new Float32Array(count);
      let index = 0;

      for (let row = 0; row < rows; row += 1) {
        for (let column = 0; column < columns; column += 1) {
          const offset = index * 3;
          positions[offset] = -1.02 + (column / (columns - 1)) * 2.04;
          positions[offset + 1] = -1.02 + (row / (rows - 1)) * 2.04;
          positions[offset + 2] = 0;
          sizes[index] = 0.72 + Math.random() * 0.22;
          index += 1;
        }
      }

      dotGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      dotGeometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    };

    const resize = () => {
      const rect = host.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      const pixelRatio = Math.min(window.devicePixelRatio || 1, mobile ? 1.2 : 1.5);

      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(width, height, false);
      atmosphereUniforms.uResolution.value.set(width, height);
      dotUniforms.uPixelRatio.value = pixelRatio;
      createGrid();
    };

    const render = (timestamp = performance.now()) => {
      animationFrame = 0;
      sharedUniforms.uTime.value = reducedMotion ? 3.4 : timestamp * 0.001;
      renderer.render(scene, camera);

      if (!reducedMotion && visible && !document.hidden) {
        animationFrame = window.requestAnimationFrame(render);
      }
    };

    const requestRender = () => {
      if (!animationFrame && visible && !document.hidden) {
        animationFrame = window.requestAnimationFrame(render);
      }
    };

    const handleVisibility = () => {
      if (!document.hidden) requestRender();
    };

    const resizeObserver = new ResizeObserver(() => {
      resize();
      if (reducedMotion) renderer.render(scene, camera);
    });
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) {
        requestRender();
      } else if (animationFrame) {
        window.cancelAnimationFrame(animationFrame);
        animationFrame = 0;
      }
    });

    resize();
    render();
    resizeObserver.observe(host);
    intersectionObserver.observe(host);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", handleVisibility);
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
      dotGeometry.dispose();
      dotMaterial.dispose();
      atmosphereGeometry.dispose();
      atmosphereMaterial.dispose();
      renderer.dispose();
    };
  }, [hostRef]);

  return <canvas className="hero-canvas" ref={canvasRef} aria-hidden="true" />;
};

export default HeroDotField;
