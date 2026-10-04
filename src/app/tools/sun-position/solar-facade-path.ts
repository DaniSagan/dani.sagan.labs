import { CelestialCoords } from 'src/app/shared/physics/sun-position-calculator-service.service';

export function facadeAngle(azimuth: number, orientation: number): number {
  return ((azimuth - orientation + 180) % 360 + 360) % 360 - 180;
}

export function facadeTrajectory(samples: { position: CelestialCoords; minute: number }[], orientation: number): {
  daylight: string; night: string; labels: { x: number; y: number; minute: number }[];
} {
  const daylight: string[] = [], night: string[] = [], labels: { x: number; y: number; minute: number }[] = [];
  let previousAngle: number | undefined, previousDaylight: boolean | undefined;
  const labelledMinutes = new Set<number>();
  for (const { position, minute } of samples) {
    const angle = facadeAngle(position.azimuth, orientation);
    const visible = position.elevation >= 0;
    const x = (angle + 180) * 2, y = 20 + (90 - position.elevation) * 2;
    // Split at the rear of the facade instead of drawing a line across the whole chart.
    const start = previousAngle === undefined || Math.abs(angle - previousAngle) > 180 || visible !== previousDaylight;
    (visible ? daylight : night).push(`${start ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`);
    if (visible && minute % 180 === 0 && !labelledMinutes.has(minute)) {
      labels.push({ x, y, minute }); labelledMinutes.add(minute);
    }
    previousAngle = angle; previousDaylight = visible;
  }
  return { daylight: daylight.join(' '), night: night.join(' '), labels };
}
