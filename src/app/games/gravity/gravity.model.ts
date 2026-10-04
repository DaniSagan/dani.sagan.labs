import { MINOR_BODY_CATALOG, MOON_CATALOG } from './solar-catalog.data';
import {
  AU_KM,
  J2000,
  OrbitalElements,
  orbitalState,
} from './orbital-elements';
import {
  DAY_MS,
  REFERENCE_UTC_MS,
  validSimulationDate,
} from './simulation-date';
export type Vec3 = [number, number, number];
export const MAX_BODIES = 640;
export type BodyKind =
  | 'star'
  | 'planet'
  | 'moon'
  | 'dwarf'
  | 'candidate'
  | 'asteroid';
export interface CelestialBody {
  id: number;
  name: string;
  mass: number;
  radius: number;
  color: string;
  position: Vec3;
  velocity: Vec3;
  star: boolean;
  kind?: BodyKind;
  parentId?: number;
  orbit?: OrbitalElements;
  catalog?: boolean;
  note?: string;
}
// AU, solar masses, days. G = 4π² / (sidereal year in days)².
export const G = 0.0002959122082855911;
export const SCENARIOS = [
  {
    id: 'solar',
    name: 'Sistema solar',
    description:
      'Ocho planetas, 464 lunas, cinco planetas enanos, cuatro candidatos y catorce asteroides destacados. Catálogo JPL del 3 de octubre de 2026.',
  },
  {
    id: 'trappist',
    name: 'TRAPPIST-1',
    description:
      'Siete mundos alrededor de una enana roja. Modelo educativo aproximado.',
  },
  {
    id: 'kepler',
    name: 'Kepler-16',
    description:
      'Un planeta circumbinario y dos soles. Modelo educativo aproximado.',
  },
  {
    id: 'custom',
    name: 'Mi universo',
    description:
      'Construye un sistema con masas, posiciones y velocidades propias.',
  },
];
export class GravityModel {
  bodies: CelestialBody[] = [];
  time = 0;
  epochUtcMs = REFERENCE_UTC_MS;
  get dateUtcMs(): number {
    return this.epochUtcMs + this.time * DAY_MS;
  }
  add(body: Omit<CelestialBody, 'id'>): CelestialBody {
    if (
      !body.name.trim() ||
      !Number.isFinite(body.mass) ||
      body.mass < 0 ||
      (!body.catalog && body.mass === 0) ||
      !Number.isFinite(body.radius) ||
      body.radius < 0 ||
      (!body.catalog && body.radius === 0) ||
      ![...body.position, ...body.velocity].every(Number.isFinite)
    )
      throw new Error(
        'Introduce valores finitos y una masa y radio positivos.',
      );
    if (this.bodies.length >= MAX_BODIES)
      throw new Error(`El límite es de ${MAX_BODIES} cuerpos.`);
    const result = {
      ...body,
      id: Math.max(0, ...this.bodies.map((b) => b.id)) + 1,
      position: [...body.position] as Vec3,
      velocity: [...body.velocity] as Vec3,
    };
    this.bodies.push(result);
    return result;
  }
  load(id: string, dateUtcMs = REFERENCE_UTC_MS): void {
    if (!validSimulationDate(dateUtcMs))
      throw new Error('Fecha UTC fuera del intervalo admitido.');
    this.bodies = [];
    this.time = 0;
    const star = (name: string, mass: number, color: string, x = 0, vz = 0) =>
      this.add({
        name,
        mass,
        color,
        radius: 0.00465 * Math.pow(mass, 0.8),
        position: [x, 0, 0],
        velocity: [0, 0, vz],
        star: true,
      });
    const planet = (
      name: string,
      mass: number,
      r: number,
      color: string,
      host: number,
      phase: number,
      radius = 0.000043,
    ) =>
      this.add({
        name,
        mass,
        color,
        radius,
        position: [r * Math.cos(phase), 0, r * Math.sin(phase)],
        velocity: [
          -Math.sin(phase) * Math.sqrt((G * host) / r),
          0,
          Math.cos(phase) * Math.sqrt((G * host) / r),
        ],
        star: false,
        parentId: this.bodies[0].id,
        orbit: {
          a: r,
          e: 0,
          inclination: 180,
          node: 0,
          argument: 0,
          meanAnomaly: (phase * 180) / Math.PI,
          period: 2 * Math.PI * Math.sqrt(r ** 3 / (G * host)),
          epoch: J2000,
        },
      });
    if (id === 'trappist') {
      star('TRAPPIST-1', 0.0898, '#ff8054');
      [0.01154, 0.0158, 0.02227, 0.02925, 0.03849, 0.04683, 0.06189].forEach(
        (r, i) =>
          planet(
            'TRAPPIST-1 ' + 'bcdefgh'[i],
            [1.374, 1.308, 0.388, 0.692, 1.039, 1.321, 0.326][i] * 3.003e-6,
            r,
            [
              '#d69870',
              '#c8b1a0',
              '#f2c278',
              '#6aabe2',
              '#bc8366',
              '#8eafb9',
              '#a4b8e1',
            ][i],
            0.0898,
            i * 0.9,
          ),
      );
    } else if (id === 'kepler') {
      const a = 0.224,
        m1 = 0.69,
        m2 = 0.203,
        w = Math.sqrt((G * (m1 + m2)) / a ** 3);
      star(
        'Kepler-16 A',
        m1,
        '#ffc573',
        (-a * m2) / (m1 + m2),
        ((-a * m2) / (m1 + m2)) * w,
      );
      star(
        'Kepler-16 B',
        m2,
        '#ff7655',
        (a * m1) / (m1 + m2),
        ((a * m1) / (m1 + m2)) * w,
      );
      planet('Kepler-16 b', 0.000318, 0.705, '#d9b092', m1 + m2, 1.5, 0.00032);
      const period = (2 * Math.PI) / w;
      this.bodies[0].orbit = {
        a: (a * m2) / (m1 + m2),
        e: 0,
        inclination: 180,
        node: 0,
        argument: 0,
        meanAnomaly: 180,
        period,
        epoch: J2000,
      };
      this.bodies[1].orbit = {
        ...this.bodies[0].orbit,
        a: (a * m1) / (m1 + m2),
        meanAnomaly: 0,
      };
      delete this.bodies[2].parentId; // Circumbinary orbit is centred on the system barycentre.
    } else {
      star('Sol', 1, '#ffd278');
      if (id !== 'custom') {
        const names = [
          'Mercurio',
          'Venus',
          'Tierra',
          'Marte',
          'Júpiter',
          'Saturno',
          'Urano',
          'Neptuno',
        ];
        const distances = [0.387, 0.723, 1, 1.524, 5.203, 9.537, 19.19, 30.07];
        const masses = [
          1.66e-7, 2.448e-6, 3.003e-6, 3.227e-7, 0.0009543, 0.0002857,
          0.00004365, 0.00005149,
        ];
        const colors = [
          '#a9a09a',
          '#e4bc79',
          '#4a9be8',
          '#dc7451',
          '#d8b492',
          '#eed39d',
          '#78d4de',
          '#537ee9',
        ];
        distances.forEach((r, i) =>
          planet(
            names[i],
            masses[i],
            r,
            colors[i],
            1,
            i * 1.3,
            [
              0.0000163, 0.0000405, 0.0000426, 0.0000227, 0.000478, 0.000403,
              0.000171, 0.000165,
            ][i],
          ),
        );
        const sun = this.bodies[0];
        this.bodies.slice(1).forEach((b) => {
          b.kind = 'planet';
          b.parentId = sun.id;
        });
        this.loadSolarCatalog();
      }
    }
    this.setDate(dateUtcMs);
  }
  /** Reinitialise preset orbits at the selected calendar date, or date an existing custom state. */
  setDate(dateUtcMs: number, reinitialise = true): void {
    if (!validSimulationDate(dateUtcMs))
      throw new Error('Fecha UTC fuera del intervalo admitido.');
    if (reinitialise) {
      const day = J2000 + (dateUtcMs - REFERENCE_UTC_MS) / DAY_MS;
      const states = new Map<number, { position: Vec3; velocity: Vec3 }>();
      const resolve = (
        body: CelestialBody,
      ): { position: Vec3; velocity: Vec3 } => {
        const previous = states.get(body.id);
        if (previous) return previous;
        const state = body.orbit
          ? orbitalState(body.orbit, day)
          : {
              position: body.star
                ? ([0, 0, 0] as Vec3)
                : ([...body.position] as Vec3),
              velocity: body.star
                ? ([0, 0, 0] as Vec3)
                : ([...body.velocity] as Vec3),
            };
        const parent = this.bodies.find((b) => b.id === body.parentId);
        if (body.orbit && parent) {
          const host = resolve(parent);
          state.position = state.position.map(
            (v, k) => v + host.position[k],
          ) as Vec3;
          state.velocity = state.velocity.map(
            (v, k) => v + host.velocity[k],
          ) as Vec3;
        }
        states.set(body.id, state);
        return state;
      };
      this.bodies.forEach((body) => {
        resolve(body);
      });
      this.bodies.forEach((body) => {
        const state = states.get(body.id)!;
        body.position = state.position;
        body.velocity = state.velocity;
      });
      this.recenter();
    }
    this.epochUtcMs = dateUtcMs;
    this.time = 0;
  }
  private recenter(): void {
    const mass = this.bodies.reduce((s, b) => s + b.mass, 0);
    if (!mass) return;
    for (let k = 0; k < 3; k++) {
      const p =
        this.bodies.reduce((s, b) => s + b.mass * b.position[k], 0) / mass;
      const v =
        this.bodies.reduce((s, b) => s + b.mass * b.velocity[k], 0) / mass;
      this.bodies.forEach((b) => {
        b.position[k] -= p;
        b.velocity[k] -= v;
      });
    }
  }
  private loadSolarCatalog(): void {
    const names: Record<string, string> = {
      Earth: 'Tierra',
      Mars: 'Marte',
      Jupiter: 'Júpiter',
      Saturn: 'Saturno',
      Uranus: 'Urano',
      Neptune: 'Neptuno',
      Pluto: 'Plutón',
    };
    // Rounded physical values from NASA dwarf-planet facts and orbital-mass papers.
    const physical: Record<string, [number, number]> = {
      Pluto: [1.303e22 / 1.98847e30, 1188.3 / AU_KM],
      Eris: [1.6466e22 / 1.98847e30, 1163 / AU_KM],
      Haumea: [4.006e21 / 1.98847e30, 780 / AU_KM],
      Makemake: [0, 715 / AU_KM],
    };
    const sun = this.bodies[0];
    for (const record of MINOR_BODY_CATALOG) {
      const state = orbitalState(record);
      const values = physical[record.name] ?? [record.mass, record.radius];
      this.add({
        name: names[record.name] ?? record.name,
        mass: values[0],
        radius: values[1],
        position: state.position,
        velocity: state.velocity,
        color: record.kind === 'asteroid' ? '#b9a890' : '#b4c4df',
        star: false,
        kind: record.kind as BodyKind,
        parentId: sun.id,
        orbit: { ...record },
        catalog: true,
        note:
          record.kind === 'candidate'
            ? 'Candidato a planeta enano; clasificación no oficial.'
            : record.name === 'Haumea'
              ? 'Radio equivalente aproximado; Haumea no es esférico.'
              : undefined,
      });
    }
    for (const record of MOON_CATALOG) {
      const host = this.bodies.find((b) => b.name === names[record.parent]);
      if (!host)
        throw new Error(`No se encontró el cuerpo central de ${record.name}.`);
      const date = record.epoch.split('.');
      const epoch =
        Date.parse(date[0] + 'T00:00:00Z') / 86400000 +
        2440587.5 +
        Number('0.' + (date[1] ?? '0'));
      const pole =
        record.frame === 'equatorial'
          ? record.parent === 'Uranus'
            ? [257.311, -15.175]
            : [132.993, -6.163]
          : [record.poleRA, record.poleDec];
      const orbit: OrbitalElements = {
        ...record,
        epoch,
        poleRA: pole[0],
        poleDec: pole[1],
      };
      this.addSatellite(
        record.name === 'Moon' ? 'Luna' : record.name,
        host,
        orbit,
        record.mass,
        record.radius,
      );
    }
    // Supplemental dwarf-planet satellites absent from the JPL mean-elements table.
    // Ragozzine & Brown 2009; Holler et al. 2021; Grundy 2025. Orientations and phases
    // are illustrative where a complete common-frame solution is unavailable.
    const supplemental: [
      string,
      string,
      number,
      number,
      number,
      number,
      number,
    ][] = [
      ['Hiʻiaka', 'Haumea', 49880, 0.0513, 49.462, 150, 1.79e19],
      ['Namaka', 'Haumea', 25657, 0.249, 18.2783, 85, 1.79e18],
      ['Dysnomia', 'Eris', 37273, 0.0062, 15.785899, 0, 0],
      ['MK 2', 'Makemake', 22250, 0, 18.023, 0, 0],
    ];
    for (const [name, parent, a, e, period, radius, mass] of supplemental) {
      const host = this.bodies.find((b) => b.name === parent)!;
      if (parent === 'Makemake') {
        host.mass = (4 * Math.PI ** 2 * (a / AU_KM) ** 3) / (G * period ** 2);
        host.note =
          'Masa aproximada del sistema inferida del semieje y periodo de la órbita preliminar de MK 2.';
      }
      this.addSatellite(
        name,
        host,
        {
          a: a / AU_KM,
          e,
          period,
          inclination: 0,
          node: 0,
          argument: 0,
          meanAnomaly: 90,
          epoch: J2000,
        },
        mass / 1.98847e30,
        radius / AU_KM,
        'Órbita suplementaria aproximada; orientación y fase ilustrativas. MK 2: solución orbital preliminar.',
      );
    }
  }
  private addSatellite(
    name: string,
    parent: CelestialBody,
    orbit: OrbitalElements,
    mass: number,
    radius: number,
    note?: string,
  ): void {
    const state = orbitalState(orbit);
    this.add({
      name,
      mass,
      radius,
      color: '#a8b8cd',
      star: false,
      kind: 'moon',
      catalog: true,
      parentId: parent.id,
      orbit,
      position: state.position.map((v, k) => v + parent.position[k]) as Vec3,
      velocity: state.velocity.map((v, k) => v + parent.velocity[k]) as Vec3,
      note,
    });
  }
  acceleration(position: Vec3): Vec3 {
    const result: Vec3 = [0, 0, 0];
    for (const b of this.bodies) {
      if (!b.mass) continue;
      const x = b.position[0] - position[0],
        y = b.position[1] - position[1],
        z = b.position[2] - position[2];
      const factor =
        (G * b.mass) / Math.pow(x * x + y * y + z * z + 1e-12, 1.5);
      result[0] += x * factor;
      result[1] += y * factor;
      result[2] += z * factor;
    }
    return result;
  }
  private accelerations(): Vec3[] {
    const a = this.bodies.map((): Vec3 => [0, 0, 0]);
    for (let i = 0; i < this.bodies.length; i++)
      for (let j = i + 1; j < this.bodies.length; j++) {
        const left = this.bodies[i],
          right = this.bodies[j];
        if (!left.mass && !right.mass) continue;
        const x = right.position[0] - left.position[0],
          y = right.position[1] - left.position[1],
          z = right.position[2] - left.position[2];
        const f = G / Math.pow(x * x + y * y + z * z + 1e-12, 1.5),
          fLeft = f * right.mass,
          fRight = f * left.mass;
        a[i][0] += fLeft * x;
        a[i][1] += fLeft * y;
        a[i][2] += fLeft * z;
        a[j][0] -= fRight * x;
        a[j][1] -= fRight * y;
        a[j][2] -= fRight * z;
      }
    return a;
  }
  step(dt: number): void {
    const a = this.accelerations();
    this.bodies.forEach((b, i) => {
      for (let k = 0; k < 3; k++) {
        b.velocity[k] += (a[i][k] * dt) / 2;
        b.position[k] += b.velocity[k] * dt;
      }
    });
    const next = this.accelerations();
    this.bodies.forEach((b, i) => {
      for (let k = 0; k < 3; k++) b.velocity[k] += (next[i][k] * dt) / 2;
    });
    this.time += dt;
  }
  safeStep(): number {
    let dt = 2;
    for (let i = 0; i < this.bodies.length; i++)
      for (let j = i + 1; j < this.bodies.length; j++) {
        const left = this.bodies[i],
          right = this.bodies[j],
          mass = left.mass + right.mass;
        if (!mass) continue;
        const r2 =
          (left.position[0] - right.position[0]) ** 2 +
          (left.position[1] - right.position[1]) ** 2 +
          (left.position[2] - right.position[2]) ** 2;
        const encounter =
          0.015 * Math.sqrt(Math.pow(Math.max(r2, 1e-12), 1.5) / (G * mass));
        dt = Math.min(dt, encounter);
      }
    return Math.max(dt, 1e-7);
  }
}
