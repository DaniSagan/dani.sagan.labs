export interface LatexNode { start: number; end: number; children: LatexNode[]; label: string; }
/** Source spans retain whitespace and incomplete input instead of rewriting the user's TeX. */
export function latexTree(source: string): LatexNode {
  function parse(start: number, end: number, label: string): LatexNode {
    const node: LatexNode = { start, end, label, children: [] };
    let i = start;
    while (i < end) {
      if (/\s/.test(source[i])) { i++; continue; }
      const a = i; const children: LatexNode[] = [];
      const environment = source.slice(i).match(/^\\begin\{([a-zA-Z*]+)\}/);
      if (environment) {
        const bodyStart = i + environment[0].length;
        const closing = `\\end{${environment[1]}}`;
        const close = source.indexOf(closing, bodyStart);
        const bodyEnd = close < 0 ? end : close;
        const separators = /&|\\\\/g; separators.lastIndex = bodyStart;
        let cellStart = bodyStart, match: RegExpExecArray | null;
        while ((match = separators.exec(source)) && match.index < bodyEnd) {
          children.push(parse(cellStart, match.index, 'Celda')); cellStart = match.index + match[0].length;
        }
        children.push(parse(cellStart, bodyEnd, 'Celda'));
        i = close < 0 ? end : close + closing.length;
        node.children.push({ start: a, end: i, children, label: 'Matriz o sistema' });
        continue;
      }
      if (source[i] === '\\') { i++; while (i < end && /[a-zA-Z]/.test(source[i])) i++; if (i === a + 1) i++; }
      else i++;
      while (i < end) {
        let p = i; while (/\s/.test(source[p] || '') && p < end) p++;
        const script = source[p] === '^' || source[p] === '_';
        const scriptLabel = source[p] === '^' ? 'Exponente' : 'Subíndice';
        if (script) p++;
        if (script && source[p] !== '{') {
          let q = p + 1;
          if (source[p] === '\\') while (q < end && /[a-zA-Z]/.test(source[q])) q++;
          children.push(parse(p, q, scriptLabel)); i = q; continue;
        }
        if (source[p] === '[' && source.slice(a, i).startsWith('\\sqrt')) {
          const q = source.indexOf(']', p + 1); if (q >= 0 && q < end) { children.push(parse(p + 1, q, 'Índice de raíz')); i = q + 1; continue; }
        }
        if (source[p] !== '{') break;
        let depth = 1, q = p + 1;
        while (q < end && depth) { if (source[q] === '{' && source[q - 1] !== '\\') depth++; if (source[q] === '}' && source[q - 1] !== '\\') depth--; q++; }
        children.push(parse(p + 1, depth ? q : q - 1, script ? scriptLabel : children.length ? 'Segundo argumento' : 'Primer argumento'));
        i = q;
      }
      node.children.push({ start: a, end: i, children, label: source.slice(a, i).startsWith('\\frac') ? 'Fracción' : 'Elemento' });
    }
    // Group additive terms, so lateral navigation can select complete summands.
    const terms: LatexNode[] = []; let term: LatexNode[] = [];
    const flush = () => { if (term.length) { terms.push(term.length === 1 ? term[0] : { start: term[0].start, end: term[term.length - 1].end, children: term, label: 'Sumando' }); term = []; } };
    for (const child of node.children) { if (/^[+=−-]$/.test(source.slice(child.start, child.end))) { flush(); terms.push(child); } else term.push(child); }
    flush(); node.children = terms;
    return node;
  }
  return parse(0, source.length, 'Fórmula completa');
}
export function nodePath(root: LatexNode, start: number, end: number): LatexNode[] {
  const result = [root]; let current = root;
  while (true) {
    const child = current.children.find(n => n.start <= start && n.end >= end && (n.start !== current.start || n.end !== current.end || n.children.length));
    if (!child) break; result.push(child); current = child;
  }
  return result;
}
