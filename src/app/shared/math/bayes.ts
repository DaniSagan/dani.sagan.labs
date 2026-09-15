export function bayes(prior: number, sensitivity: number, falsePositive: number) {
  if (![prior, sensitivity, falsePositive].every(p => Number.isFinite(p) && p >= 0 && p <= 1)) {
    throw new Error('Las probabilidades deben estar entre 0 y 1.');
  }
  const truePositive = prior * sensitivity;
  const falseAlarm = (1 - prior) * falsePositive;
  const missed = prior * (1 - sensitivity);
  const correctNegative = (1 - prior) * (1 - falsePositive);
  const evidence = truePositive + falseAlarm;
  const negative = missed + correctNegative;
  return { truePositive, falseAlarm, missed, correctNegative, evidence,
    posterior: evidence === 0 ? null : truePositive / evidence,
    negativePosterior: negative === 0 ? null : missed / negative };
}
