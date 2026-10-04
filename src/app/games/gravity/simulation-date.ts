export const DAY_MS = 86400000;
// Calendar reference for this educational model, not a UTC-to-TDB conversion.
export const REFERENCE_UTC_MS = Date.parse('2000-01-01T12:00:00.000Z');
export const MIN_UTC_MS = Date.parse('0001-01-01T00:00:00.000Z');
export const MAX_UTC_MS = Date.parse('9999-12-31T23:59:59.999Z');
export function validSimulationDate(value: number): boolean {
  return Number.isFinite(value) && value >= MIN_UTC_MS && value <= MAX_UTC_MS;
}
/** datetime-local is a wall-clock string: explicitly interpret it as UTC, never local time. */
export function parseUtcInput(value: string): number | undefined {
  const match =
    /^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2})(?::(\d{2})(?:\.(\d{1,3}))?)?$/.exec(
      value,
    );
  if (!match) return undefined;
  const normalized = `${match[1]}T${match[2]}:${match[3] ?? '00'}.${(match[4] ?? '').padEnd(3, '0')}Z`;
  const milliseconds = Date.parse(normalized);
  if (
    !validSimulationDate(milliseconds) ||
    new Date(milliseconds).toISOString() !== normalized
  )
    return undefined;
  return milliseconds;
}
export function utcInputValue(value: number): string {
  return new Date(value).toISOString().slice(0, -1);
}
