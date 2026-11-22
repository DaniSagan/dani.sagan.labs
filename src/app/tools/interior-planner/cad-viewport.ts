import type { Bounds } from './cad-export';

/** SVG xMidYMid/meet keeps the model's aspect ratio and exposes extra space
 * above/below or beside the viewBox. Paint and masks must cover that space too. */
export function visibleViewport(box: Bounds, pixelWidth: number, pixelHeight: number): Bounds {
  if (!Number.isFinite(pixelWidth) || !Number.isFinite(pixelHeight) || pixelWidth <= 0 || pixelHeight <= 0) return { ...box };
  const aspect = pixelWidth / pixelHeight;
  const width = Math.max(box.width, box.height * aspect);
  const height = Math.max(box.height, box.width / aspect);
  return { x: box.x - (width - box.width) / 2, y: box.y - (height - box.height) / 2, width, height };
}
