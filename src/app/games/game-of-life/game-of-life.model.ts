export interface LifePattern {
  id: string;
  title: string;
  category: string;
  description: string;
  author: string;
  width: number;
  height: number;
  population: number;
  featured: boolean;
  exponent: number;
  source: string;
  file: string;
}
export interface LifeBounds {
  left: number;
  right: number;
  top: number;
  bottom: number;
}
export interface LifeView {
  x: number;
  y: number;
  scale: number;
  width: number;
  height: number;
  ratio: number;
}
export interface LifeMessage {
  type: 'state' | 'error' | 'export';
  id: number;
  generation?: number;
  population?: number;
  bounds?: LifeBounds;
  elapsed?: number;
  bitmap?: ImageBitmap;
  message?: string;
  text?: string;
  format?: 'rle' | 'mc';
}
export const LIFE_CATEGORIES = [
  'Naturalezas muertas',
  'Osciladores',
  'Naves',
  'Matusalenes',
  'Cañones',
  'Rastrillos y locomotoras',
  'Crecimiento',
  'Lógica y construcciones',
  'Síntesis y reacciones',
  'Otras construcciones',
];
export function normalizedLifeSearch(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('es');
}
export function fitLifeView(
  bounds: LifeBounds,
  width: number,
  height: number,
): Pick<LifeView, 'x' | 'y' | 'scale'> {
  const columns = Math.max(1, bounds.right - bounds.left + 1);
  const rows = Math.max(1, bounds.bottom - bounds.top + 1);
  return {
    x: (bounds.left + bounds.right + 1) / 2,
    y: (bounds.top + bounds.bottom + 1) / 2,
    scale: Math.min(
      30,
      Math.max(1e-15, Math.min(width / (columns + 12), height / (rows + 12))),
    ),
  };
}
export function zoomLifeView(
  view: LifeView,
  factor: number,
  pixelX = view.width / 2,
  pixelY = view.height / 2,
): LifeView {
  const scale = Math.min(80, Math.max(1e-15, view.scale * factor));
  return {
    ...view,
    scale,
    x: view.x + (pixelX - view.width / 2) * (1 / view.scale - 1 / scale),
    y: view.y + (pixelY - view.height / 2) * (1 / view.scale - 1 / scale),
  };
}
