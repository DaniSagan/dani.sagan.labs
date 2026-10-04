import { Injectable } from '@angular/core';

/** Geometric solar coordinates using the NOAA / Meeus equations.
 * Azimuth is clockwise from north; atmospheric refraction is not included.
 */
@Injectable({ providedIn: 'root' })
export class SunPositionCalculatorService {
  getYearSunPositions(coords: GeographicCoords, year: number): SunPosition[] {
    const result: SunPosition[] = [];
    for (let day = new Date(year, 0, 1); day.getFullYear() === year; day.setDate(day.getDate() + 1)) {
      for (let minute = 0; minute < 1440; minute++) {
        const date = new Date(year, day.getMonth(), day.getDate(), 0, minute);
        result.push(new SunPosition(this.getSunPosition(coords, date), date));
      }
    }
    return result;
  }

  getSunPosition(coords: GeographicCoords, date: Date): CelestialCoords {
    const t = (this.getJulianDate(date) - 2451545) / 36525;
    const declination = this.getSolarDeclination(t);
    const hourAngle = (this.getSolarTime(date, coords.longitude, this.getEquationOfTime(t)) - 12) * 15 * Math.PI / 180;
    const latitude = coords.latitude * Math.PI / 180;
    const sineElevation = Math.sin(latitude) * Math.sin(declination) + Math.cos(latitude) * Math.cos(declination) * Math.cos(hourAngle);
    const elevation = Math.asin(Math.max(-1, Math.min(1, sineElevation))) * 180 / Math.PI;
    const azimuth = Math.atan2(-Math.sin(hourAngle), Math.tan(declination) * Math.cos(latitude) - Math.sin(latitude) * Math.cos(hourAngle)) * 180 / Math.PI;
    return new CelestialCoords(elevation, this.normalizeAngleDegrees(azimuth));
  }

  getJulianDate(date: Date): number {
    return date.getTime() / 86400000 + 2440587.5;
  }

  private obliquity(t: number): number {
    const mean = 23 + (26 + (21.448 - t * (46.815 + t * (0.00059 - t * 0.001813))) / 60) / 60;
    return (mean + 0.00256 * Math.cos((125.04 - 1934.136 * t) * Math.PI / 180)) * Math.PI / 180;
  }

  getSolarDeclination(t: number): number {
    const meanLongitude = this.normalizeAngleDegrees(280.46646 + t * (36000.76983 + 0.0003032 * t));
    const anomaly = (357.52911 + t * (35999.05029 - 0.0001537 * t)) * Math.PI / 180;
    const center = Math.sin(anomaly) * (1.914602 - t * (0.004817 + 0.000014 * t))
      + Math.sin(2 * anomaly) * (0.019993 - 0.000101 * t) + Math.sin(3 * anomaly) * 0.000289;
    const apparentLongitude = (meanLongitude + center - 0.00569 - 0.00478 * Math.sin((125.04 - 1934.136 * t) * Math.PI / 180)) * Math.PI / 180;
    return Math.asin(Math.sin(this.obliquity(t)) * Math.sin(apparentLongitude));
  }

  /** Equation of time in hours, preserving the existing public API. */
  getEquationOfTime(t: number): number {
    const longitude = this.normalizeAngleDegrees(280.46646 + t * (36000.76983 + 0.0003032 * t)) * Math.PI / 180;
    const anomaly = (357.52911 + t * (35999.05029 - 0.0001537 * t)) * Math.PI / 180;
    const eccentricity = 0.016708634 - t * (0.000042037 + 0.0000001267 * t);
    const y = Math.tan(this.obliquity(t) / 2) ** 2;
    const equation = y * Math.sin(2 * longitude) - 2 * eccentricity * Math.sin(anomaly)
      + 4 * eccentricity * y * Math.sin(anomaly) * Math.cos(2 * longitude)
      - 0.5 * y * y * Math.sin(4 * longitude) - 1.25 * eccentricity ** 2 * Math.sin(2 * anomaly);
    return 4 * equation * 180 / Math.PI / 60;
  }

  getSolarTime(date: Date, longitude: number, eqTime: number): number {
    const utcHours = date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600 + date.getUTCMilliseconds() / 3600000;
    return ((utcHours + longitude / 15 + eqTime) % 24 + 24) % 24;
  }

  normalizeAngleDegrees(angle: number): number {
    return ((angle % 360) + 360) % 360;
  }
}

export class SunPosition {
  constructor(public celestialCoords: CelestialCoords, public date: Date) {}
}
export class CelestialCoords {
  constructor(public elevation: number, public azimuth: number) {}
}
export class GeographicCoords {
  constructor(public latitude: number, public longitude: number) {}
}
