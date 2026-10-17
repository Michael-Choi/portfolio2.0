import * as THREE from 'three';
import { CSS2DObject, CSS2DRenderer } from 'three/addons/renderers/CSS2DRenderer.js';
import { Line2 } from 'three/addons/lines/Line2.js';
import { LineGeometry } from 'three/addons/lines/LineGeometry.js';
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';
import { mapEdges, mapNodes } from '@/content';
import { BASE_PITCH, BASE_YAW, FOV, POSITIONS, cameraZFor } from '@/mapLayout';
import { nodeCardHTML } from '@/nodeCard';
import { createDrag, createStage, getGlowTexture, readColor } from './stage';

/** Seconds for the tracer to cross one edge, and the pause before a path repeats. */
const HOP = 0.95;
const PAUSE = 1.1;
/** How far a visitor can turn the map by dragging, in radians (±15° and ±8°). */
const MAX_DRAG_YAW = THREE.MathUtils.degToRad(15);
const MAX_DRAG_PITCH = THREE.MathUtils.degToRad(8);
/** The camera reaches about 95% of a new scenario's angle in 600 ms. */
const EASE_RATE = 5;
/** Line widths in CSS pixels. */
const LINE_WIDTH = 1.5;
const ACTIVE_WIDTH = 2.5;
/** Trail sprites behind the tracer, and their spacing along the path in hops. */
const TRAIL = 8;
const TRAIL_GAP = 0.035;

export type MapScenario = { path: string[]; yaw: number };

type Options = {
  /** Phones use smaller cards without the role line. */
  compact: boolean;
  /** Called after the first frame, so the page can fade the canvas in over the poster. */
  onReady: () => void;
};

type Edge = {
  from: string;
  to: string;
  curve: THREE.QuadraticBezierCurve3;
  material: LineMaterial;
};

type Hop = { edge: Edge; forward: boolean };

const edgeKey = (a: string, b: string) => [a, b].sort().join('|');

/** Bends the midpoint outward and upward. MapPoster draws the same curve in 2D. */
function edgeCurve(from: string, to: string) {
  const a = new THREE.Vector3(...POSITIONS[from]);
  const b = new THREE.Vector3(...POSITIONS[to]);
  const mid = a.clone().add(b).multiplyScalar(0.5);
  const bend = mid.clone().normalize().multiplyScalar(0.5).add(new THREE.Vector3(0, 0.35, 0));
  return new THREE.QuadraticBezierCurve3(a, mid.add(bend), b);
}

