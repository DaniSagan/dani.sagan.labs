export type Hemisphere = 'north' | 'south';
export type Difficulty = 1 | 2 | 3;
export interface Star { x: number; y: number; hip: number; ra: number; dec: number; mag: number; label: string; labelX: number; labelY: number; anchor: string; }
export interface Constellation {id: string; name: string; latin: string; hemisphere: Hemisphere | 'both'; tip: string; stars: Star[]; segments: number[][]; context: {x: number; y: number; mag: number}[];}
export interface Question {target: Constellation; options: Constellation[];}
export interface Answer {id: string; selected: string; correct: boolean; hints: number; points: number;}
export function shuffle<T>(items: readonly T[], random: () => number = Math.random): T[] {
  const result = [...items]; for (let i = result.length - 1; i > 0; i--) {const j = Math.floor(random() * (i + 1)); [result[i], result[j]] = [result[j], result[i]];} return result;
}
export function pool(catalog: readonly Constellation[], hemisphere: Hemisphere): Constellation[] {return catalog.filter(c => c.hemisphere === hemisphere || c.hemisphere === 'both');}
export function makeRound(candidates: readonly Constellation[], count: number, random: () => number = Math.random, targets: readonly Constellation[] = candidates): Question[] {
  return shuffle(targets, random).slice(0, Math.max(1, Math.min(count, targets.length))).map(target => ({target, options: shuffle([target, ...shuffle(candidates.filter(c => c.id !== target.id), random).slice(0,3)], random)}));
}
export function points(difficulty: Difficulty, hints: number, correct: boolean): number {return correct ? Math.max(25, (difficulty + 1) * 50 - hints * 50) : 0;}
export function starRadius(magnitude: number): number {return Math.max(1.3, Math.min(4.5, 4.1 - magnitude * .5));}
export function validProgress(value: any, ids: readonly string[]): boolean {
  return !!value && value.version === 1 && typeof value.best === 'object' && value.best !== null && !Array.isArray(value.best) && Object.entries(value.best).every(([k,v]) => /^(north|south)-[123]-(10|17)$/.test(k) && Number.isInteger(v) && (v as number) >= 0 && (v as number) <= Number(k.split('-')[2]) * (Number(k.split('-')[1]) + 1) * 50) && Array.isArray(value.mastered) && value.mastered.length <= ids.length * 3 && new Set(value.mastered).size === value.mastered.length && value.mastered.every((key: unknown) => typeof key === 'string' && ids.some(id => [1,2,3].some(level => key === `${id}-${level}`)));
}
