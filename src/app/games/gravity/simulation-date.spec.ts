import {
  DAY_MS,
  REFERENCE_UTC_MS,
  parseUtcInput,
  utcInputValue,
} from './simulation-date';
import { GravityModel } from './gravity.model';
import { J2000, orbitalState } from './orbital-elements';

describe('UTC simulation calendar', () => {
  it('interprets wall-clock input in UTC, including seconds, fractions and daylight-saving dates', () => {
    expect(parseUtcInput('2026-03-29T02:30:15.125')).toBe(
      Date.parse('2026-03-29T02:30:15.125Z'),
    );
    expect(parseUtcInput('2026-10-25T02:30')).toBe(
      Date.parse('2026-10-25T02:30:00.000Z'),
    );
    expect(parseUtcInput('2000-01-01T12:00:00')).toBe(REFERENCE_UTC_MS);
    expect(utcInputValue(Date.parse('2024-02-29T23:59:59.999Z'))).toBe(
      '2024-02-29T23:59:59.999',
    );
  });
  it('rejects impossible dates, empty input and timezone suffixes', () => {
    for (const invalid of [
      '',
      '2026-02-30T12:00',
      '2026-02-29T12:00',
      '2026-01-01T24:00',
      '2026-01-01T00:00:60',
      '0000-01-01T00:00',
      '2026-01-01T12:00Z',
      '2026-01-01T12:00+02:00',
    ])
      expect(parseUtcInput(invalid)).toBeUndefined();
  });
  it('advances the UTC date by the integrated time across midnight and leap day', () => {
    const model = new GravityModel();
    model.load('custom', Date.parse('2024-02-28T23:59:59.000Z'));
    model.step(2 / 86400);
    expect(new Date(model.dateUtcMs).toISOString()).toBe(
      '2024-02-29T00:00:01.000Z',
    );
  });
  it('reinitialises a moon relative to its moving host at a selected date', () => {
    const model = new GravityModel();
    model.load('solar');
    const moon = model.bodies.find((b) => b.name === 'Luna')!,
      earth = model.bodies.find((b) => b.id === moon.parentId)!;
    const before = [...earth.position];
    model.setDate(REFERENCE_UTC_MS + DAY_MS * 10);
    const state = orbitalState(moon.orbit!, J2000 + 10);
    state.position.forEach((p, k) =>
      expect(moon.position[k] - earth.position[k]).toBeCloseTo(p, 10),
    );
    expect(earth.position).not.toEqual(before);
    expect(model.time).toBe(0);
    expect(model.dateUtcMs).toBe(REFERENCE_UTC_MS + DAY_MS * 10);
    expect(
      model.bodies.every((b) =>
        [...b.position, ...b.velocity].every(Number.isFinite),
      ),
    ).toBeTrue();
  });
  it('dates a custom state without changing its position or velocity', () => {
    const model = new GravityModel();
    model.load('custom');
    model.bodies[0].position = [1, 2, 3];
    model.setDate(Date.parse('2030-01-01T00:00:00.500Z'), false);
    expect(model.bodies[0].position).toEqual([1, 2, 3]);
    expect(new Date(model.dateUtcMs).toISOString()).toBe(
      '2030-01-01T00:00:00.500Z',
    );
    expect(() => model.setDate(NaN)).toThrow();
  });
});
