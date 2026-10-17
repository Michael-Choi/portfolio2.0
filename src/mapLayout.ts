// Shared layout for the integration map. The three.js scene and the SVG poster both read it,
// so the poster matches the first rendered frame.

export const POSITIONS: Record<string, [number, number, number]> = {
  runneth: [0, 0, 0],
  claude: [-3.4, 1.7, 0.9],
  assistants: [-4.3, -0.5, -0.6],
  slack: [-1.0, 2.8, -1.3],
  web: [-2.4, -2.6, 0.4],
  motion: [0.6, -1.7, 2.8],
  mcp: [3.0, 1.5, 0.5],
  apps: [2.8, -1.4, -0.7],
};

/** The resting rotation of the graph, in radians. Scenario yaw adds to BASE_YAW. */
export const BASE_PITCH = 0.28;
export const BASE_YAW = -0.35;

/** Vertical field of view used by the scene. */
export const FOV = 38;

/** Camera distance. Narrow views and the compact phone map move the camera back so every card fits. */
export function cameraZFor(aspect: number, compact = false) {
  const base = aspect < 1.05 ? (11 / aspect) * 1.22 : 11;
  return compact ? base * 1.3 : base;
}

/**
 * Projects a map position to 2D view coordinates, with the same rotation and perspective
 * as the scene at rest. The result is in units where the view height spans [-1, 1].
 */
export function project(
  [x, y, z]: [number, number, number],
  aspect: number,
  compact = false,
  yaw = BASE_YAW,
  pitch = BASE_PITCH,
) {
  // Rotate around Y, then X, as three.js applies an 'XYZ' Euler to a child.
  const cy = Math.cos(yaw);
  const sy = Math.sin(yaw);
  const x1 = x * cy + z * sy;
  const z1 = -x * sy + z * cy;
  const cp = Math.cos(pitch);
  const sp = Math.sin(pitch);
  const y2 = y * cp - z1 * sp;
  const z2 = y * sp + z1 * cp;
  const depth = cameraZFor(aspect, compact) - z2;
  const scale = 1 / (Math.tan(((FOV / 2) * Math.PI) / 180) * depth);
  return { x: x1 * scale, y: y2 * scale, depth };
}
