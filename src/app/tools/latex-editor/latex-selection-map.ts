import type { MathfieldElement } from 'mathlive';
import { LatexNode, latexTree, nodePath } from './latex-structure';

/** Maps original LaTeX ranges to MathLive offsets, preserving repeated occurrences. */
export class LatexSelectionMap {
  private selectionMapSource = '';
  private selectionMapValue = '';
  private readonly visualRangeCache = new Map<string, [number, number][]>();

  // Read current editor values lazily: the field is created after construction,
  // and loading a document replaces the source without replacing this mapper.
  constructor(
    private readonly source: () => string,
    private readonly mathfield: () => MathfieldElement,
  ) {}

  private get latex(): string {
    return this.source();
  }

  private get field(): MathfieldElement {
    return this.mathfield();
  }

  normalize(s: string): string {
    return s
      .replace(/\\(?:dfrac|tfrac|cfrac)\b/g, '\\frac')
      .replace(/\\left|\\right|\\displaystyle|\\placeholder\{\}/g, '')
      .replace(/[{}\s]/g, '');
  }
  nodes(): LatexNode[] {
    const all: LatexNode[] = [];
    const visit = (n: LatexNode) => {
      all.push(n);
      n.children.forEach(visit);
    };
    visit(latexTree(this.latex));
    return all;
  }
  sourceOccurrences(target: string): LatexNode[] {
    const found: LatexNode[] = [],
      seen = new Set<string>();
    const visit = (node: LatexNode) => {
      // Follow renderer branch order, rather than the textual order of TeX scripts.
      const priority = (child: LatexNode) =>
        child.label === 'Índice de raíz'
          ? 3
          : child.label === 'Exponente'
            ? 1
            : child.label === 'Subíndice'
              ? 2
              : 0;
      [...node.children]
        .sort((a, b) => priority(a) - priority(b))
        .forEach(visit);
      const key = `${node.start}:${node.end}`;
      if (
        !seen.has(key) &&
        this.normalize(this.latex.slice(node.start, node.end)) === target &&
        !found.some(
          (child) => child.start >= node.start && child.end <= node.end,
        )
      ) {
        seen.add(key);
        found.push(node);
      }
    };
    visit(latexTree(this.latex));
    if (found.length) return found;
    // A free text selection may span only part of a sum or a run of letters.
    const positions = this.sourcePositions(),
      text = positions.map((i) => this.latex[i]).join('');
    for (
      let i = text.indexOf(target);
      i >= 0;
      i = text.indexOf(target, i + Math.max(1, target.length))
    ) {
      found.push({
        start: positions[i],
        end: positions[i + target.length - 1] + 1,
        children: [],
        label: 'Selección',
      });
    }
    return found;
  }
  visualOccurrences(target: string): [number, number][] {
    const value = this.field.value;
    if (
      this.selectionMapSource !== this.latex ||
      this.selectionMapValue !== value
    ) {
      this.visualRangeCache.clear();
      this.selectionMapSource = this.latex;
      this.selectionMapValue = value;
    }
    const cached = this.visualRangeCache.get(target);
    if (cached) return cached;
    const n = this.field.lastOffset,
      atomic: [number, number][] = [];
    for (let end = 1; end <= n; end++)
      if (this.normalize(this.field.getValue(end - 1, end)) === target)
        atomic.push([end - 1, end]);
    if (atomic.length) {
      this.visualRangeCache.set(target, atomic);
      return atomic;
    }
    const matches: [number, number][] = [];
    for (let start = 0; start < n; start++)
      for (let end = start + 1; end <= n; end++)
        if (this.normalize(this.field.getValue(start, end)) === target)
          matches.push([start, end]);
    // Empty branch sentinels can produce several ranges for the same expression.
    // Keep its smallest range, so each occurrence has exactly one identity.
    const distinct: [number, number][] = [];
    matches.sort((a, b) => a[1] - a[0] - (b[1] - b[0]));
    for (const range of matches)
      if (!distinct.some((r) => r[0] >= range[0] && r[1] <= range[1]))
        distinct.push(range);
    distinct.sort((a, b) => a[1] - b[1] || a[0] - b[0]);
    this.visualRangeCache.set(target, distinct);
    return distinct;
  }
  sourcePositions(): number[] {
    const result: number[] = [];
    const s = this.latex;
    for (let i = 0; i < s.length; i++) {
      if (/[{}\s]/.test(s[i])) continue;
      const skip = s.slice(i).match(/^\\(?:left|right|displaystyle)/);
      if (skip) {
        i += skip[0].length - 1;
        continue;
      }
      result.push(i);
    }
    return result;
  }
  navigate(
    start: number,
    end: number,
    direction: 'parent' | 'child' | 'left' | 'right',
  ): LatexNode {
    const path = nodePath(latexTree(this.latex), start, end);
    let current = path[path.length - 1];
    if (direction === 'parent') {
      // From a numerator/denominator, the next level is its enclosing fraction.
      let index = path.length - 2;
      if (index >= 0 && /argumento/.test(path[index].label)) index--;
      current = path[Math.max(0, index)];
    } else if (direction === 'child') current = current.children[0] || current;
    else {
      let index = path.length - 2;
      while (index >= 0 && path[index].children.length <= 1) index--;
      const parent = path[Math.max(0, index)];
      const child = path[index + 1] || current;
      const siblings = parent.children.filter(
        (x) => !/^[+=−-]$/.test(this.latex.slice(x.start, x.end)),
      );
      const at = siblings.indexOf(child);
      current =
        siblings[
          Math.max(
            0,
            Math.min(siblings.length - 1, at + (direction === 'left' ? -1 : 1)),
          )
        ] || current;
    }
    return current;
  }
}
