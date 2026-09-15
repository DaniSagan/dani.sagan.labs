export function montyRound(prize: number, choice: number, random: () => number = Math.random) {
  if (![prize, choice].every(n => Number.isInteger(n) && n >= 0 && n <= 2)) throw new Error('Elige una puerta entre 0 y 2.');
  const eligible = [0, 1, 2].filter(door => door !== prize && door !== choice);
  const opened = eligible[Math.floor(random() * eligible.length)];
  const switched = [0, 1, 2].find(door => door !== choice && door !== opened)!;
  return { prize, choice, opened, switched, stayWins: choice === prize, switchWins: switched === prize };
}
