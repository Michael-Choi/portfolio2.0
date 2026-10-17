import * as THREE from 'three';
import { CSS2DObject, CSS2DRenderer } from 'three/addons/renderers/CSS2DRenderer.js';
import { createDrag, createStage, getGlowTexture, readColor } from './stage';

const RADIUS = 2.2;
const COUNT = 3200;
const ARC_POINTS = 64;
const HUB = new THREE.Vector3(0, RADIUS + 0.7, 0.9);

// Labels pinned to the globe, as [latitude, longitude] in degrees.
const PINS: [string, number, number][] = [
  ['CRM', 28, -40],
  ['Docs', 48, 25],
  ['Sheets', 12, 70],
  ['Storage', 35, 140],
  ['Email', 8, -110],
  ['Ads', 55, -150],
  ['Your MCP server', 18, 10],
];

const vertexShader = /* glsl */ `
  attribute float aLit;
  attribute float aSeed;
  uniform vec3 uMouse;
  uniform float uMouseOn;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform float uTime;
  varying float vLit;
  varying float vHover;
  varying float vFacing;

  void main() {
    float hover = uMouseOn * smoothstep(0.9, 0.0, distance(position, uMouse));
    vec3 lifted = position * (1.0 + 0.1 * hover);
    vec4 mv = modelViewMatrix * vec4(lifted, 1.0);
    vFacing = normalize(normalMatrix * normalize(position)).z;
    vLit = aLit;
    vHover = hover;
    float twinkle = 0.85 + 0.15 * sin(uTime * 1.4 + aSeed * 6.2831);
    gl_PointSize = uSize * uPixelRatio * (1.0 + hover * 1.1 + aLit * 1.6) * twinkle * (6.5 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform vec3 uAccent;
  varying float vLit;
  varying float vHover;
  varying float vFacing;

  void main() {
    float r = length(gl_PointCoord - 0.5);
    if (r > 0.5) discard;
    float edge = smoothstep(0.5, 0.32, r);
    float glow = max(vLit, vHover);
    float alpha = edge * mix(0.06, 0.85, smoothstep(-0.25, 0.65, vFacing));
    alpha = max(alpha, edge * glow);
    gl_FragColor = vec4(mix(uColor, uAccent, glow), alpha);
  }
`;

type Arc = {
  line: THREE.Line;
  positions: Float32Array;
  packet: THREE.Sprite;
  target: number;
  start: number;
  permanent: boolean;
  active: boolean;
};

type Options = { onConnect: (total: number) => void };

function fibonacciSphere(count: number, radius: number) {
  const points = new Float32Array(count * 3);
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    points.set([Math.cos(theta) * r * radius, y * radius, Math.sin(theta) * r * radius], i * 3);
  }
  return points;
}

function fromLatLon(lat: number, lon: number, radius: number) {
  const phi = THREE.MathUtils.degToRad(90 - lat);
  const theta = THREE.MathUtils.degToRad(lon);
  return new THREE.Vector3().setFromSphericalCoords(radius, phi, theta);
}

