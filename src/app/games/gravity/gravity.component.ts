import {
  AfterViewInit,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import {
  BodyKind,
  CelestialBody,
  G,
  GravityModel,
  MAX_BODIES,
  SCENARIOS,
  Vec3,
} from './gravity.model';
import { AU_KM, orbitalEllipse } from './orbital-elements';
import {
  DAY_MS,
  MAX_UTC_MS,
  REFERENCE_UTC_MS,
  parseUtcInput,
  utcInputValue,
  validSimulationDate,
} from './simulation-date';

@Component({
  selector: 'app-gravity',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gravity.component.html',
  styleUrls: ['./gravity.component.css'],
})
export class GravityComponent implements AfterViewInit, OnDestroy {
  @ViewChild('viewport', { static: true })
  viewport!: ElementRef<HTMLDivElement>;
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  readonly model = new GravityModel();
  readonly scenarios = SCENARIOS;
  readonly maxBodies = MAX_BODIES;
  readonly kindNames: Record<BodyKind, string> = {
    star: 'Estrella',
    planet: 'Planeta',
    moon: 'Luna',
    dwarf: 'Planeta enano',
    candidate: 'Candidato',
    asteroid: 'Asteroide',
  };
  search = '';
  kindFilter = '';
  orbits = true;
  markers = true;
  showAsteroids = true;
  private dotColors = new Float32Array();
  readonly timeRates = [
    { value: 0, label: 'Parado (velocidad 0)' },
    { value: 1, label: 'Tiempo real · 1 segundo por segundo' },
    { value: 10, label: '10 segundos por segundo' },
    { value: 60, label: '1 minuto por segundo' },
    { value: 600, label: '10 minutos por segundo' },
    { value: 3600, label: '1 hora por segundo' },
    { value: 86400, label: '1 día por segundo' },
    { value: 604800, label: '7 días por segundo' },
    { value: 2592000, label: '30 días por segundo' },
  ];
  // UI speed is simulated seconds per real second; the model integrates in days.
  scenario = 'solar';
  speed = 1;
  trails = true;
  labels = true;
  bloom = true;
  shipMode = false;
  private runningSpeed = 1;
  get paused(): boolean {
    return this.speed === 0;
  }
  set paused(value: boolean) {
    this.setSpeed(value ? 0 : this.runningSpeed);
  }
  setSpeed(value: number): void {
    if (!this.timeRates.some((rate) => rate.value === value)) return;
    this.speed = value;
    if (value > 0) this.runningSpeed = value;
    if (value === 0) this.actualSpeed = 0;
  }
  error = '';
  message = '';
  days = 0;
  actualSpeed = 0;
  selected = 0;
  thrust = 0.0001;
  simulationIso = new Date(REFERENCE_UTC_MS).toISOString();
  dateInput = utcInputValue(REFERENCE_UTC_MS);
  dateError = '';
  get simulationDateUtc(): string {
    return this.simulationIso.replace('T', ' ').replace('Z', ' UTC');
  }
  private syncDate(updateInput = false): void {
    this.simulationIso = new Date(this.model.dateUtcMs).toISOString();
    if (updateInput) this.dateInput = utcInputValue(this.model.dateUtcMs);
  }
  applyDate(): void {
    const date = parseUtcInput(this.dateInput);
    if (date == null) {
      this.dateError =
        'Selecciona una fecha y hora UTC válidas, entre los años 0001 y 9999.';
      return;
    }
    this.paused = true;
    this.keys.clear();
    if (this.shipMode) this.toggleShip();
    this.model.setDate(date, this.scenario !== 'custom');
    this.days = 0;
    this.last = 0;
    this.dateError = '';
    this.syncDate(true);
    this.rebuild();
    if (this.focused) this.focus(this.selected);
    else this.overview();
    this.message =
      this.scenario === 'custom'
        ? 'Fecha UTC asignada al estado actual del sistema. Pulsa Reanudar para continuar.'
        : 'Escenario situado en la fecha UTC seleccionada. Pulsa Reanudar para continuar.';
  }
  useNow(): void {
    this.dateInput = utcInputValue(Date.now());
    this.applyDate();
  }
  draft = {
    name: 'Nuevo planeta',
    mass: 3.003e-6,
    radius: 0.000043,
    color: '#70c9f7',
    star: false,
    x: 1,
    y: 0,
    z: 0,
    vx: 0,
    vy: 0,
    vz: 0.0172,
  };
  labelPositions: {
    id: number;
    name: string;
    x: number;
    y: number;
    visible: boolean;
  }[] = [];
  private renderer?: THREE.WebGLRenderer;
  private composer?: EffectComposer;
  private glow?: UnrealBloomPass;
  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera(50, 1, 0.00001, 100000);
  private controls?: OrbitControls;
  private observer?: ResizeObserver;
  private frame = 0;
  private last = 0;
  private uiTime = 0;
  private meshes = new Map<number, THREE.Group>();
  private paths = new Map<
    number,
    { line: THREE.Line; points: THREE.Vector3[] }
  >();
  private guides = new Map<number, THREE.Line>();
  private surfaces: THREE.Mesh[] = [];
  private dots = new THREE.Points(
    new THREE.BufferGeometry(),
    new THREE.PointsMaterial({
      size: 3,
      sizeAttenuation: false,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      depthWrite: false,
    }),
  );
  private raycaster = new THREE.Raycaster();
  private clickStart?: { id: number; x: number; y: number; moved: boolean };
  private pointers = new Set<number>();
  private followedPosition?: THREE.Vector3;
  private keys = new Set<string>();
  private shipPosition: Vec3 = [0, 0, 0];
  private shipVelocity: Vec3 = [0, 0, 0];
  private yaw = 0;
  private pitch = 0;
  private pointer?: { x: number; y: number };
  private destroyed = false;
  constructor(private zone: NgZone) {
    this.model.load(this.scenario);
  }
  get description(): string {
    return (
      this.scenarios.find((s) => s.id === this.scenario)?.description ?? ''
    );
  }
  get focused(): CelestialBody | undefined {
    return this.model.bodies.find((b) => b.id === this.selected);
  }
  get listedBodies(): CelestialBody[] {
    const query = this.search.trim().toLocaleLowerCase('es');
    return this.model.bodies.filter(
      (b) =>
        (!this.kindFilter || this.kind(b) === this.kindFilter) &&
        (!query ||
          (b.name + ' ' + this.parent(b)?.name)
            .toLocaleLowerCase('es')
            .includes(query)),
    );
  }
  kind(body: CelestialBody): BodyKind {
    return body.kind ?? (body.star ? 'star' : 'planet');
  }
  isVisible(body: CelestialBody): boolean {
    return this.showAsteroids || this.kind(body) !== 'asteroid';
  }
  toggleAsteroids(): void {
    if (
      !this.showAsteroids &&
      this.focused &&
      this.kind(this.focused) === 'asteroid'
    ) {
      this.selected = 0;
      this.followedPosition = undefined;
      if (this.controls) this.controls.enablePan = true;
    }
  }
  parent(body: CelestialBody): CelestialBody | undefined {
    return this.model.bodies.find((b) => b.id === body.parentId);
  }
  radiusKm(body: CelestialBody): number {
    return body.radius * AU_KM;
  }
  distance(body: CelestialBody): number {
    return Math.hypot(...body.position);
  }
  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => {
      try {
        this.renderer = new THREE.WebGLRenderer({
          canvas: this.canvas.nativeElement,
          antialias: true,
          powerPreference: 'high-performance',
        });
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.scene.background = new THREE.Color('#030711');
        this.scene.add(new THREE.AmbientLight('#abc9ff', 0.5));
        const stars = new Float32Array(6000);
        for (let i = 0; i < stars.length; i += 3) {
          const z = Math.random() * 2 - 1,
            t = Math.random() * Math.PI * 2,
            r = 1500;
          stars[i] = r * Math.sqrt(1 - z * z) * Math.cos(t);
          stars[i + 1] = r * z;
          stars[i + 2] = r * Math.sqrt(1 - z * z) * Math.sin(t);
        }
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(stars, 3));
        this.scene.add(
          new THREE.Points(
            geometry,
            new THREE.PointsMaterial({
              color: '#c9dcff',
              size: 1.3,
              sizeAttenuation: false,
            }),
          ),
        );
        this.scene.add(this.dots);
        this.controls = new OrbitControls(
          this.camera,
          this.canvas.nativeElement,
        );
        this.controls.enableDamping = true;
        this.controls.minDistance = 0.0002;
        this.controls.maxDistance = 5000;
        this.composer = new EffectComposer(this.renderer);
        this.composer.addPass(new RenderPass(this.scene, this.camera));
        this.glow = new UnrealBloomPass(
          new THREE.Vector2(1, 1),
          0.65,
          0.5,
          1.1,
        );
        this.composer.addPass(this.glow);
        this.composer.addPass(new OutputPass());
        this.rebuild();
        this.overview();
        this.observer = new ResizeObserver(() => this.resize());
        this.observer.observe(this.viewport.nativeElement);
        this.resize();
        const canvas = this.canvas.nativeElement;
        canvas.addEventListener('keydown', this.keyDown);
        canvas.addEventListener('keyup', this.keyUp);
        canvas.addEventListener('blur', this.blur);
        canvas.addEventListener('pointerdown', this.pointerDown);
        canvas.addEventListener('pointermove', this.pointerMove);
        canvas.addEventListener('pointerup', this.pointerUp);
        canvas.addEventListener('pointercancel', this.pointerCancel);
        canvas.addEventListener('webglcontextlost', this.contextLost);
        document.addEventListener('visibilitychange', this.visibilityChange);
        this.frame = requestAnimationFrame(this.animate);
      } catch {
        this.zone.run(
          () =>
            (this.error =
              'No se pudo iniciar la vista 3D. Comprueba la aceleración gráfica del navegador.'),
        );
      }
    });
  }
  load(restart = false): void {
    this.shipMode = false;
    this.keys.clear();
    this.search = '';
    this.kindFilter = '';
    if (this.controls) this.controls.enabled = true;
    this.model.load(
      this.scenario,
      restart ? this.model.epochUtcMs : this.model.dateUtcMs,
    );
    this.days = 0;
    this.last = 0;
    this.selected = 0;
    this.message = '';
    this.dateError = '';
    this.syncDate(true);
    this.rebuild();
    this.overview();
  }
  private disposeObject(object: THREE.Object3D): void {
    object.traverse((o) => {
      const mesh = o as THREE.Mesh;
      mesh.geometry?.dispose();
      const materials = mesh.material
        ? Array.isArray(mesh.material)
          ? mesh.material
          : [mesh.material]
        : [];
      materials.forEach((m) => m.dispose());
    });
  }
  private rebuild(): void {
    this.meshes.forEach((m) => {
      this.scene.remove(m);
      this.disposeObject(m);
    });
    this.paths.forEach((p) => {
      this.scene.remove(p.line);
      this.disposeObject(p.line);
    });
    this.meshes.clear();
    this.paths.clear();
    this.guides.forEach((line) => {
      this.scene.remove(line);
      this.disposeObject(line);
    });
    this.guides.clear();
    this.surfaces = [];
    this.dots.geometry.dispose();
    this.dots.geometry = new THREE.BufferGeometry();
    this.dots.geometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(
        this.model.bodies.flatMap((b) => b.position),
        3,
      ),
    );
    this.dotColors = new Float32Array(
      this.model.bodies.flatMap((b) => new THREE.Color(b.color).toArray()),
    );
    this.dots.geometry.setAttribute(
      'color',
      new THREE.Float32BufferAttribute(this.dotColors.slice(), 3),
    );
    this.model.bodies.forEach((b) => {
      const group = new THREE.Group();
      const radius = b.radius;
      const material = new THREE.MeshStandardMaterial({
        color: b.color,
        roughness: 0.82,
        emissive: b.star ? b.color : '#000000',
        emissiveIntensity: b.star ? 2.8 : 0,
      });
      // Procedural bands and terrain: no remote texture downloads.
      material.onBeforeCompile = (shader) => {
        shader.vertexShader =
          'varying vec3 vSurface;\n' +
          shader.vertexShader.replace(
            '#include <begin_vertex>',
            '#include <begin_vertex>\nvSurface = position;',
          );
        shader.fragmentShader =
          'varying vec3 vSurface;\n' +
          shader.fragmentShader.replace(
            '#include <color_fragment>',
            '#include <color_fragment>\nfloat bands = sin(vSurface.y * 65.0 + sin(vSurface.x * 34.0) * 2.0); diffuseColor.rgb *= 0.83 + 0.17 * bands;',
          );
      };
      if (radius > 0) {
        const surface = new THREE.Mesh(
          new THREE.SphereGeometry(
            radius,
            b.kind === 'moon' ? 24 : 48,
            b.kind === 'moon' ? 16 : 32,
          ),
          material,
        );
        surface.userData['bodyId'] = b.id;
        group.add(surface);
        this.surfaces.push(surface);
      } else material.dispose();
      if (b.star) group.add(new THREE.PointLight(b.color, 3, 0, 0));
      else if (radius > 0) {
        const atmosphere = new THREE.Mesh(
          new THREE.SphereGeometry(radius * 1.09, 32, 24),
          new THREE.MeshBasicMaterial({
            color: b.color,
            transparent: true,
            opacity: 0.08,
            side: THREE.BackSide,
            depthWrite: false,
          }),
        );
        group.add(atmosphere);
      }
      if (b.name === 'Saturno' || b.name === 'Kepler-16 b') {
        const ring = new THREE.Mesh(
          new THREE.RingGeometry(radius * 1.4, radius * 2.2, 80),
          new THREE.MeshStandardMaterial({
            color: '#ccb996',
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.65,
          }),
        );
        ring.rotation.x = Math.PI / 2.4;
        group.add(ring);
      }
      group.position.fromArray(b.position);
      this.scene.add(group);
      this.meshes.set(b.id, group);
      const line = new THREE.Line(
        new THREE.BufferGeometry(),
        new THREE.LineBasicMaterial({
          color: b.color,
          transparent: true,
          opacity: 0.45,
        }),
      );
      this.scene.add(line);
      this.paths.set(b.id, { line, points: [] });
      if (b.orbit) {
        const guide = new THREE.Line(
          new THREE.BufferGeometry().setFromPoints(
            orbitalEllipse(b.orbit).map((p) => new THREE.Vector3(...p)),
          ),
          new THREE.LineBasicMaterial({
            color: b.color,
            transparent: true,
            opacity: b.kind === 'moon' ? 0.15 : 0.3,
            depthWrite: false,
          }),
        );
        this.scene.add(guide);
        this.guides.set(b.id, guide);
      }
    });
  }
  private extent(): number {
    return Math.max(
      0.02,
      ...this.model.bodies.map((b) => Math.hypot(...b.position)),
    );
  }
  overview(): void {
    if (this.shipMode) this.toggleShip();
    this.selected = 0;
    this.followedPosition = undefined;
    const r = this.extent();
    this.camera.near = 0.00001;
    this.camera.updateProjectionMatrix();
    if (this.controls) {
      this.controls.enableDamping = false;
      this.controls.update();
      this.controls.minDistance = 0.0002;
      this.controls.enablePan = true;
    }
    this.camera.position.set(r * 1.1, r * 1.3, r * 1.5);
    this.controls?.target.set(0, 0, 0);
    this.controls?.update();
    if (this.controls) this.controls.enableDamping = true;
  }
  focus(id: number): void {
    const b = this.model.bodies.find((body) => body.id === id);
    if (!b) return;
    if (this.shipMode) this.toggleShip();
    if (this.kind(b) === 'asteroid') this.showAsteroids = true;
    if (this.controls) {
      this.controls.enableDamping = false;
      this.controls.update();
    }
    this.selected = id;
    this.followedPosition = new THREE.Vector3(...b.position);
    const radius = b.radius || Math.max((b.orbit?.a ?? 0.001) * 0.005, 1e-8),
      r = radius * 4;
    const direction = this.camera.position
      .clone()
      .sub(this.controls?.target ?? new THREE.Vector3())
      .normalize();
    if (direction.lengthSq() === 0) direction.set(1, 0.7, 1).normalize();
    this.camera.near = Math.max(radius * 0.01, 1e-12);
    this.camera.updateProjectionMatrix();
    if (this.controls) {
      this.controls.minDistance = radius * 1.2;
      this.controls.enablePan = false;
      this.controls.target.copy(this.followedPosition);
    }
    this.camera.position
      .copy(this.followedPosition)
      .add(direction.multiplyScalar(r * 1.6));
    this.controls?.update();
    if (this.controls) this.controls.enableDamping = true;
  }
  toggleShip(): void {
    this.shipMode = !this.shipMode;
    this.keys.clear();
    this.selected = 0;
    this.followedPosition = undefined;
    if (this.controls) {
      this.controls.enabled = !this.shipMode;
      this.controls.enablePan = true;
    }
    if (this.shipMode) {
      this.shipPosition = this.camera.position.toArray() as Vec3;
      this.shipVelocity = [0, 0, 0];
      const e = new THREE.Euler().setFromQuaternion(
        this.camera.quaternion,
        'YXZ',
      );
      this.yaw = e.y;
      this.pitch = e.x;
      this.canvas.nativeElement.focus();
    } else {
      const direction = this.camera.getWorldDirection(new THREE.Vector3());
      this.controls?.target
        .copy(this.camera.position)
        .add(direction.multiplyScalar(this.extent() * 0.2));
      this.controls?.update();
    }
  }
  addBody(): void {
    try {
      const d = this.draft;
      const b = this.model.add({
        name: d.name,
        mass: d.mass,
        radius: d.radius,
        color: d.color,
        star: d.star,
        position: [d.x, d.y, d.z],
        velocity: [d.vx, d.vy, d.vz],
      });
      this.scenario = 'custom';
      this.rebuild();
      this.focus(b.id);
      this.message = 'Cuerpo añadido.';
    } catch (e) {
      this.message = (e as Error).message;
    }
  }
  circularVelocity(): void {
    const center =
      this.model.bodies.find((b) => b.star) ?? this.model.bodies[0];
    if (!center) return;
    const dx = this.draft.x - center.position[0],
      dz = this.draft.z - center.position[2],
      r = Math.hypot(dx, dz);
    if (!r) {
      this.message = 'Separa el cuerpo de la estrella.';
      return;
    }
    const v = Math.sqrt((G * center.mass) / r);
    this.draft.vx = center.velocity[0] - (dz / r) * v;
    this.draft.vy = center.velocity[1];
    this.draft.vz = center.velocity[2] + (dx / r) * v;
  }
  remove(id: number): void {
    const removed = new Set([id]);
    let count = 0;
    while (count !== removed.size) {
      count = removed.size;
      this.model.bodies.forEach((b) => {
        if (b.parentId && removed.has(b.parentId)) removed.add(b.id);
      });
    }
    this.model.bodies = this.model.bodies.filter((b) => !removed.has(b.id));
    this.selected = 0;
    this.followedPosition = undefined;
    if (this.controls) this.controls.enablePan = true;
    this.scenario = 'custom';
    this.rebuild();
  }
  save(): void {
    try {
      localStorage.setItem(
        'gravity-system-v1',
        JSON.stringify({
          version: 2,
          dateUtcMs: this.model.dateUtcMs,
          bodies: this.model.bodies,
        }),
      );
      this.message = 'Sistema y fecha UTC guardados en este navegador.';
    } catch {
      this.message = 'El navegador no permite guardar el sistema.';
    }
  }
  restore(): void {
    try {
      const snapshot = JSON.parse(
        localStorage.getItem('gravity-system-v1') ?? 'null',
      );
      const raw = Array.isArray(snapshot)
        ? snapshot
        : snapshot?.version === 2
          ? snapshot.bodies
          : null;
      const date = Array.isArray(snapshot)
        ? REFERENCE_UTC_MS
        : snapshot?.dateUtcMs;
      if (!validSimulationDate(date)) throw new Error();
      if (!Array.isArray(raw) || !raw.length || raw.length > MAX_BODIES)
        throw new Error();
      const test = new GravityModel(),
        ids = new Map<number, number>();
      raw.forEach((b) => {
        if (
          !b ||
          !Number.isInteger(b.id) ||
          b.id <= 0 ||
          ids.has(b.id) ||
          !Array.isArray(b.position) ||
          b.position.length !== 3 ||
          !Array.isArray(b.velocity) ||
          b.velocity.length !== 3 ||
          typeof b.name !== 'string' ||
          typeof b.color !== 'string' ||
          !/^#[0-9a-f]{6}$/i.test(b.color)
        )
          throw new Error();
        if (
          b.orbit &&
          (![
            b.orbit.a,
            b.orbit.e,
            b.orbit.inclination,
            b.orbit.node,
            b.orbit.argument,
            b.orbit.meanAnomaly,
            b.orbit.period,
            b.orbit.epoch,
          ].every(Number.isFinite) ||
            b.orbit.a <= 0 ||
            b.orbit.e < 0 ||
            b.orbit.e >= 1 ||
            b.orbit.period <= 0 ||
            (b.orbit.poleRA != null && !Number.isFinite(b.orbit.poleRA)) ||
            (b.orbit.poleDec != null && !Number.isFinite(b.orbit.poleDec)))
        )
          throw new Error();
        if (
          (b.kind && !Object.keys(this.kindNames).includes(b.kind)) ||
          (b.note && typeof b.note !== 'string') ||
          (b.parentId != null && !Number.isInteger(b.parentId))
        )
          throw new Error();
        ids.set(b.id, test.add(b).id);
      });
      test.bodies.forEach((b) => {
        if (b.parentId != null) {
          const parentId = ids.get(b.parentId);
          if (!parentId || parentId === b.id) throw new Error();
          b.parentId = parentId;
        }
      });
      this.model.bodies = test.bodies;
      this.model.setDate(date, false);
      this.days = 0;
      this.last = 0;
      this.scenario = 'custom';
      this.selected = 0;
      this.search = '';
      this.kindFilter = '';
      this.dateError = '';
      this.syncDate(true);
      this.rebuild();
      this.overview();
      this.message = 'Sistema y fecha UTC recuperados.';
    } catch {
      this.message = 'No hay un sistema guardado válido.';
    }
  }
  private animate = (now: number): void => {
    if (this.destroyed || this.error) return;
    const realDt = this.last ? Math.max((now - this.last) / 1000, 0) : 0;
    this.last = now;
    let advanced = 0;
    if (!this.paused && !document.hidden) {
      let remaining = Math.min(
        (realDt * this.speed) / 86400,
        Math.max(0, (MAX_UTC_MS - this.model.dateUtcMs) / DAY_MS),
      );
      const deadline = performance.now() + 12;
      for (
        let n = 0;
        remaining > 1e-10 &&
        n < 400 &&
        (n === 0 || performance.now() < deadline);
        n++
      ) {
        let dt = Math.min(remaining, this.model.safeStep());
        if (this.shipMode)
          for (const b of this.model.bodies) {
            const r = Math.hypot(
              ...b.position.map((v, k) => v - this.shipPosition[k]),
            );
            dt = Math.min(
              dt,
              Math.max(
                1e-7,
                0.01 * Math.sqrt(Math.max(r, 1e-6) ** 3 / (G * b.mass)),
              ),
            );
          }
        if (this.shipMode) this.stepShip(dt);
        this.model.step(dt);
        remaining -= dt;
        advanced += dt;
      }
    }
    if (this.shipMode) this.camera.position.fromArray(this.shipPosition);
    else if (this.focused && this.controls) {
      const next = new THREE.Vector3(...this.focused.position);
      this.camera.position.add(
        next.clone().sub(this.followedPosition ?? this.controls.target),
      );
      this.controls.target.copy(next);
      this.followedPosition = next;
    }
    this.controls?.update();
    const sample = now - this.uiTime > 100;
    const dotPositions = this.dots.geometry.getAttribute(
      'position',
    ) as THREE.BufferAttribute;
    const colors = this.dots.geometry.getAttribute(
      'color',
    ) as THREE.BufferAttribute;
    let dotIndex = 0;
    this.model.bodies.forEach((b, index) => {
      const mesh = this.meshes.get(b.id);
      mesh?.position.fromArray(b.position);
      if (mesh) mesh.rotation.y += realDt * 0.15;
      const visible = this.isVisible(b);
      if (mesh) mesh.visible = visible;
      if (visible) {
        dotPositions.setXYZ(dotIndex, ...b.position);
        colors.setXYZ(
          dotIndex,
          this.dotColors[index * 3],
          this.dotColors[index * 3 + 1],
          this.dotColors[index * 3 + 2],
        );
        dotIndex++;
      }
      const parent = this.parent(b),
        parentPosition = new THREE.Vector3(...(parent?.position ?? [0, 0, 0]));
      const guide = this.guides.get(b.id);
      if (guide) {
        guide.position.copy(parentPosition);
        guide.visible = this.orbits && visible;
      }
      const path = this.paths.get(b.id);
      if (path) {
        path.line.visible = this.trails && visible;
        path.line.position.copy(parentPosition);
        if (sample && advanced > 0) {
          path.points.push(
            new THREE.Vector3(...b.position).sub(parentPosition),
          );
          if (path.points.length > (b.kind === 'moon' ? 160 : 700))
            path.points.shift();
          path.line.geometry.setFromPoints(path.points);
        }
      }
    });
    dotPositions.needsUpdate = true;
    colors.needsUpdate = true;
    this.dots.geometry.setDrawRange(0, dotIndex);
    this.dots.frustumCulled = false;
    this.dots.visible = this.markers;
    if (this.glow) this.glow.enabled = this.bloom;
    this.composer?.render();
    if (sample) {
      this.uiTime = now;
      const width = this.viewport.nativeElement.clientWidth,
        height = this.viewport.nativeElement.clientHeight;
      const occupied: { x: number; y: number }[] = [];
      const positions = this.model.bodies
        .filter((b) => this.isVisible(b))
        .sort(
          (a, b) =>
            Number(b.id === this.selected) - Number(a.id === this.selected) ||
            Number(this.kind(a) === 'moon') - Number(this.kind(b) === 'moon'),
        )
        .map((b) => {
          const p = new THREE.Vector3(...b.position).project(this.camera),
            x = ((p.x + 1) * width) / 2,
            y = ((1 - p.y) * height) / 2;
          const visible =
            p.z > -1 &&
            p.z < 1 &&
            Math.abs(p.x) < 0.95 &&
            Math.abs(p.y) < 0.95 &&
            occupied.length < 45 &&
            !occupied.some(
              (q) => Math.abs(x - q.x) < 95 && Math.abs(y - q.y) < 22,
            );
          if (visible) occupied.push({ x, y });
          return { id: b.id, name: b.name, x, y, visible };
        });
      this.zone.run(() => {
        this.days = this.model.time;
        this.syncDate();
        this.actualSpeed = realDt ? advanced / realDt : 0;
        this.labelPositions = positions;
        if (this.model.dateUtcMs >= MAX_UTC_MS) {
          this.paused = true;
          this.message =
            'Se ha alcanzado la fecha máxima del calendario. Selecciona una fecha anterior para continuar.';
        }
      });
    }
    this.frame = requestAnimationFrame(this.animate);
  };
  private stepShip(dt: number): void {
    const a = this.model.acceleration(this.shipPosition),
      thrust = new THREE.Vector3();
    thrust.z =
      (this.keys.has('KeyS') ? 1 : 0) - (this.keys.has('KeyW') ? 1 : 0);
    thrust.x =
      (this.keys.has('KeyD') ? 1 : 0) - (this.keys.has('KeyA') ? 1 : 0);
    thrust.y =
      (this.keys.has('KeyE') ? 1 : 0) - (this.keys.has('KeyQ') ? 1 : 0);
    if (thrust.lengthSq())
      thrust
        .normalize()
        .applyQuaternion(this.camera.quaternion)
        .multiplyScalar(
          Number.isFinite(this.thrust)
            ? Math.max(0, Math.min(this.thrust, 1))
            : 0,
        );
    for (let k = 0; k < 3; k++) {
      this.shipVelocity[k] += ((a[k] + thrust.getComponent(k)) * dt) / 2;
      this.shipPosition[k] += this.shipVelocity[k] * dt;
    }
    const next = this.model.acceleration(this.shipPosition);
    for (let k = 0; k < 3; k++)
      this.shipVelocity[k] += ((next[k] + thrust.getComponent(k)) * dt) / 2;
    if (
      this.model.bodies.some(
        (b) =>
          Math.hypot(...b.position.map((v, k) => v - this.shipPosition[k])) <=
          b.radius,
      )
    )
      this.zone.run(() => {
        this.paused = true;
        this.message =
          'La nave ha alcanzado la superficie de un cuerpo. Vuelve a la vista orbital para recolocarla.';
      });
  }
  private keyDown = (e: KeyboardEvent): void => {
    if (
      this.shipMode &&
      ['KeyW', 'KeyS', 'KeyA', 'KeyD', 'KeyQ', 'KeyE'].includes(e.code)
    ) {
      e.preventDefault();
      this.keys.add(e.code);
    }
  };
  private keyUp = (e: KeyboardEvent): void => {
    this.keys.delete(e.code);
  };
  private blur = (): void => {
    this.keys.clear();
    this.pointer = undefined;
    this.clickStart = undefined;
    this.pointers.clear();
  };
  private pointerDown = (e: PointerEvent): void => {
    this.canvas.nativeElement.focus();
    this.pointers.add(e.pointerId);
    if (this.shipMode) {
      this.pointer = { x: e.clientX, y: e.clientY };
      this.canvas.nativeElement.setPointerCapture(e.pointerId);
    } else if (e.button === 0 && this.pointers.size === 1)
      this.clickStart = {
        id: e.pointerId,
        x: e.clientX,
        y: e.clientY,
        moved: false,
      };
    else this.clickStart = undefined;
  };
  private pointerMove = (e: PointerEvent): void => {
    if (
      this.clickStart &&
      Math.hypot(e.clientX - this.clickStart.x, e.clientY - this.clickStart.y) >
        5
    )
      this.clickStart.moved = true;
    if (!this.shipMode || !this.pointer) return;
    this.yaw -= (e.clientX - this.pointer.x) * 0.004;
    this.pitch = THREE.MathUtils.clamp(
      this.pitch - (e.clientY - this.pointer.y) * 0.004,
      -1.5,
      1.5,
    );
    this.camera.quaternion.setFromEuler(
      new THREE.Euler(this.pitch, this.yaw, 0, 'YXZ'),
    );
    this.pointer = { x: e.clientX, y: e.clientY };
  };
  private pointerUp = (e: PointerEvent): void => {
    const start = this.clickStart;
    this.pointers.delete(e.pointerId);
    this.clickStart = undefined;
    this.pointer = undefined;
    if (
      this.shipMode ||
      !start ||
      start.id !== e.pointerId ||
      start.moved ||
      Math.hypot(e.clientX - start.x, e.clientY - start.y) > 5
    )
      return;
    this.pickBody(e.clientX, e.clientY);
  };
  private pointerCancel = (e: PointerEvent): void => {
    this.pointers.delete(e.pointerId);
    this.clickStart = undefined;
    this.pointer = undefined;
  };
  private pickBody(clientX: number, clientY: number): void {
    const rect = this.canvas.nativeElement.getBoundingClientRect(),
      x = clientX - rect.left,
      y = clientY - rect.top;
    this.scene.updateMatrixWorld(true);
    this.camera.updateMatrixWorld(true);
    this.raycaster.setFromCamera(
      new THREE.Vector2((x / rect.width) * 2 - 1, 1 - (y / rect.height) * 2),
      this.camera,
    );
    let id: number | undefined = this.raycaster.intersectObjects(
      this.surfaces.filter((mesh) =>
        this.model.bodies.some(
          (b) => b.id === mesh.userData['bodyId'] && this.isVisible(b),
        ),
      ),
      false,
    )[0]?.object.userData['bodyId'];
    if (id == null && this.markers) {
      let closest = 8;
      for (const b of this.model.bodies) {
        if (!this.isVisible(b)) continue;
        const p = new THREE.Vector3(...b.position).project(this.camera);
        if (p.z < -1 || p.z > 1) continue;
        const distance = Math.hypot(
          ((p.x + 1) * rect.width) / 2 - x,
          ((1 - p.y) * rect.height) / 2 - y,
        );
        if (distance < closest) {
          closest = distance;
          id = b.id;
        }
      }
    }
    if (id != null) this.zone.run(() => this.focus(id!));
  }
  press(code: string): void {
    this.keys.add(code);
  }
  release(): void {
    this.keys.clear();
  }
  private contextLost = (event: Event): void => {
    event.preventDefault();
    cancelAnimationFrame(this.frame);
    this.zone.run(
      () =>
        (this.error =
          'Se ha perdido el contexto gráfico. Recarga la página para continuar.'),
    );
  };
  private visibilityChange = (): void => {
    this.last = 0;
    this.keys.clear();
  };
  private resize(): void {
    const { clientWidth: w, clientHeight: h } = this.viewport.nativeElement;
    if (!w || !h) return;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer?.setSize(w, h, false);
    this.composer?.setSize(w, h);
  }
  ngOnDestroy(): void {
    this.destroyed = true;
    cancelAnimationFrame(this.frame);
    this.observer?.disconnect();
    this.controls?.dispose();
    document.removeEventListener('visibilitychange', this.visibilityChange);
    const c = this.canvas.nativeElement;
    c.removeEventListener('keydown', this.keyDown);
    c.removeEventListener('keyup', this.keyUp);
    c.removeEventListener('blur', this.blur);
    c.removeEventListener('pointerdown', this.pointerDown);
    c.removeEventListener('pointermove', this.pointerMove);
    c.removeEventListener('pointerup', this.pointerUp);
    c.removeEventListener('pointercancel', this.pointerCancel);
    c.removeEventListener('webglcontextlost', this.contextLost);
    this.disposeObject(this.scene);
    this.composer?.passes.forEach((p) => p.dispose());
    this.composer?.dispose();
    this.renderer?.dispose();
  }
}
