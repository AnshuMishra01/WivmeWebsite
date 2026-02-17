'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/* ──────────────────────────────────────────────────────────
   MeshGradient — Three.js organic gradient that breathes.
   
   Not a gimmick. This replaces the flat hero accent block 
   with a living, morphing gradient that responds to the 
   mouse cursor. The colors stay within the editorial palette 
   (cream/violet-soft/coral-soft) — it's atmosphere, not 
   spectacle. You barely notice it consciously, but it makes 
   the hero feel unlike anything built with CSS alone.
   ────────────────────────────────────────────────────────── */

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  varying vec2 vUv;

  /* Simplex 2D noise — compact implementation */
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(
      0.211324865405187, 0.366025403784439,
      -0.577350269189626, 0.024390243902439
    );
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
    m = m * m;
    m = m * m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    vec2 uv = vUv;
    float t = uTime * 0.12;

    /* Mouse warp — subtle distortion near cursor */
    vec2 mouseDir = uv - uMouse;
    float mouseDist = length(mouseDir);
    uv += mouseDir * 0.04 * smoothstep(0.5, 0.0, mouseDist);

    /* Three noise layers at different scales and speeds */
    float n1 = snoise(uv * 1.8 + vec2(t, t * 0.7));
    float n2 = snoise(uv * 2.5 + vec2(-t * 0.6, t * 0.4) + 50.0);
    float n3 = snoise(uv * 1.2 + vec2(t * 0.3, -t * 0.5) + 100.0);

    /* Editorial palette — all close to cream, with soft color shifts */
    vec3 cream      = vec3(0.961, 0.945, 0.922);
    vec3 violetSoft = vec3(0.898, 0.875, 0.988);
    vec3 coralSoft  = vec3(0.988, 0.918, 0.898);
    vec3 sageSoft   = vec3(0.878, 0.941, 0.906);

    /* Organic blending — metaball-like soft shapes */
    vec3 color = cream;
    color = mix(color, violetSoft, smoothstep(-0.2, 0.6, n1) * 0.7);
    color = mix(color, coralSoft,  smoothstep( 0.0, 0.8, n2) * 0.45);
    color = mix(color, sageSoft,   smoothstep( 0.1, 0.7, n3) * 0.3);

    /* Directional gradient — violet pools toward top-right */
    color = mix(color, violetSoft, (uv.x * 0.3 + (1.0 - uv.y) * 0.2) * 0.5);

    gl_FragColor = vec4(color, 1.0);
  }
`;

export default function MeshGradient() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    /* Graceful degradation: CSS gradient fallback on mobile / reduced motion */
    if (
      window.innerWidth < 768 ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      container.style.background =
        'linear-gradient(135deg, #F5F1EB, #E5DFFC 60%, #FCEAE5)';
      return;
    }

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    } catch {
      container.style.background =
        'linear-gradient(135deg, #F5F1EB, #E5DFFC 60%, #FCEAE5)';
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const uniforms = {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    };

    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
    });
    scene.add(new THREE.Mesh(geometry, material));

    const targetMouse = new THREE.Vector2(0.5, 0.5);
    let raf: number;
    const t0 = Date.now();

    const animate = () => {
      uniforms.uTime.value = (Date.now() - t0) * 0.001;
      targetMouse.set(mouseRef.current.x, mouseRef.current.y);
      uniforms.uMouse.value.lerp(targetMouse, 0.05);
      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    animate();

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseRef.current.x = (e.clientX - rect.left) / rect.width;
      mouseRef.current.y = 1 - (e.clientY - rect.top) / rect.height;
    };

    const onResize = () => {
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        overflow: 'hidden',
      }}
      aria-hidden="true"
    />
  );
}
