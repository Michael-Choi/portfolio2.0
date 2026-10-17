import * as THREE from 'three';
import { CSS2DObject, CSS2DRenderer } from 'three/addons/renderers/CSS2DRenderer.js';
import { mapEdges, mapNodes, type MapNode } from '@/content';
import { createDrag, createStage, getGlowTexture, readColor } from './stage';

const POSITIONS: Record<string, [number, number, number]> = {
  runneth: [0, 0, 0],
  claude: [-3.1, 1.5, 0.9],
  assistants: [-3.2, -1.0, -1.1],
  slack: [-1.1, 2.7, -1.3],
  web: [-1.4, -2.6, 1.1],
  motion: [0.4, -1.3, 3.0],
  mcp: [3.0, 1.5, 0.5],
  apps: [2.7, -1.5, -0.7],
};

type Palette = Record<Exclude<MapNode['group'], 'hub'>, string>;

const DARK: Palette = { surface: '#8ab4ff', data: '#f4c56a', tools: '#c4a1ff', apps: '#ff9f80' };
const LIGHT: Palette = { surface: '#2f6fdf', data: '#c7860f', tools: '#7c4ddb', apps: '#0c9a8f' };

/** Seconds for the tracer to cross one edge, and the pause before a scenario repeats. */
const HOP = 0.95;
const PAUSE = 1.1;

type Options = {
  /** Light pages need normal blending and darker colors; additive glows vanish on white. */
  light: boolean;
  onHover: (id: string | null) => void;
  onSelect: (id: string | null) => void;
};

type Edge = {
  from: string;
  to: string;
  curve: THREE.QuadraticBezierCurve3;
  material: THREE.LineBasicMaterial;
  baseColor: THREE.Color;
};

type Packet = { edge: Edge; sprite: THREE.Sprite; offset: number; speed: number; forward: boolean };

type Hop = { edge: Edge; forward: boolean };

