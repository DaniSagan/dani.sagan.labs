export type Direction = 'left' | 'right' | 'up' | 'down';
export interface Tile { id: number; value: number; row: number; col: number; fresh?: boolean; merged?: boolean; ghost?: boolean; }
export function spawnTile(tiles: Tile[], random: () => number = Math.random, nextId = Math.max(0, ...tiles.map(t => t.id)) + 1): Tile[] {
  const empty: number[] = [];
  for (let i = 0; i < 16; i++) if (!tiles.some(t => t.row * 4 + t.col === i)) empty.push(i);
  if (!empty.length) return tiles;
  const cell = empty[Math.min(empty.length - 1, Math.floor(random() * empty.length))];
  return [...tiles.map(t => ({...t, fresh: false})), {id: nextId, value: random() < .9 ? 2 : 4, row: Math.floor(cell / 4), col: cell % 4, fresh: true}];
}
export function moveBoard(input: Tile[], direction: Direction): {tiles: Tile[]; animation: Tile[]; gain: number; changed: boolean} {
  const tiles: Tile[] = [], animation: Tile[] = []; let gain = 0, changed = false;
  const vertical = direction === 'up' || direction === 'down', reverse = direction === 'right' || direction === 'down';
  for (let line = 0; line < 4; line++) {
    const source = input.filter(t => (vertical ? t.col : t.row) === line).sort((a, b) => (vertical ? a.row - b.row : a.col - b.col) * (reverse ? -1 : 1));
    let position = 0;
    for (let i = 0; i < source.length; i++) {
      const a = source[i], b = source[i + 1]; const coordinate = reverse ? 3 - position : position;
      const row = vertical ? coordinate : line, col = vertical ? line : coordinate;
      const merge = !!b && a.value === b.value;
      const tile = {...a, row, col, value: merge ? a.value * 2 : a.value, fresh: false, merged: merge, ghost: false};
      tiles.push(tile); animation.push({...a, row, col, fresh: false, merged: false});
      changed = changed || a.row !== row || a.col !== col || merge;
      if (merge) { gain += tile.value; animation.push({...b, row, col, fresh: false, ghost: true}); i++; }
      position++;
    }
  }
  return {tiles, animation, gain, changed};
}
export function canMove(tiles: Tile[]): boolean {
  if (tiles.length < 16) return true;
  return tiles.some(a => tiles.some(b => a.value === b.value && Math.abs(a.row - b.row) + Math.abs(a.col - b.col) === 1));
}
export function validSave(s: any): boolean {
  return !!s && Array.isArray(s.tiles) && s.tiles.length >= 2 && s.tiles.length <= 16 &&
    s.tiles.every((t: any) => Number.isSafeInteger(t.id) && t.id > 0 && Number.isSafeInteger(t.value) && t.value >= 2 && Number.isInteger(Math.log2(t.value)) && Number.isInteger(t.row) && t.row >= 0 && t.row < 4 && Number.isInteger(t.col) && t.col >= 0 && t.col < 4) &&
    new Set(s.tiles.map((t: Tile) => t.row * 4 + t.col)).size === s.tiles.length && new Set(s.tiles.map((t: Tile) => t.id)).size === s.tiles.length &&
    [s.score, s.best, s.moves].every(n => Number.isSafeInteger(n) && n >= 0) && typeof s.won === 'boolean' && typeof s.continued === 'boolean' && (!s.continued || s.won) && s.won === s.tiles.some((t: Tile) => t.value >= 2048);
}
