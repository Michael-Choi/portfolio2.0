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

const GROUP_COLORS: Record<MapNode['group'], string> = {
  hub: '#6ff0c0',
  surface: '#8ab4ff',
  data: '#f4c56a',
  tools: '#c4a1ff',
  apps: '#ff9f80',
};

type Options = {
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

export function mountConstellation(container: HTMLElement, options: Options) {
  const lineColor = readColor('--muted', '#8b97a4');
  const nodeColor = (node: MapNode) => new THREE.Color(GROUP_COLORS[node.group]);

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
  const packets: Packet[] = [];
  const glow = getGlowTexture();

  let active: string | null = null;
  let hovered: string | null = null;
  const pointer = new THREE.Vector2(0, 0);
  const pointerTarget = new THREE.Vector2(0, 0);
  const raycaster = new THREE.Raycaster();

  const stage = createStage(container, {
    fov: 38,
    onResize: (width, height, camera) => {
      labels.setSize(width, height);
      const aspect = width / height;
      camera.position.z = aspect < 1.05 ? (11 / aspect) * 1.22 : 11;
    },
    onFrame: ({ time, delta }) => {
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
        const lit = !active || packet.edge.from === active || packet.edge.to === active;
        (packet.sprite.material as THREE.SpriteMaterial).opacity = (lit ? 0.95 : 0.15) * Math.sin(t * Math.PI);
      }

      // Labels farther from the camera fade back.
      const world = new THREE.Vector3();
      for (const { label, mesh, node } of nodes.values()) {
        mesh.getWorldPosition(world);
        const depth = THREE.MathUtils.mapLinear(world.z, -3.2, 3.2, 0.35, 1);
        label.element.style.opacity = node.id === active ? '1' : String(THREE.MathUtils.clamp(depth, 0.3, 1));
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

    const glowSprite = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: glow,
        color,
        transparent: true,
        opacity: node.group === 'hub' ? 0.55 : 0.4,
        blending: THREE.AdditiveBlending,
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
    const material = new THREE.LineBasicMaterial({ color: baseColor, transparent: true, opacity: 0.4 });
    const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getPoints(48)), material);
    graph.add(line);
    const edge: Edge = { from, to, curve, material, baseColor };
    edges.push(edge);

    for (const forward of [true, false]) {
      const sprite = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: glow,
          color: nodeColor(accentNode),
          transparent: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        }),
      );
      sprite.scale.setScalar(0.32);
      graph.add(sprite);
      packets.push({ edge, sprite, offset: Math.random(), speed: 0.18 + Math.random() * 0.14, forward });
    }
  }

  // Several MCP servers around the MCP node.
  const mcpCenter = new THREE.Vector3(...POSITIONS.mcp);
  const mcpColor = new THREE.Color(GROUP_COLORS.tools);
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
  const appColor = new THREE.Color(GROUP_COLORS.apps);
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

  stage.scene.add(graph);

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
    setActive(id: string | null) {
      active = id;
      for (const { node, mesh, label } of nodes.values()) {
        const on = node.id === id;
        mesh.scale.setScalar(on ? 1.45 : 1);
        label.element.dataset.active = String(on);
      }
      for (const edge of edges) {
        const touches = id !== null && (edge.from === id || edge.to === id);
        const other = nodes.get(edge.from === id ? edge.to : edge.from)!.node;
        const color = id === 'runneth' && touches ? nodeColor(other) : nodeColor(nodes.get(id ?? 'runneth')!.node);
        edge.material.color.copy(touches ? color : edge.baseColor);
        edge.material.opacity = id === null ? 0.4 : touches ? 0.95 : 0.12;
      }
      stage.invalidate();
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
