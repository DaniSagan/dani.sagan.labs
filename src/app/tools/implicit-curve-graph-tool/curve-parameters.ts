export interface CurveParameter {
  name: string;
  value: number;
  min: number;
  max: number;
  step: number;
  error: string;
}

/** Read whole identifiers, skipping literals, comments and scientific notation.
 * Catalog names and property accesses are not user parameters. */
export function detectCurveParameters(expression: string, reserved: ReadonlySet<string>): string[] {
  const tokens = /\/\*[\s\S]*?\*\/|\/\/[^\n]*|"(?:\\[\s\S]|[^"\\])*"|'(?:\\[\s\S]|[^'\\])*'|`(?:\\[\s\S]|[^`\\])*`|\b0[xX][\da-fA-F]+|\b0[bB][01]+|\b0[oO][0-7]+|(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?|[\p{L}_$][\p{L}\p{M}\p{N}_$]*/gu;
  const names = new Set<string>();
  let match: RegExpExecArray | null;
  while ((match = tokens.exec(expression)) !== null) {
    const name = match[0];
    if (!/^\p{L}(?:_[\p{L}\p{N}_]+)?$/u.test(name) || reserved.has(name)) continue;
    if (expression.slice(0, match.index).trimEnd().endsWith('.')) continue;
    names.add(name);
  }
  return [...names];
}
