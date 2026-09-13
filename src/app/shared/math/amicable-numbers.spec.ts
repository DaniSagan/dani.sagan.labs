import { amicableJourney, findAmicablePairs } from './amicable-numbers';

describe('amicable numbers', () => {
  it('checks both directions and distinguishes perfect numbers and termination', () => {
    const result = amicableJourney(220);
    expect(result.partner).toBe(284); expect(result.returned).toBe(220); expect(result.kind).toBe('amicable');
    expect(amicableJourney(284).partner).toBe(220);
    expect(amicableJourney(1184).partner).toBe(1210);
    expect(amicableJourney(6).kind).toBe('perfect');
    expect(amicableJourney(12).kind).toBe('other');
    expect(amicableJourney(1).returned).toBeNull();
    expect(amicableJourney(13).returned).toBe(0);
  });
  it('finds complete pairs once and honors inclusive boundaries', () => {
    expect(findAmicablePairs(250)).toEqual([]);
    expect(findAmicablePairs(284)).toEqual([[220, 284]]);
    expect(findAmicablePairs(10000)).toEqual([[220, 284], [1184, 1210], [2620, 2924], [5020, 5564], [6232, 6368]]);
    [0, -1, 1.5, NaN, Infinity, 100001].forEach(n => expect(() => findAmicablePairs(n)).toThrow());
    [0, -1, 1.5, NaN, Infinity, 1000001].forEach(n => expect(() => amicableJourney(n)).toThrow());
  });
});
