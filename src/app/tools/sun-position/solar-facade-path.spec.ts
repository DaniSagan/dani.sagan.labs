import { CelestialCoords } from 'src/app/shared/physics/sun-position-calculator-service.service';
import { facadeAngle, facadeTrajectory } from './solar-facade-path';

describe('Solar trajectory relative to a facade', () => {
  it('centres on the facade and distinguishes left from right across north', () => {
    expect(facadeAngle(180, 180)).toBe(0);
    expect(facadeAngle(90, 180)).toBe(-90);
    expect(facadeAngle(270, 180)).toBe(90);
    expect(facadeAngle(10, 350)).toBe(20);
    expect(facadeAngle(350, 10)).toBe(-20);
    expect(facadeAngle(0, 180)).toBe(-180);
  });
  it('splits the trajectory when it crosses the minus/plus 180 degree boundary', () => {
    const path = facadeTrajectory([
      { position: new CelestialCoords(30, 179), minute: 720 },
      { position: new CelestialCoords(31, 181), minute: 721 },
      { position: new CelestialCoords(32, 182), minute: 722 },
    ], 0);
    expect(path.daylight).toBe('M718.00,140.00 M2.00,138.00 L4.00,136.00');
    expect(path.night).toBe('');
  });
  it('separates night and daylight and labels civil hours only once', () => {
    const path = facadeTrajectory([
      { position: new CelestialCoords(-10, 170), minute: 360 },
      { position: new CelestialCoords(10, 180), minute: 540 },
      { position: new CelestialCoords(20, 190), minute: 540 },
    ], 180);
    expect(path.night).toBe('M340.00,220.00');
    expect(path.daylight).toBe('M360.00,180.00 L380.00,160.00');
    expect(path.labels).toEqual([{ x: 360, y: 180, minute: 540 }]);
  });
});
