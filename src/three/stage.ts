import * as THREE from 'three';

export type Frame = { time: number; delta: number };

export type Stage = {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  size: { width: number; height: number };
  reducedMotion: boolean;
  /** Asks for one more frame when the loop is idle. */
  invalidate: () => void;
  /** Renders every frame while true. Reduced motion keeps it off. */
  setContinuous: (on: boolean) => void;
  dispose: () => void;
};

type StageOptions = {
  fov: number;
  onFrame: (frame: Frame) => void;
  /** Runs once during setup too, before createStage returns. */
  onResize?: (width: number, height: number, camera: THREE.PerspectiveCamera) => void;
};

export function readColor(name: string, fallback: string) {
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return new THREE.Color(value || fallback);
}

// The canvas renders only while it is on screen and the tab is visible.
export function createStage(container: HTMLElement, options: StageOptions): Stage {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let continuous = false;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setClearColor(0x000000, 0);
  renderer.domElement.style.display = 'block';
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(options.fov, 1, 0.1, 100);
  const size = { width: 1, height: 1 };

  const resize = () => {
    size.width = Math.max(1, container.clientWidth);
    size.height = Math.max(1, container.clientHeight);
    renderer.setSize(size.width, size.height, false);
    renderer.domElement.style.width = `${size.width}px`;
    renderer.domElement.style.height = `${size.height}px`;
    camera.aspect = size.width / size.height;
    camera.updateProjectionMatrix();
    options.onResize?.(size.width, size.height, camera);
    invalidate();
  };

  let raf = 0;
  let last = performance.now();
  let onScreen = true;
  let pending = true;

  const tick = (now: number) => {
    raf = 0;
    const delta = Math.min((now - last) / 1000, 0.05);
    last = now;
    options.onFrame({ time: now / 1000, delta });
    renderer.render(scene, camera);
    pending = false;
    schedule();
  };

  function schedule() {
    if (raf || !onScreen || document.hidden) return;
    if (continuous || pending) raf = requestAnimationFrame(tick);
  }

  function invalidate() {
    pending = true;
    schedule();
  }

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(container);

  const visibility = new IntersectionObserver(([entry]) => {
    onScreen = entry.isIntersecting;
    last = performance.now();
    schedule();
  });
  visibility.observe(container);

  const onVisibilityChange = () => {
    last = performance.now();
    schedule();
  };
  document.addEventListener('visibilitychange', onVisibilityChange);

  resize();

  return {
    renderer,
    scene,
    camera,
    size,
    reducedMotion,
    invalidate,
    setContinuous: (on: boolean) => {
      continuous = on && !reducedMotion;
      schedule();
    },
    dispose: () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      visibility.disconnect();
      document.removeEventListener('visibilitychange', onVisibilityChange);
      scene.traverse((object) => {
        const mesh = object as THREE.Mesh;
        mesh.geometry?.dispose();
        const material = mesh.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(material)) material.forEach((m) => m.dispose());
        else material?.dispose();
      });
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}

export type Drag = {
  /** Rotation speed in radians per second around Y, then X. */
  velocity: { x: number; y: number };
  active: boolean;
  /** True when the last press moved enough to count as a drag, not a click. */
  moved: boolean;
  dispose: () => void;
};

// Turns pointer drags into rotation speed, with inertia after release.
export function createDrag(element: HTMLElement, onChange: () => void): Drag {
  const drag: Drag = { velocity: { x: 0, y: 0 }, active: false, moved: false, dispose: () => {} };
  let lastX = 0;
  let lastY = 0;
  let lastTime = 0;
  let startX = 0;
  let startY = 0;

  const down = (event: PointerEvent) => {
    // Touch never rotates the map, so a swipe on a phone always scrolls the page.
    if (event.pointerType === 'touch') return;
    drag.active = true;
    drag.moved = false;
    lastX = startX = event.clientX;
    lastY = startY = event.clientY;
    lastTime = performance.now();
    element.setPointerCapture(event.pointerId);
    element.style.cursor = 'grabbing';
  };

  const move = (event: PointerEvent) => {
    if (!drag.active) return;
    const now = performance.now();
    const dt = Math.max((now - lastTime) / 1000, 1 / 120);
    const dx = event.clientX - lastX;
    const dy = event.clientY - lastY;
    drag.velocity.x = (dx * 0.006) / dt;
    drag.velocity.y = (dy * 0.006) / dt;
    if (Math.hypot(event.clientX - startX, event.clientY - startY) > 4) drag.moved = true;
    lastX = event.clientX;
    lastY = event.clientY;
    lastTime = now;
    onChange();
  };

  const up = (event: PointerEvent) => {
    drag.active = false;
    if (element.hasPointerCapture(event.pointerId)) element.releasePointerCapture(event.pointerId);
    element.style.cursor = '';
    onChange();
  };

  element.addEventListener('pointerdown', down);
  element.addEventListener('pointermove', move);
  element.addEventListener('pointerup', up);
  element.addEventListener('pointercancel', up);

  drag.dispose = () => {
    element.removeEventListener('pointerdown', down);
    element.removeEventListener('pointermove', move);
    element.removeEventListener('pointerup', up);
    element.removeEventListener('pointercancel', up);
  };
  return drag;
}

let glowTexture: THREE.Texture | null = null;

// A soft round sprite for glows and moving packets.
export function getGlowTexture() {
  if (glowTexture) return glowTexture;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 64;
  const context = canvas.getContext('2d')!;
  const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, 'rgba(255,255,255,1)');
  gradient.addColorStop(0.25, 'rgba(255,255,255,0.55)');
  gradient.addColorStop(1, 'rgba(255,255,255,0)');
  context.fillStyle = gradient;
  context.fillRect(0, 0, 64, 64);
  glowTexture = new THREE.CanvasTexture(canvas);
  return glowTexture;
}
