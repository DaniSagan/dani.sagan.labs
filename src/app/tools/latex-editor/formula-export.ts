// Loaded only when exporting: the editor itself does not load a second renderer.
import { renderLatexSvg } from './mathjax-renderer.js';
import { FormulaDocument } from './formula-storage';
export function formulaSvg(doc: FormulaDocument): { svg: string; width: number; height: number } {
  const rendered = renderLatexSvg(doc.latex);
  if (rendered.includes('data-mjx-error')) throw new Error('Corrige los errores LaTeX antes de exportar.');
  const parsed = new DOMParser().parseFromString(rendered, 'text/html');
  const source = parsed.querySelector('svg');
  if (!source) throw new Error('No se pudo renderizar la fórmula.');
  const viewBox = (source.getAttribute('viewBox') || '0 0 1000 1000').split(/\s+/).map(Number);
  const factor = doc.fontSize / 1000;
  const padding = Math.ceil(doc.fontSize * 0.75);
  const width = Math.max(1, Math.ceil(viewBox[2] * factor + padding * 2));
  const height = Math.max(1, Math.ceil(viewBox[3] * factor + padding * 2));
  if (width * height * doc.scale ** 2 > 32000000 || width * doc.scale > 16000 || height * doc.scale > 16000) throw new Error('La imagen es demasiado grande. Reduce el tamaño o la resolución.');
  source.setAttribute('x', String(padding)); source.setAttribute('y', String(padding));
  source.setAttribute('width', String(width - padding * 2)); source.setAttribute('height', String(height - padding * 2));
  source.removeAttribute('style');
  source.querySelectorAll('[data-mjx-texclass="ERROR"]').forEach(() => { throw new Error('La fórmula contiene comandos no exportables.'); });
  const bg = doc.transparent ? '' : `<rect width="100%" height="100%" fill="${doc.background}"/>`;
  return { width, height, svg: `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" color="${doc.foreground}">${bg}${source.outerHTML}</svg>` };
}
export async function formulaPng(doc: FormulaDocument): Promise<Blob> {
  const { svg, width, height } = formulaSvg(doc);
  const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
  try {
    const image = new Image(); image.src = url; await image.decode();
    const canvas = document.createElement('canvas'); canvas.width = width * doc.scale; canvas.height = height * doc.scale;
    const ctx = canvas.getContext('2d'); if (!ctx) throw new Error('Tu navegador no permite exportar PNG.');
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    return await new Promise<Blob>((resolve, reject) => canvas.toBlob(b => b ? resolve(b) : reject(new Error('No se pudo generar el PNG.')), 'image/png'));
  } finally { URL.revokeObjectURL(url); }
}
