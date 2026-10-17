// Design options under review. The ?look= query parameter selects one.
export const LOOKS = [
  { id: 'constellation', name: 'A · Constellation' },
  { id: 'globe', name: 'B · Globe' },
  { id: 'paper', name: 'C · Paper' },
] as const;

export type Look = (typeof LOOKS)[number]['id'];

export function readLook(): Look {
  const value = new URLSearchParams(window.location.search).get('look');
  return LOOKS.find((look) => look.id === value)?.id ?? 'constellation';
}

export function webglAvailable() {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl2') ?? canvas.getContext('webgl'));
  } catch {
    return false;
  }
}
