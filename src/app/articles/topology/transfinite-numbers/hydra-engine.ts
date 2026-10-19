/** Turn n adds n copies of the cut head's remaining parent subtree at its grandparent. */
export interface HydraNode { id: number; children: HydraNode[]; }
export type HydraOrdinal = HydraOrdinal[]; // CNF: descending exponents; coefficients expanded.
type Shape = Shape[];
export type HydraPreset = 'fork' | 'chain' | 'flat';
export function compareOrdinals(a: HydraOrdinal, b: HydraOrdinal): number {
  for (let i = 0; i < Math.min(a.length, b.length); i++) {
    const c = compareOrdinals(a[i], b[i]);
    if (c) return c;
  }
  return Math.sign(a.length - b.length);
}
export function hydraOrdinal(node: HydraNode): HydraOrdinal {
  return node.children.map(hydraOrdinal).sort((a, b) => -compareOrdinals(a, b));
}
/** Plain text CNF, readable without MathJax. Natural sum sorts all terms. */
export function ordinalText(ordinal: HydraOrdinal): string {
  if (!ordinal.length) return '0';
  const terms: string[] = [];
  for (let i = 0; i < ordinal.length;) {
    const exponent = ordinal[i];
    let end = i + 1;
    while (end < ordinal.length && compareOrdinals(exponent, ordinal[end]) === 0) end++;
    const count = end - i;
    if (!exponent.length) terms.push(String(count));
    else {
      const power = ordinalText(exponent);
      const term = power === '1' ? 'ω' : /^\d+$/.test(power) ? `ω^${power}` : `ω^(${power})`;
      terms.push(term + (count > 1 ? `·${count}` : ''));
    }
    i = end;
  }
  return terms.join(' + ');
}
export function nodeCount(node: HydraNode): number {
  return 1 + node.children.reduce((n, child) => n + nodeCount(child), 0);
}
export function headCount(node: HydraNode): number {
  return node.children.reduce((n, child) => n + (child.children.length ? headCount(child) : 1), 0);
}
export class HydraGame {
  tree!: HydraNode;
  turn = 1;
  message = 'Elige una cabeza: las hojas son los botones del árbol.';
  lastComparison = '';
  private nextId = 0;
  constructor(readonly maxNodes = 180) { this.reset('fork'); }
  reset(preset: HydraPreset): void {
    this.nextId = 0;
    const shapes: Record<HydraPreset, Shape> = {
      fork: [[[], []]], chain: [[[[]]]], flat: [[], [], []],
    };
    const make = (shape: Shape): HydraNode => ({ id: this.nextId++, children: shape.map(make) });
    this.tree = make(shapes[preset]);
    this.turn = 1;
    this.lastComparison = '';
    this.message = 'Elige una cabeza: las hojas son los botones del árbol.';
  }
  get heads(): number { return headCount(this.tree); }
  get nodes(): number { return nodeCount(this.tree); }
  get ordinal(): string { return ordinalText(hydraOrdinal(this.tree)); }
  cut(id: number): boolean {
    const path = this.findPath(this.tree, id);
    if (!path || path.length < 2 || path[path.length - 1].children.length) return false;
    const parent = path[path.length - 2];
    const copies = path.length > 2 ? this.turn : 0;
    const projected = this.nodes - 1 + copies * (nodeCount(parent) - 1);
    if (projected > this.maxNodes) {
      this.message = `Ese corte produciría ${projected} nodos y supera el límite visual de ${this.maxNodes}. No se ha ejecutado: el turno y el árbol se conservan. Prueba otra cabeza o reinicia.`;
      return false;
    }
    const before = hydraOrdinal(this.tree);
    const oldHeads = this.heads;
    parent.children = parent.children.filter(child => child.id !== id);
    if (copies) {
      const grandparent = path[path.length - 3];
      for (let i = 0; i < copies; i++) grandparent.children.push(this.clone(parent));
    }
    const after = hydraOrdinal(this.tree);
    this.lastComparison = `${ordinalText(before)} → ${ordinalText(after)} (disminuye)`;
    this.message = `Corte ${this.turn}: ${oldHeads} → ${this.heads} cabezas. ` +
      (copies ? `Se añadieron ${copies} copias de la rama restante, además de conservar la original.` : 'La cabeza estaba unida a la raíz: no hay rebrote.') +
      (this.heads === 0 ? ' ¡Victoria! Solo queda la raíz.' : ' Elige la siguiente cabeza.');
    this.turn++;
    return true;
  }
  private clone(node: HydraNode): HydraNode {
    return { id: this.nextId++, children: node.children.map(child => this.clone(child)) };
  }
  private findPath(node: HydraNode, id: number): HydraNode[] | null {
    if (node.id === id) return [node];
    for (const child of node.children) {
      const path = this.findPath(child, id);
      if (path) return [node, ...path];
    }
    return null;
  }
}
