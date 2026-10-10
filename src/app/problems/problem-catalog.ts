import { NavbarSubsection } from '../shared/content/navbar-subsection';

export type ProblemLevel = 'Repaso' | 'Oposición' | 'Reto';
export interface ProblemResource { label: string; route: string; activity: string; }
export interface PracticeProblem {
  id: string; number: number; title: string; category: string; topic: string;
  level: ProblemLevel; statement: string; resources: ProblemResource[];
}
export interface ProblemBlock {
  name: string; topics: [string, string]; problems: PracticeProblem[];
}

export const OFFICIAL_SOURCES = [
  { label: 'Educastur · criterios de Matemáticas, procedimiento 2024–2025',
    url: 'https://www.educastur.es/documents/34868/19889839/CRITERIOS%2B0590006%2BMATEMATICAS.pdf/b31553fe-029b-2dc9-1b6c-5c71455406db?t=1749470137916&version=2.0' },
  { label: 'BOE · Orden de 9 de septiembre de 1993 (temarios)',
    url: 'https://www.boe.es/diario_boe/txt.php?id=BOE-A-1993-23257' },
];

export function problemNavigation(blocks: ProblemBlock[]): NavbarSubsection[] {
  return blocks.map(group => ({ name: group.name, items: [], subsections: group.topics.map(topic => ({
    name: topic, items: group.problems.filter(problem => problem.topic === topic)
      .map(problem => ({ name: problem.title, route: problem.id }))
  })) }));
}
