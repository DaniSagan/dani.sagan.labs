import { SunPositionCalculatorService, GeographicCoords } from './sun-position-calculator-service.service';

describe('Solar position calculations', () => {
  const service = new SunPositionCalculatorService();
  it('uses the Julian epoch and continuous dates through January, February and leap days', () => {
    expect(service.getJulianDate(new Date('2000-01-01T12:00:00Z'))).toBe(2451545);
    expect(service.getJulianDate(new Date('1970-01-01T00:00:00Z'))).toBe(2440587.5);
    expect(service.getJulianDate(new Date('2024-03-01T00:00:00Z')) - service.getJulianDate(new Date('2024-02-28T00:00:00Z'))).toBe(2);
    expect(service.getJulianDate(new Date('2024-01-01T00:00:01Z')) - service.getJulianDate(new Date('2024-01-01T00:00:00Z'))).toBeCloseTo(1 / 86400, 7);
  });
  it('agrees with the NREL SPA reference example within 0.1 degree', () => {
    // NREL SPA report: 2003-10-17 12:30:30 UTC-7, latitude 39.742476, longitude -105.1786.
    const position = service.getSunPosition(new GeographicCoords(39.742476, -105.1786), new Date('2003-10-17T19:30:30Z'));
    expect(Math.abs(position.elevation - 39.872)).toBeLessThan(0.1);
    expect(Math.abs(position.azimuth - 194.34024)).toBeLessThan(0.1);
  });
  it('keeps the equation of time within its physical range throughout the year', () => {
    for (let month = 0; month < 12; month++) {
      const t = (service.getJulianDate(new Date(Date.UTC(2026, month, 1))) - 2451545) / 36525;
      expect(Math.abs(service.getEquationOfTime(t))).toBeLessThan(0.3);
    }
  });
  it('handles polar day, polar night and azimuth normalization', () => {
    const coords = new GeographicCoords(69.65, 18.96);
    expect(service.getSunPosition(coords, new Date('2026-06-21T00:00:00Z')).elevation).toBeGreaterThan(0);
    expect(service.getSunPosition(coords, new Date('2026-12-21T12:00:00Z')).elevation).toBeLessThan(0);
    expect(service.normalizeAngleDegrees(360)).toBe(0);
    expect(service.normalizeAngleDegrees(-90)).toBe(270);
  });
});
