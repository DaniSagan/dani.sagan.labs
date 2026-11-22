export type Level = 0 | 1 | 2;

type Case = readonly [answer: string, prompt: string, explanation: string];

export type CaseGroup = readonly [
  slug: string, article: string, extraLevel: Level,
  introductory: Case, intermediate: Case, advanced: Case, extra: Case,
];