export function mountGlobe(container: HTMLElement, options: Options) {
  const ink = readColor('--ink', '#0c0d10');
  const accent = readColor('--accent', '#f0532a');

  const labels = new CSS2DRenderer();
  labels.domElement.style.position = 'absolute';
  labels.domElement.style.inset = '0';
  labels.domElement.style.pointerEvents = 'none';
  container.appendChild(labels.domElement);

  const globe = new THREE.Group();
  globe.rotation.set(0.32, 0.6, 0);

  const positions = fibonacciSphere(COUNT, RADIUS);
  const lit = new Float32Array(COUNT);
  const seeds = Float32Array.from({ length: COUNT }, () => Math.random());
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const litAttribute = new THREE.BufferAttribute(lit, 1);
  geometry.setAttribute('aLit', litAttribute);
  geometry.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));

  const uniforms = {
    uColor: { value: ink },
    uAccent: { value: accent },
    uMouse: { value: new THREE.Vector3(0, 0, 99) },
    uMouseOn: { value: 0 },
    uSize: { value: 4.2 },
    uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
    uTime: { value: 0 },
  };
  const dots = new THREE.Points(
    geometry,
    new THREE.ShaderMaterial({ uniforms, vertexShader, fragmentShader, transparent: true, depthWrite: false }),
  );
  globe.add(dots);

  // An invisible sphere that the pointer ray hits.
  const shell = new THREE.Mesh(
    new THREE.SphereGeometry(RADIUS, 48, 24),
    new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }),
  );
  globe.add(shell);

  // Thin rings for latitude, so the globe reads as a sphere.
  for (const lat of [-40, 0, 40]) {
    const ringRadius = RADIUS * Math.cos(THREE.MathUtils.degToRad(lat));
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(ringRadius, 0.003, 4, 128),
      new THREE.MeshBasicMaterial({ color: ink, transparent: true, opacity: 0.08 }),
    );
    ring.rotation.x = Math.PI / 2;
    ring.position.y = RADIUS * Math.sin(THREE.MathUtils.degToRad(lat));
    globe.add(ring);
  }

  const pins: { label: CSS2DObject; anchor: THREE.Object3D }[] = [];
  for (const [text, lat, lon] of PINS) {
    const anchor = new THREE.Object3D();
    anchor.position.copy(fromLatLon(lat, lon, RADIUS * 1.04));
    const element = document.createElement('div');
    element.className = 'map-label';
    element.textContent = text;
    const label = new CSS2DObject(element);
    anchor.add(label);
    globe.add(anchor);
    pins.push({ label, anchor });
  }

  // Runneth floats above the globe and sends the arcs.
  const glow = getGlowTexture();
  const hub = new THREE.Group();
  hub.position.copy(HUB);
  hub.add(new THREE.Mesh(new THREE.SphereGeometry(0.11, 24, 12), new THREE.MeshBasicMaterial({ color: accent })));
  const halo = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: glow, color: accent, transparent: true, opacity: 0.6, depthWrite: false }),
  );
  halo.scale.setScalar(0.8);
  hub.add(halo);
  const hubLabelElement = document.createElement('div');
  hubLabelElement.className = 'map-label';
  hubLabelElement.dataset.group = 'hub';
  hubLabelElement.textContent = 'Runneth';
  const hubLabel = new CSS2DObject(hubLabelElement);
  hubLabel.position.set(0.62, 0, 0);
  hub.add(hubLabel);

  const arcs: Arc[] = [];
  const arcGroup = new THREE.Group();
  for (let i = 0; i < 28; i++) {
    const arcPositions = new Float32Array(ARC_POINTS * 3);
    const arcGeometry = new THREE.BufferGeometry();
    arcGeometry.setAttribute('position', new THREE.BufferAttribute(arcPositions, 3));
    const line = new THREE.Line(
      arcGeometry,
      new THREE.LineBasicMaterial({ color: accent, transparent: true, opacity: 0.7, depthWrite: false }),
    );
    line.visible = false;
    line.frustumCulled = false;
    const packet = new THREE.Sprite(
      new THREE.SpriteMaterial({ map: glow, color: accent, transparent: true, depthWrite: false }),
    );
    packet.scale.setScalar(0.18);
    packet.visible = false;
    arcGroup.add(line, packet);
    arcs.push({ line, positions: arcPositions, packet, target: 0, start: 0, permanent: false, active: false });
  }

  const litPoints = new Set<number>();
  const local = new THREE.Vector3();
  const world = new THREE.Vector3();
  const control = new THREE.Vector3();
  let clock = 0;
  let nextSpawn = 0;
  let total = 0;
  let mouseOn = 0;
  let mouseTarget = 0;

  const pointWorld = (index: number, out: THREE.Vector3) =>
    globe.localToWorld(out.set(positions[index * 3], positions[index * 3 + 1], positions[index * 3 + 2]));

  // A target must face the camera and sit on the visible part of the globe.
  const pickTarget = (near?: THREE.Vector3) => {
    globe.updateMatrixWorld();
    for (let attempt = 0; attempt < 40; attempt++) {
      const index = Math.floor(Math.random() * COUNT);
      pointWorld(index, world);
      if (world.z < 0.5 || world.y < -1.2) continue;
      if (near) {
        local.set(positions[index * 3], positions[index * 3 + 1], positions[index * 3 + 2]);
        if (local.distanceTo(near) > 1.1) continue;
      }
      return index;
    }
    return -1;
  };

  const spawn = (near?: THREE.Vector3, permanent = false) => {
    const arc = arcs.find((candidate) => !candidate.active);
    const target = pickTarget(near);
    if (!arc || target < 0) return false;
    arc.target = target;
    arc.start = clock;
    arc.permanent = permanent;
    arc.active = true;
    arc.line.visible = true;
    total += 1;
    options.onConnect(total);
    return true;
  };

  const GROW = 0.8;
  const HOLD = 0.6;
  const FADE = 0.7;

  const updateArc = (arc: Arc) => {
    const age = arc.permanent ? GROW + HOLD : clock - arc.start;
    pointWorld(arc.target, world);
    const distance = HUB.distanceTo(world);
    control.copy(HUB).add(world).multiplyScalar(0.5);
    control.add(control.clone().normalize().multiplyScalar(distance * 0.35));
    for (let i = 0; i < ARC_POINTS; i++) {
      const t = i / (ARC_POINTS - 1);
      const u = 1 - t;
      arc.positions[i * 3] = u * u * HUB.x + 2 * u * t * control.x + t * t * world.x;
      arc.positions[i * 3 + 1] = u * u * HUB.y + 2 * u * t * control.y + t * t * world.y;
      arc.positions[i * 3 + 2] = u * u * HUB.z + 2 * u * t * control.z + t * t * world.z;
    }
    arc.line.geometry.attributes.position.needsUpdate = true;

    const grow = Math.min(age / GROW, 1);
    arc.line.geometry.setDrawRange(0, Math.max(2, Math.floor(ARC_POINTS * grow)));
    const material = arc.line.material as THREE.LineBasicMaterial;
    const fade = arc.permanent ? 1 : 1 - THREE.MathUtils.clamp((age - GROW - HOLD) / FADE, 0, 1);
    material.opacity = 0.9 * fade;

    const head = Math.min(Math.floor((ARC_POINTS - 1) * grow), ARC_POINTS - 1);
    arc.packet.visible = !arc.permanent && grow < 1;
    arc.packet.position.fromArray(arc.positions, head * 3);

    if (grow >= 1 && lit[arc.target] < 0.99) {
      lit[arc.target] = 1;
      litPoints.add(arc.target);
    }
    if (!arc.permanent && age > GROW + HOLD + FADE) {
      arc.active = false;
      arc.line.visible = false;
      arc.packet.visible = false;
    }
  };

  const stage = createStage(container, {
    fov: 35,
    onResize: (width, height, camera) => {
      labels.setSize(width, height);
      const aspect = width / height;
      camera.position.set(0, 0.9, aspect < 1 ? 7.6 / Math.max(aspect, 0.55) : 7.6);
      camera.lookAt(0, 1.0, 0);
    },
    onFrame: ({ time, delta }) => {
      clock += delta;
      uniforms.uTime.value = time;

      const drift = stage.reducedMotion ? 0 : 0.07;
      globe.rotation.y += (drift + drag.velocity.x) * delta;
      globe.rotation.x = THREE.MathUtils.clamp(globe.rotation.x + drag.velocity.y * delta, -0.2, 0.8);
      if (!drag.active) {
        const decay = Math.exp(-delta * 3);
        drag.velocity.x *= decay;
        drag.velocity.y *= decay;
        if (Math.abs(drag.velocity.x) + Math.abs(drag.velocity.y) > 0.001) stage.invalidate();
      }

      mouseOn += (mouseTarget - mouseOn) * (1 - Math.exp(-delta * 6));
      uniforms.uMouseOn.value = mouseOn;

      if (!stage.reducedMotion && clock > nextSpawn) {
        spawn();
        nextSpawn = clock + 0.35 + Math.random() * 0.35;
        halo.scale.setScalar(1.05);
      }
      halo.scale.setScalar(THREE.MathUtils.lerp(halo.scale.x, 0.8, 1 - Math.exp(-delta * 5)));

      for (const arc of arcs) if (arc.active) updateArc(arc);

      // Lit dots cool down slowly.
      for (const index of litPoints) {
        lit[index] *= Math.exp(-delta * (stage.reducedMotion ? 0 : 0.55));
        if (lit[index] < 0.02) {
          lit[index] = 0;
          litPoints.delete(index);
        }
      }
      litAttribute.needsUpdate = true;

      // Pins on the far side of the globe hide.
      for (const { label, anchor } of pins) {
        anchor.getWorldPosition(world);
        const facing = world.z / RADIUS;
        label.element.style.opacity = String(THREE.MathUtils.clamp((facing - 0.1) * 2.5, 0, 1));
      }

      labels.render(stage.scene, stage.camera);
    },
  });

  stage.scene.add(globe, hub, arcGroup);

  const canvas = stage.renderer.domElement;
  const drag = createDrag(canvas, stage.invalidate);
  const raycaster = new THREE.Raycaster();

  const hitLocal = (event: PointerEvent) => {
    const rect = canvas.getBoundingClientRect();
    raycaster.setFromCamera(
      new THREE.Vector2(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -((event.clientY - rect.top) / rect.height) * 2 + 1,
      ),
      stage.camera,
    );
    const hit = raycaster.intersectObject(shell, false)[0];
    return hit ? globe.worldToLocal(hit.point.clone()) : null;
  };

  const onMove = (event: PointerEvent) => {
    const point = hitLocal(event);
    mouseTarget = point ? 1 : 0;
    if (point) uniforms.uMouse.value.copy(point);
    canvas.style.cursor = point && !drag.active ? 'pointer' : '';
    stage.invalidate();
  };

  const onLeave = () => {
    mouseTarget = 0;
    stage.invalidate();
  };

  const onUp = (event: PointerEvent) => {
    if (drag.moved) return;
    const point = hitLocal(event);
    if (!point) return;
    for (let i = 0; i < 7; i++) spawn(point, stage.reducedMotion);
    stage.invalidate();
  };

  canvas.addEventListener('pointermove', onMove);
  canvas.addEventListener('pointerleave', onLeave);
  canvas.addEventListener('pointerup', onUp);

  // With reduced motion, the arcs stay still.
  if (stage.reducedMotion) for (let i = 0; i < 12; i++) spawn(undefined, true);

  return {
    dispose() {
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerleave', onLeave);
      canvas.removeEventListener('pointerup', onUp);
      drag.dispose();
      labels.domElement.remove();
      stage.dispose();
    },
  };
}
