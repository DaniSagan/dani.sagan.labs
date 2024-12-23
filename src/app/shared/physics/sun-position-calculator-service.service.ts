import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SunPositionCalculatorService {

  constructor() { }

  getSunPosition(coords: GeographicCoords, date: Date): CelestialCoords {
    const jd = this.getJulianDate(date);
    const T = (jd - 2451545.0) / 36525.0;

    const solarDeclination = this.getSolarDeclination(T);
    const eqTime = this.getEquationOfTime(T);

    const solarTime = this.getSolarTime(date, coords.longitude, eqTime);
    const hourAngle = (solarTime - 12) * 15 * (Math.PI / 180);

    const latRad = coords.latitude * (Math.PI / 180);

    const elevation = Math.asin(Math.sin(latRad) * Math.sin(solarDeclination) + Math.cos(latRad) * Math.cos(solarDeclination) * Math.cos(hourAngle));
    const azimuth = Math.atan2(-Math.sin(hourAngle), Math.tan(solarDeclination) * Math.cos(latRad) - Math.sin(latRad) * Math.cos(hourAngle));

    const elevationDegrees = elevation * (180 / Math.PI); // Convertir a grados
    const azimuthDegrees = this.normalizeAngleDegrees(azimuth * (180 / Math.PI)); // Convertir a grados

    return new CelestialCoords(elevationDegrees, azimuthDegrees);
  }

  getJulianDate(date: Date): number {
    const Y = date.getUTCFullYear();
    const M = date.getUTCMonth() + 1;
    const D = date.getUTCDate();
    const A = Math.floor(Y / 100);
    const B = 2 - A + Math.floor(A / 4);
    const JD = Math.floor(365.25 * (Y + 4716)) + Math.floor(30.6001 * (M + 1)) + D + B - 1524.5;
    const dayFraction = (date.getUTCHours() + date.getUTCMinutes() / 60) / 24;
    return JD + dayFraction;
  }

  getSolarDeclination(T: number): number {
    const epsilon = 23.439292 * (Math.PI / 180);
    const L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;
    const M = 357.52911 + 35999.05029 * T - 0.0001537 * T * T;
    const C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(M * Math.PI / 180)
            + (0.019993 - 0.000101 * T) * Math.sin(2 * M * Math.PI / 180)
            + 0.000289 * Math.sin(3 * M * Math.PI / 180);
    const theta = L0 + C;
    const lambda = theta * Math.PI / 180;
    return Math.asin(Math.sin(epsilon) * Math.sin(lambda));
  }

  getEquationOfTime(T: number): number {
    const epsilon = 23.439292 * (Math.PI / 180);
    const L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;
    const M = 357.52911 + 35999.05029 * T - 0.0001537 * T * T;
    const C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(M * Math.PI / 180)
            + (0.019993 - 0.000101 * T) * Math.sin(2 * M * Math.PI / 180)
            + 0.000289 * Math.sin(3 * M * Math.PI / 180);
    const theta = L0 + C;
    const lambda = theta * Math.PI / 180;
    const Etime = 4 * ((L0 - 0.0057183 - Math.atan2(Math.cos(epsilon) * Math.sin(lambda), Math.cos(lambda)) * (180 / Math.PI)) % 360);
    return Etime / 60;
  }

  getSolarTime(date: Date, longitude: number, eqTime: number): number {
    const utcHours = date.getUTCHours() + date.getUTCMinutes() / 60;
    return utcHours + longitude / 15 + eqTime;
  }

  normalizeAngleDegrees(angle: number) {
    let res: number = angle;
    while(res < 0) {
      res += 360;
    }
    while(res > 360) {
      res -= 360;
    }
    return res;
  }
}

export class CelestialCoords {
  elevation: number;
  azimuth: number;

  constructor(elevation: number, azimuth: number) {
    this.elevation = elevation;
    this.azimuth = azimuth;
  }
}

export class GeographicCoords {
  latitude: number;
  longitude: number;

  constructor(latitude: number, longitude: number) {
    this.latitude = latitude;
    this.longitude = longitude;
  }
}
