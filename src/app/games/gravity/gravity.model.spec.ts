import { G, GravityModel } from './gravity.model';
import { MINOR_BODY_CATALOG, MOON_CATALOG } from './solar-catalog.data';
import { AU_KM, J2000, orbitalState } from './orbital-elements';

describe('GravityModel', () => {
  it('creates all educational scenarios with finite states', () => {
    const model = new GravityModel();
    for (const [scenario, count] of [
      ['solar', 9 + MINOR_BODY_CATALOG.length + MOON_CATALOG.length + 4],
      ['trappist', 8],
      ['kepler', 3],
      ['custom', 1],
    ] as const) {
      model.load(scenario);
      expect(model.bodies.length).toBe(count);
      model.step(model.safeStep());
      expect(
        model.bodies.every((b) =>
          [...b.position, ...b.velocity].every(Number.isFinite),
        ),
      ).toBeTrue();
    }
  });
  it('includes every JPL satellite once, with a valid host and reference ellipse', () => {
    const model = new GravityModel();
    model.load('solar');
    expect(new Set(model.bodies.map((b) => b.id)).size).toBe(
      model.bodies.length,
    );
    const moons = model.bodies.filter((b) => b.kind === 'moon');
    expect(moons.length).toBe(464);
    for (const moon of moons) {
      const host = model.bodies.find((b) => b.id === moon.parentId)!;
      expect(host).toBeDefined();
      expect(moon.orbit).toBeDefined();
      const distance = Math.hypot(
        ...moon.position.map((v, k) => v - host.position[k]),
      );
      expect(distance).toBeGreaterThanOrEqual(
        moon.orbit!.a * (1 - moon.orbit!.e) * 0.999999,
      );
      expect(distance).toBeLessThanOrEqual(
        moon.orbit!.a * (1 + moon.orbit!.e) * 1.000001,
      );
    }
    const earth = model.bodies.find((b) => b.name === 'Tierra')!,
      moon = model.bodies.find((b) => b.name === 'Luna')!;
    expect(moon.parentId).toBe(earth.id);
    expect(moon.radius * AU_KM).toBeCloseTo(1737.4, 3);
    expect(model.bodies.filter((b) => b.kind === 'dwarf').length).toBe(5);
    expect(model.bodies.filter((b) => b.kind === 'candidate').length).toBe(4);
    expect(model.bodies.filter((b) => b.kind === 'asteroid').length).toBe(14);
  });
  it('closes an eccentric retrograde orbit without reversing its inclination', () => {
    const orbit = {
      a: 0.02,
      e: 0.8,
      inclination: 160,
      node: 70,
      argument: 25,
      meanAnomaly: 10,
      epoch: J2000,
      period: 200,
    };
    const start = orbitalState(orbit),
      finish = orbitalState(orbit, J2000 + orbit.period);
    start.position.forEach((p, k) =>
      expect(finish.position[k]).toBeCloseTo(p, 10),
    );
    const angularMomentumY =
      start.position[2] * start.velocity[0] -
      start.position[0] * start.velocity[2];
    expect(angularMomentumY).toBeLessThan(0);
    expect(start.position[1]).not.toBe(0);
  });
  it('keeps the expanded system finite and lunar distances bounded during integration', () => {
    const model = new GravityModel();
    model.load('solar');
    const moon = model.bodies.find((b) => b.name === 'Luna')!,
      earth = model.bodies.find((b) => b.id === moon.parentId)!;
    const distance = () =>
      Math.hypot(...moon.position.map((v, k) => v - earth.position[k]));
    const before = distance();
    for (let i = 0; i < 20; i++) model.step(model.safeStep());
    expect(
      model.bodies.every((b) =>
        [...b.position, ...b.velocity].every(Number.isFinite),
      ),
    ).toBeTrue();
    expect(Math.abs(distance() / before - 1)).toBeLessThan(0.01);
    expect(model.time).toBeGreaterThan(0);
  });
  it('conserves momentum during mutual gravitational interaction', () => {
    const model = new GravityModel();
    model.load('kepler');
    const momentum = () =>
      [0, 1, 2].map((k) =>
        model.bodies.reduce((s, b) => s + b.mass * b.velocity[k], 0),
      );
    const initial = momentum();
    for (let i = 0; i < 1000; i++) model.step(0.01);
    momentum().forEach((p, k) =>
      expect(Math.abs(p - initial[k])).toBeLessThan(1e-12),
    );
  });
  it('keeps an Earth-like circular orbit bounded over a year', () => {
    const model = new GravityModel();
    model.load('custom');
    model.add({
      name: 'Earth',
      mass: 3e-6,
      radius: 4e-5,
      color: '#ffffff',
      star: false,
      position: [1, 0, 0],
      velocity: [0, 0, Math.sqrt(G)],
    });
    for (let i = 0; i < 3653; i++) model.step(0.1);
    const [sun, earth] = model.bodies;
    const distance = Math.hypot(
      ...earth.position.map((v, k) => v - sun.position[k]),
    );
    expect(Math.abs(distance - 1)).toBeLessThan(0.001);
    expect(earth.position[0]).toBeGreaterThan(0.999);
  });
  it('rejects invalid masses and nonfinite coordinates', () => {
    const model = new GravityModel();
    model.load('custom');
    const body = {
      ...model.bodies[0],
      position: [0, 0, 0] as [number, number, number],
    };
    expect(() => model.add({ ...body, mass: -1 })).toThrow();
    expect(() => model.add({ ...body, velocity: [NaN, 0, 0] })).toThrow();
  });
  it('gives a massless probe the expected Newtonian acceleration', () => {
    const model = new GravityModel();
    model.load('custom');
    const acceleration = model.acceleration([1, 0, 0]);
    expect(acceleration[0]).toBeCloseTo(-G, 12);
    expect(acceleration[1]).toBe(0);
  });
});