export function mountConstellation(container: HTMLElement, options: Options) {
  const palette = options.light ? LIGHT : DARK;
  const hubColor = readColor('--accent', options.light ? '#f0532a' : '#6ff0c0');
  const lineColor = readColor('--muted', '#8b97a4');
  const blending = options.light ? THREE.NormalBlending : THREE.AdditiveBlending;
  const baseOpacity = options.light ? 0.32 : 0.4;
  const nodeColor = (node: MapNode) => (node.group === 'hub' ? hubColor.clone() : new THREE.Color(palette[node.group]));

  const labels = new CSS2DRenderer();
  labels.domElement.style.position = 'absolute';
  labels.domElement.style.inset = '0';
  labels.domElement.style.pointerEvents = 'none';
  container.appendChild(labels.domElement);

  const graph = new THREE.Group();
  graph.rotation.set(0.12, -0.35, 0);
  // Shifted up and right, so the info card in the lower left covers less of the map.
  graph.position.set(0.1, 0.4, 0);

  const nodes = new Map<
    string,
    { node: MapNode; mesh: THREE.Mesh; glow: THREE.Sprite; label: CSS2DObject; hit: THREE.Mesh }
  >();
  const hitTargets: THREE.Object3D[] = [];
  const edges: Edge[] = [];
  const edgeIndex = new Map<string, Hop>();
  const packets: Packet[] = [];
  const glow = getGlowTexture();

  let focus: string | null = null;
  let hovered: string | null = null;
  let scenario: { hops: Hop[]; nodes: Set<string>; start: number } | null = null;
  let clock = 0;
  const pointer = new THREE.Vector2(0, 0);
  const pointerTarget = new THREE.Vector2(0, 0);
  const raycaster = new THREE.Raycaster();

  const tracer = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: glow, color: hubColor, transparent: true, blending, depthWrite: false }),
  );
  tracer.scale.setScalar(options.light ? 0.42 : 0.55);
  tracer.visible = false;

  const lit = (edge: Edge) => {
    if (focus) return edge.from === focus || edge.to === focus;
    if (scenario) return scenario.hops.some((hop) => hop.edge === edge);
    return true;
  };

  const stage = createStage(container, {
    fov: 38,
    onResize: (width, height, camera) => {
      labels.setSize(width, height);
      const aspect = width / height;
      camera.position.z = aspect < 1.05 ? (11 / aspect) * 1.22 : 11;
    },
    onFrame: ({ time, delta }) => {
      clock += delta;

      // Rotation: slow drift, plus drag speed that fades after release.
      const drift = stage.reducedMotion || hovered ? 0 : 0.11;
      graph.rotation.y += (drift + drag.velocity.x) * delta;
      graph.rotation.x = THREE.MathUtils.clamp(graph.rotation.x + drag.velocity.y * delta, -0.7, 0.7);
      if (!drag.active) {
        const decay = Math.exp(-delta * 3.5);
        drag.velocity.x *= decay;
        drag.velocity.y *= decay;
        if (Math.abs(drag.velocity.x) + Math.abs(drag.velocity.y) > 0.001) stage.invalidate();
      }

      // The camera leans a little toward the pointer.
      pointer.lerp(pointerTarget, 1 - Math.exp(-delta * 4));
      stage.camera.position.x = pointer.x * 0.7;
      stage.camera.position.y = pointer.y * 0.45;
      stage.camera.lookAt(0, 0, 0);

      const hub = nodes.get('runneth');
      if (hub && !stage.reducedMotion) {
        const pulse = 1 + Math.sin(time * 2.2) * 0.12;
        hub.glow.scale.setScalar(2.4 * pulse);
      }

      for (const packet of packets) {
        if (stage.reducedMotion) {
          packet.sprite.visible = false;
          continue;
        }
        const t = (time * packet.speed + packet.offset) % 1;
        packet.sprite.position.copy(packet.edge.curve.getPoint(packet.forward ? t : 1 - t));
        const strength = lit(packet.edge) ? (scenario && !focus ? 0.45 : 0.95) : 0.12;
        (packet.sprite.material as THREE.SpriteMaterial).opacity = strength * Math.sin(t * Math.PI);
      }

      // The tracer walks the scenario path one edge at a time, then pauses and repeats.
      tracer.visible = false;
      if (scenario && !focus && !stage.reducedMotion) {
        const total = scenario.hops.length * HOP + PAUSE;
        const elapsed = (clock - scenario.start) % total;
        const index = Math.floor(elapsed / HOP);
        if (index < scenario.hops.length) {
          const hop = scenario.hops[index];
          const t = THREE.MathUtils.smoothstep((elapsed - index * HOP) / HOP, 0, 1);
          tracer.position.copy(hop.edge.curve.getPoint(hop.forward ? t : 1 - t));
          tracer.visible = true;
        }
      }

      // Labels farther from the camera fade back.
      const world = new THREE.Vector3();
      for (const { label, mesh } of nodes.values()) {
        mesh.getWorldPosition(world);
        const depth = THREE.MathUtils.mapLinear(world.z, -3.2, 3.2, 0.35, 1);
        const on = label.element.dataset.active === 'true';
        label.element.style.opacity = on ? '1' : String(THREE.MathUtils.clamp(depth, 0.3, 1));
      }

      labels.render(stage.scene, stage.camera);
    },
  });

  // Nodes, each with a glow, a label, and a larger invisible target for the pointer.
  for (const node of mapNodes) {
    const position = new THREE.Vector3(...POSITIONS[node.id]);
    const color = nodeColor(node);
    const radius = node.group === 'hub' ? 0.3 : 0.14;

    const mesh = new THREE.Mesh(new THREE.SphereGeometry(radius, 32, 16), new THREE.MeshBasicMaterial({ color }));
    mesh.position.copy(position);

    const hubGlow = options.light ? 0.3 : 0.55;
    const nodeGlow = options.light ? 0.18 : 0.4;
    const glowSprite = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: glow,
        color,
        transparent: true,
        opacity: node.group === 'hub' ? hubGlow : nodeGlow,
        blending,
        depthWrite: false,
      }),
    );
    glowSprite.scale.setScalar(node.group === 'hub' ? 2.4 : 1.1);
    mesh.add(glowSprite);

    const hit = new THREE.Mesh(
      new THREE.SphereGeometry(0.45, 12, 8),
      new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }),
    );
    hit.userData.id = node.id;
    mesh.add(hit);
    hitTargets.push(hit);

    const element = document.createElement('div');
    element.className = 'map-label';
    element.dataset.group = node.group;
    element.textContent = node.label;
    const label = new CSS2DObject(element);
    label.position.set(0, radius + 0.32, 0);
    mesh.add(label);

    graph.add(mesh);
    nodes.set(node.id, { node, mesh, glow: glowSprite, label, hit });
  }

  // Curved links between nodes, each with two packets moving in opposite directions.
  for (const [from, to] of mapEdges) {
    const a = new THREE.Vector3(...POSITIONS[from]);
    const b = new THREE.Vector3(...POSITIONS[to]);
    const mid = a.clone().add(b).multiplyScalar(0.5);
    const bend = mid.clone().normalize().multiplyScalar(0.5).add(new THREE.Vector3(0, 0.35, 0));
    const curve = new THREE.QuadraticBezierCurve3(a, mid.add(bend), b);
    const fromNode = nodes.get(from)!.node;
    const toNode = nodes.get(to)!.node;
    const accentNode = fromNode.group === 'hub' ? toNode : fromNode;
    const baseColor = from === 'motion' && to === 'claude' ? nodeColor(fromNode) : lineColor.clone();
    const material = new THREE.LineBasicMaterial({ color: baseColor, transparent: true, opacity: baseOpacity });
    const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getPoints(48)), material);
    graph.add(line);
    const edge: Edge = { from, to, curve, material, baseColor };
    edges.push(edge);
    edgeIndex.set(`${from}|${to}`, { edge, forward: true });
    edgeIndex.set(`${to}|${from}`, { edge, forward: false });

    for (const forward of [true, false]) {
      const sprite = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: glow,
          color: nodeColor(accentNode),
          transparent: true,
          blending,
          depthWrite: false,
        }),
      );
      sprite.scale.setScalar(options.light ? 0.24 : 0.32);
      graph.add(sprite);
      packets.push({ edge, sprite, offset: Math.random(), speed: 0.18 + Math.random() * 0.14, forward });
    }
  }

  // Several MCP servers around the MCP node.
  const mcpCenter = new THREE.Vector3(...POSITIONS.mcp);
  const mcpColor = new THREE.Color(palette.tools);
  for (let i = 0; i < 4; i++) {
    const angle = (i / 4) * Math.PI * 2 + 0.4;
    const offset = new THREE.Vector3(Math.cos(angle) * 0.75, Math.sin(angle) * 0.55, Math.sin(angle * 1.7) * 0.5);
    const satellite = new THREE.Mesh(
      new THREE.SphereGeometry(0.06, 16, 8),
      new THREE.MeshBasicMaterial({ color: mcpColor }),
    );
    satellite.position.copy(mcpCenter).add(offset);
    graph.add(satellite);
    graph.add(
      new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([mcpCenter, satellite.position]),
        new THREE.LineBasicMaterial({ color: mcpColor, transparent: true, opacity: 0.35 }),
      ),
    );
  }

  // A cloud of small points for the business apps.
  const appsCenter = new THREE.Vector3(...POSITIONS.apps);
  const appColor = new THREE.Color(palette.apps);
  const cloud: THREE.Vector3[] = [];
  for (let i = 0; i < 180; i++) {
    const direction = new THREE.Vector3().randomDirection();
    cloud.push(appsCenter.clone().add(direction.multiplyScalar(0.55 + Math.random() * 0.75)));
  }
  graph.add(
    new THREE.Points(
      new THREE.BufferGeometry().setFromPoints(cloud),
      new THREE.PointsMaterial({ color: appColor, size: 0.05, transparent: true, opacity: 0.8, depthWrite: false }),
    ),
  );
  const spokes: THREE.Vector3[] = [];
  cloud.slice(0, 36).forEach((point) => spokes.push(appsCenter, point));
  graph.add(
    new THREE.LineSegments(
      new THREE.BufferGeometry().setFromPoints(spokes),
      new THREE.LineBasicMaterial({ color: appColor, transparent: true, opacity: 0.14 }),
    ),
  );

  graph.add(tracer);
  stage.scene.add(graph);

  // A focused node wins over a scenario. Without either, every link shows at rest.
  const applyHighlight = () => {
    for (const { node, mesh, label } of nodes.values()) {
      const on = focus ? node.id === focus : Boolean(scenario?.nodes.has(node.id));
      mesh.scale.setScalar(focus && on ? 1.45 : on ? 1.2 : 1);
      label.element.dataset.active = String(on);
    }
    for (const edge of edges) {
      if (focus) {
        const touches = edge.from === focus || edge.to === focus;
        const other = nodes.get(edge.from === focus ? edge.to : edge.from)!.node;
        const color = focus === 'runneth' ? nodeColor(other) : nodeColor(nodes.get(focus)!.node);
        edge.material.color.copy(touches ? color : edge.baseColor);
        edge.material.opacity = touches ? 0.95 : 0.12;
      } else if (scenario) {
        const onPath = lit(edge);
        edge.material.color.copy(onPath ? hubColor : edge.baseColor);
        edge.material.opacity = onPath ? 0.9 : 0.12;
      } else {
        edge.material.color.copy(edge.baseColor);
        edge.material.opacity = baseOpacity;
      }
    }
    stage.invalidate();
  };

  // Pointer: hover shows a node, a click without a drag selects it.
  const canvas = stage.renderer.domElement;
  const drag = createDrag(canvas, stage.invalidate);

  const pick = (event: PointerEvent) => {
    const rect = canvas.getBoundingClientRect();
    const ndc = new THREE.Vector2(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1,
    );
    raycaster.setFromCamera(ndc, stage.camera);
    const hit = raycaster.intersectObjects(hitTargets, false)[0];
    return { ndc, id: (hit?.object.userData.id as string | undefined) ?? null };
  };

  const onMove = (event: PointerEvent) => {
    const { ndc, id } = pick(event);
    pointerTarget.copy(ndc);
    if (!drag.active && id !== hovered) {
      hovered = id;
      canvas.style.cursor = id ? 'pointer' : '';
      options.onHover(id);
    }
    stage.invalidate();
  };

  const onLeave = () => {
    pointerTarget.set(0, 0);
    if (hovered) {
      hovered = null;
      options.onHover(null);
    }
    stage.invalidate();
  };

  const onUp = (event: PointerEvent) => {
    if (drag.moved) return;
    options.onSelect(pick(event).id);
  };

  canvas.addEventListener('pointermove', onMove);
  canvas.addEventListener('pointerleave', onLeave);
  canvas.addEventListener('pointerup', onUp);

  return {
    /** Highlights one node and its links. Null clears the focus. */
    setActive(id: string | null) {
      focus = id;
      applyHighlight();
    },
    /** Plays a request path such as ['claude', 'motion', 'claude']. Null stops it. */
    setScenario(path: string[] | null) {
      if (!path) {
        scenario = null;
      } else {
        const hops: Hop[] = [];
        for (let i = 0; i < path.length - 1; i++) {
          const hop = edgeIndex.get(`${path[i]}|${path[i + 1]}`);
          if (hop) hops.push(hop);
        }
        scenario = { hops, nodes: new Set(path), start: clock };
      }
      applyHighlight();
    },
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
