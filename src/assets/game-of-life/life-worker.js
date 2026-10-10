/* HashLife runs exclusively here; the Angular thread only handles controls. */
'use strict';
importScripts('vendor/life.js', 'vendor/formats.js', 'vendor/macrocell.js', 'life-io.js', 'life-engine-adapter.js');
let universe = new LifeUniverse(), canvas, context, initialGeneration = 0;
let view = { x: 0, y: 0, scale: 12, width: 800, height: 520, ratio: 1 };
let options = { grid: true, trails: false, background: '#10151c', alive: '#d6b56d', gridColor: '#26313a' };
let previousRoot = null;
function visit(node, x, y, size, draw) {
  if (!node.population) return;
  const sx = (x - view.x) * view.scale + view.width / 2;
  const sy = (y - view.y) * view.scale + view.height / 2;
  const pixels = size * view.scale;
  if (sx + pixels < 0 || sy + pixels < 0 || sx > view.width || sy > view.height) return;
  if (!node.level || pixels <= 1.5) { draw(sx, sy, Math.max(1, pixels), node.population / (size * size)); return; }
  const half = size / 2;
  visit(node.nw, x, y, half, draw); visit(node.ne, x + half, y, half, draw);
  visit(node.sw, x, y + half, half, draw); visit(node.se, x + half, y + half, half, draw);
}
function drawRoot(root, color, alpha) {
  if (!root || !root.population) return;
  const size = 2 ** root.level;
  context.fillStyle = color;
  visit(root, -size / 2, -size / 2, size, (x, y, pixels, density) => {
    context.globalAlpha = alpha * (pixels <= 1.5 ? Math.max(.3, Math.sqrt(density)) : 1);
    const gap = options.grid && view.scale >= 6 && pixels >= view.scale ? .6 : 0;
    context.fillRect(x + gap, y + gap, Math.max(1, pixels - 2 * gap), Math.max(1, pixels - 2 * gap));
  });
  context.globalAlpha = 1;
}
function render() {
  if (!context) return;
  const ratio = view.ratio || 1;
  const width = Math.round(view.width * ratio), height = Math.round(view.height * ratio);
  if (canvas.width !== width || canvas.height !== height) { canvas.width = width; canvas.height = height; }
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  context.fillStyle = options.background; context.fillRect(0, 0, view.width, view.height);
  if (options.grid && view.scale >= 6) {
    context.beginPath(); context.strokeStyle = options.gridColor; context.lineWidth = .5;
    const left = Math.floor(view.x - view.width / (2 * view.scale));
    const top = Math.floor(view.y - view.height / (2 * view.scale));
    for (let x = (left - view.x) * view.scale + view.width / 2; x < view.width; x += view.scale) { context.moveTo(x, 0); context.lineTo(x, view.height); }
    for (let y = (top - view.y) * view.scale + view.height / 2; y < view.height; y += view.scale) { context.moveTo(0, y); context.lineTo(view.width, y); }
    context.stroke();
  }
  if (options.trails) drawRoot(previousRoot, '#549b9a', .3);
  drawRoot(universe.root, options.alive, 1);
}
function state(id, started, extra = {}) {
  render();
  const bitmap = canvas && canvas.transferToImageBitmap ? canvas.transferToImageBitmap() : null;
  self.postMessage({ type: 'state', id, generation: universe.generation, population: universe.root.population,
    bounds: universe.get_root_bounds(), elapsed: performance.now() - started, bitmap, ...extra }, bitmap ? [bitmap] : []);
}
function load(text, centered) {
  const next = new LifeUniverse();
  if (text.trimStart().startsWith('[M2]')) {
    LifeIO.validateMacrocell(text);
    load_macrocell(next, text.replace(/\r/g, '').trim() + '\n');
  } else {
    const data = LifeIO.parseRle(text);
    if (data.xs.length) {
      const bounds = next.get_bounds(data.xs, data.ys);
      if (centered) next.make_center(data.xs, data.ys, bounds);
      else { next.move_field(data.xs, data.ys, data.offsetX, data.offsetY); bounds.left += data.offsetX; bounds.right += data.offsetX; bounds.top += data.offsetY; bounds.bottom += data.offsetY; }
      next.setup_field(data.xs, data.ys, bounds);
    }
    next.generation = centered ? 0 : data.generation;
  }
  if (Object.values(next.get_root_bounds()).some(value => Math.abs(value) > LifeIO.MAX_COORDINATE)) throw Error('El patrón importado supera el rango de coordenadas admitido.');
  universe = next; previousRoot = null; initialGeneration = universe.generation; universe.save_rewind_state();
}
function cells(root, x, y, size, output) {
  if (!root.population) return;
  if (!root.level) { output.push([x, y]); return; }
  const h = size / 2;
  cells(root.nw, x, y, h, output); cells(root.ne, x + h, y, h, output);
  cells(root.sw, x, y + h, h, output); cells(root.se, x + h, y + h, h, output);
}
function exportRle() {
  if (universe.root.population > 500000) throw Error('Para más de 500 000 células utiliza la exportación macrocell, que mantiene la estructura comprimida.');
  if (!universe.root.population) return 'x = 0, y = 0, rule = B3/S23\n!\n';
  const points = [], size = 2 ** universe.root.level;
  cells(universe.root, -size / 2, -size / 2, size, points);
  points.sort((a, b) => a[1] - b[1] || a[0] - b[0]);
  const b = universe.get_root_bounds(), fragments = [];
  let row = b.top, x = b.left, start = 0;
  const run = (n, token) => n ? (n > 1 ? String(n) : '') + token : '';
  while (start < points.length) {
    const point = points[start];
    if (point[1] !== row) { fragments.push(run(point[1] - row, '$')); row = point[1]; x = b.left; }
    fragments.push(run(point[0] - x, 'b'));
    let end = start + 1;
    while (end < points.length && points[end][1] === row && points[end][0] === points[end - 1][0] + 1) end++;
    fragments.push(run(end - start, 'o')); x = points[end - 1][0] + 1; start = end;
  }
  fragments.push('!');
  return '#N DaniSagan Labs\n#CXRLE Pos=' + b.left + ',' + b.top + ' Gen=' + universe.generation + '\nx = ' + (b.right - b.left + 1) + ', y = ' + (b.bottom - b.top + 1) + ', rule = B3/S23\n' + fragments.join('').replace(/(.{1,70})/g, '$1\n');
}
function exportMacrocell() {
  const lines = ['[M2] (DaniSagan Labs)', '#R B3/S23'], seen = new Map();
  let root = universe.root;
  while (root.level < 3) root = universe.expand_universe(root);
  function encode(node) {
    if (!node.population) return 0;
    if (seen.has(node)) return seen.get(node);
    if (node.level === 3) {
      let line = '';
      for (let y = -4; y < 4; y++) { for (let x = -4; x < 4; x++) line += universe.node_get_bit(node, x, y) ? '*' : '.'; line += '$'; }
      lines.push(line);
    } else {
      const refs = [node.nw, node.ne, node.sw, node.se].map(encode);
      lines.push(node.level + ' ' + refs.join(' '));
    }
    const index = lines.length - 2; seen.set(node, index); return index;
  }
  if (!root.population) lines.push('........$........$........$........$........$........$........$........$');
  else encode(root);
  return lines.join('\n') + '\n';
}
self.onmessage = event => {
  const data = event.data, started = performance.now();
  try {
    if (data.type === 'init') { if (typeof OffscreenCanvas === 'undefined') throw Error('Actualiza el navegador para utilizar el lienzo de simulación en segundo plano.'); canvas = new OffscreenCanvas(800, 520); context = canvas ? canvas.getContext('2d', { alpha: false }) : null; }
    else if (data.type === 'load') load(data.text, data.centered !== false);
    else if (data.type === 'step') {
      const exponent = data.exponent;
      if (!Number.isInteger(exponent) || exponent < 0 || exponent > 30) throw Error('Salto de generaciones no válido.');
      if (!Number.isSafeInteger(universe.generation + 2 ** exponent)) throw Error('Se ha alcanzado el límite de precisión de las generaciones.');
      previousRoot = universe.root; universe.set_step(exponent); universe.next_generation(true);
    } else if (data.type === 'edit') {
      for (const cell of data.cells) {
        if (!Number.isSafeInteger(cell[0]) || !Number.isSafeInteger(cell[1]) || Math.abs(cell[0]) > LifeIO.MAX_COORDINATE || Math.abs(cell[1]) > LifeIO.MAX_COORDINATE) throw Error('Coordenadas fuera de la precisión admitida.');
        universe.set_bit(cell[0], cell[1], !!cell[2]);
      }
      previousRoot = null;
      if (universe.generation === initialGeneration) universe.save_rewind_state();
    } else if (data.type === 'restore') { universe.restore_rewind_state(); universe.generation = initialGeneration; previousRoot = null; }
    else if (data.type === 'clear') { universe = new LifeUniverse(); universe.save_rewind_state(); initialGeneration = 0; previousRoot = null; }
    else if (data.type === 'export') {
      self.postMessage({ type: 'export', id: data.id, format: data.format, text: data.format === 'mc' ? exportMacrocell() : exportRle() }); return;
    }
    if (data.view) view = { ...view, ...data.view };
    if (data.options) options = { ...options, ...data.options };
    if (!Number.isFinite(view.scale) || view.scale <= 0 || !Number.isFinite(view.x) || !Number.isFinite(view.y)) throw Error('Vista no válida.');
    state(data.id, started);
  } catch (error) { self.postMessage({ type: 'error', id: data.id, message: error.message || String(error) }); }
};