export function mountIntegrationMap(container: HTMLElement, options: Options) {
  const hubColor = readColor('--hub', '#f0532a');
  const restColor = new THREE.Color('#cfcfc8');

  const labels = new CSS2DRenderer();
  labels.domElement.style.position = 'absolute';
  labels.domElement.style.inset = '0';
  labels.domElement.style.pointerEvents = 'none';
  if (options.compact) labels.domElement.classList.add('map-compact');
  container.appendChild(labels.domElement);

  const graph = new THREE.Group();
  graph.rotation.set(BASE_PITCH, BASE_YAW, 0);

  const nodes = new Map<string, { anchor: THREE.Object3D; inner: HTMLElement }>();
  const edges = new Map<string, Edge>();
  const lineMaterials: LineMaterial[] = [];
  const glow = getGlowTexture();

  let scenario: { hops: Hop[]; nodes: Set<string>; start: number } | null = null;
  let targetYaw = BASE_YAW;
  let dragYaw = 0;
  let dragPitch = 0;
  let clock = 0;
  let ready = false;

  // The tracer: a bright head and a fading trail.
  const trail = Array.from({ length: TRAIL + 1 }, (_, i) => {
    const sprite = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: glow,
        color: hubColor,
        transparent: true,
        opacity: i === 0 ? 1 : 0.55 * (1 - i / (TRAIL + 1)),
        depthWrite: false,
      }),
    );
    sprite.scale.setScalar(i === 0 ? 0.5 : 0.34 * (1 - i / (TRAIL + 2)));
    sprite.visible = false;
    return sprite;
  });

  const pointOnPath = (hops: Hop[], progress: number) => {
    const index = Math.min(Math.floor(progress), hops.length - 1);
    const t = THREE.MathUtils.clamp(progress - index, 0, 1);
    const hop = hops[index];
    return hop.edge.curve.getPoint(hop.forward ? t : 1 - t);
  };

  const stage = createStage(container, {
    fov: FOV,
    onResize: (width, height, camera) => {
      labels.setSize(width, height);
      for (const material of lineMaterials) material.resolution.set(width, height);
      camera.position.set(0, 0, cameraZFor(width / height, options.compact));
      camera.lookAt(0, 0, 0);
    },
    onFrame: ({ delta }) => {
      clock += delta;

      // Ease toward the scenario angle. Drag adds a small, bounded offset.
      if (!drag.active) {
        const decay = Math.exp(-delta * 3.5);
        drag.velocity.x *= decay;
        drag.velocity.y *= decay;
      }
      dragYaw = THREE.MathUtils.clamp(dragYaw + drag.velocity.x * delta, -MAX_DRAG_YAW, MAX_DRAG_YAW);
      dragPitch = THREE.MathUtils.clamp(dragPitch + drag.velocity.y * delta, -MAX_DRAG_PITCH, MAX_DRAG_PITCH);
      const yaw = targetYaw + dragYaw;
      const easing = stage.reducedMotion ? 1 : 1 - Math.exp(-delta * EASE_RATE);
      graph.rotation.y += (yaw - graph.rotation.y) * easing;
      graph.rotation.x += (BASE_PITCH + dragPitch - graph.rotation.x) * easing;
      const settling =
        Math.abs(yaw - graph.rotation.y) > 0.001 || Math.abs(drag.velocity.x) + Math.abs(drag.velocity.y) > 0.001;
      if (settling) stage.invalidate();

      // Dashes march along the active path, and the tracer runs it one edge at a time.
      for (const sprite of trail) sprite.visible = false;
      if (scenario && !stage.reducedMotion) {
        for (const { edge, forward } of scenario.hops) edge.material.dashOffset -= (forward ? 1 : -1) * delta * 0.5;
        const total = scenario.hops.length * HOP + PAUSE;
        const progress = ((clock - scenario.start) % total) / HOP;
        if (progress < scenario.hops.length) {
          trail.forEach((sprite, i) => {
            const behind = progress - i * TRAIL_GAP;
            if (behind < 0) return;
            sprite.position.copy(pointOnPath(scenario!.hops, behind));
            sprite.visible = true;
          });
        }
      }

      // Cards farther away shrink a little, so the 3D still reads.
      const world = new THREE.Vector3();
      for (const { anchor, inner } of nodes.values()) {
        anchor.getWorldPosition(world);
        const depth = THREE.MathUtils.clamp(THREE.MathUtils.mapLinear(world.z, -3.5, 3.5, 0.86, 1.04), 0.86, 1.04);
        inner.style.setProperty('--depth', depth.toFixed(3));
      }

      labels.render(stage.scene, stage.camera);
      if (!ready) {
        ready = true;
        options.onReady();
      }
    },
  });

  // A faint dot grid under the graph. Dots fade into the card color toward the edges.
  const floor: number[] = [];
  const floorColors: number[] = [];
  const near = new THREE.Color('#dcdcd5');
  const far = new THREE.Color('#ffffff');
  for (let x = -9; x <= 9; x += 0.6) {
    for (let z = -9; z <= 9; z += 0.6) {
      const fade = THREE.MathUtils.clamp(Math.hypot(x, z) / 9, 0, 1);
      if (fade >= 1) continue;
      floor.push(x, -3.6, z);
      const color = near.clone().lerp(far, fade * fade);
      floorColors.push(color.r, color.g, color.b);
    }
  }
  const floorGeometry = new THREE.BufferGeometry();
  floorGeometry.setAttribute('position', new THREE.Float32BufferAttribute(floor, 3));
  floorGeometry.setAttribute('color', new THREE.Float32BufferAttribute(floorColors, 3));
  graph.add(new THREE.Points(floorGeometry, new THREE.PointsMaterial({ size: 0.055, vertexColors: true })));

  for (const node of mapNodes) {
    const anchor = new THREE.Object3D();
    anchor.position.set(...POSITIONS[node.id]);
    const element = document.createElement('div');
    element.className = 'node';
    element.innerHTML = nodeCardHTML(node);
    anchor.add(new CSS2DObject(element));
    graph.add(anchor);
    nodes.set(node.id, { anchor, inner: element.firstElementChild as HTMLElement });
  }

  for (const [from, to] of mapEdges) {
    const curve = edgeCurve(from, to);
    const geometry = new LineGeometry();
    geometry.setPositions(curve.getPoints(64).flatMap((point) => [point.x, point.y, point.z]));
    const material = new LineMaterial({
      color: restColor,
      linewidth: LINE_WIDTH,
      transparent: true,
      opacity: 1,
      dashSize: 0.16,
      gapSize: 0.12,
    });
    lineMaterials.push(material);
    const line = new Line2(geometry, material);
    line.computeLineDistances();
    graph.add(line);

    edges.set(edgeKey(from, to), { from, to, curve, material });
  }

  trail.forEach((sprite) => graph.add(sprite));
  stage.scene.add(graph);

  const canvas = stage.renderer.domElement;
  const drag = createDrag(canvas, stage.invalidate);

  const applyHighlight = () => {
    for (const [id, { inner }] of nodes) {
      inner.dataset.state = !scenario ? 'rest' : scenario.nodes.has(id) ? 'active' : 'dim';
    }
    for (const edge of edges.values()) {
      const onPath = Boolean(scenario?.hops.some((hop) => hop.edge === edge));
      edge.material.color.copy(onPath ? hubColor : restColor);
      edge.material.linewidth = onPath ? ACTIVE_WIDTH : LINE_WIDTH;
      edge.material.opacity = !scenario || onPath ? 1 : 0.45;
      edge.material.dashed = onPath;
    }
  };

  return {
    /** Plays one scenario's path and turns the camera toward it. Null returns to the rest state. */
    setScenario(next: MapScenario | null) {
      if (!next) {
        scenario = null;
        targetYaw = BASE_YAW;
      } else {
        const hops: Hop[] = [];
        for (let i = 0; i < next.path.length - 1; i++) {
          const [a, b] = [next.path[i], next.path[i + 1]];
          const edge = edges.get(edgeKey(a, b));
          if (edge) hops.push({ edge, forward: edge.from === a });
        }
        scenario = { hops, nodes: new Set(next.path), start: clock };
        targetYaw = BASE_YAW + THREE.MathUtils.degToRad(next.yaw);
      }
      applyHighlight();
      // Render every frame only while a path animates.
      stage.setContinuous(scenario !== null);
      stage.invalidate();
    },
    dispose() {
      drag.dispose();
      labels.domElement.remove();
      stage.dispose();
    },
  };
}
