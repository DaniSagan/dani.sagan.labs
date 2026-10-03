import {
  AfterViewInit,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import {
  Face,
  FACES,
  Move,
  notation,
  RubikCubeModel,
} from './rubik-cube.model';

@Component({
  selector: 'app-rubik-cube',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './rubik-cube.component.html',
  styleUrls: ['./rubik-cube.component.css'],
})
export class RubikCubeComponent implements AfterViewInit, OnDestroy {
  @ViewChild('viewport', { static: true })
  viewport!: ElementRef<HTMLDivElement>;
  @ViewChild('canvas', { static: true })
  canvasRef!: ElementRef<HTMLCanvasElement>;
  readonly model = new RubikCubeModel();
  readonly faces = FACES;
  readonly notation = notation;
  selected: Face = 'F';
  history: Move[] = [];
  busy = false;
  remaining = 0;
  speed = 320;
  autoRotate = false;
  error = '';
  message =
    'Arrastra para explorar. Pulsa una pegatina para seleccionar su cara.';
  private renderer?: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  private controls?: OrbitControls;
  private cube = new THREE.Group();
  private meshes = new Map<number, THREE.Group>();
  private stickers: THREE.Mesh[] = [];
  private environment?: THREE.WebGLRenderTarget;
  private geometries: THREE.BufferGeometry[] = [];
  private materials: THREE.Material[] = [];
  private frame = 0;
  private lastFrame = 0;
  private resizeObserver?: ResizeObserver;
  private intersection?: IntersectionObserver;
  private visible = true;
  private disposed = false;
  private queue: { move: Move; record: boolean }[] = [];
  private active?: {
    move: Move;
    record: boolean;
    pivot: THREE.Group;
    elapsed: number;
    duration: number;
    angle: number;
    axis: 'x' | 'y' | 'z';
  };
  private pointers = new Set<number>();
  private clickStart?: { id: number; x: number; y: number };
  private multiTouch = false;
  private reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  constructor(private zone: NgZone) {}

  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => {
      try {
        const canvas = this.canvasRef.nativeElement;
        this.renderer = new THREE.WebGLRenderer({
          canvas,
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        });
        this.renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
        this.renderer.setClearColor(0x000000, 0);
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 0.85;
        const pmrem = new THREE.PMREMGenerator(this.renderer),
          room = new RoomEnvironment();
        this.environment = pmrem.fromScene(room, 0.04);
        this.scene.environment = this.environment.texture;
        this.scene.environmentIntensity = 0.65;
        room.dispose();
        pmrem.dispose();
        this.scene.add(new THREE.AmbientLight(0xffffff, 0.3));
        const key = new THREE.DirectionalLight(0xffffff, 2);
        key.position.set(3, 6, 4);
        this.scene.add(key);
        const rim = new THREE.DirectionalLight(0x79baff, 2);
        rim.position.set(-5, 2, -3);
        this.scene.add(rim);
        this.scene.add(this.cube);
        this.createCube();
        this.syncMeshes();
        this.camera.position.set(6, 4.8, 7);
        this.controls = new OrbitControls(this.camera, canvas);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.09;
        this.controls.enablePan = false;
        this.controls.minDistance = 5.4;
        this.controls.maxDistance = 17;
        this.controls.autoRotateSpeed = 1.2;
        this.controls.addEventListener('change', this.requestFrame);
        canvas.addEventListener('pointerdown', this.pointerDown);
        canvas.addEventListener('pointerup', this.pointerUp);
        canvas.addEventListener('pointercancel', this.pointerCancel);
        canvas.addEventListener('webglcontextlost', this.contextLost);
        this.resizeObserver = new ResizeObserver(() => this.resize());
        this.resizeObserver.observe(this.viewport.nativeElement);
        this.intersection = new IntersectionObserver((entries) => {
          this.visible = entries[0].isIntersecting;
          if (this.visible) this.requestFrame();
        });
        this.intersection.observe(this.viewport.nativeElement);
        document.addEventListener('visibilitychange', this.visibilityChange);
        this.resize();
        this.requestFrame();
      } catch {
        this.zone.run(
          () =>
            (this.error =
              'No se ha podido iniciar la vista 3D. Activa la aceleración gráfica o prueba otro navegador.'),
        );
        this.release();
      }
    });
  }
  private createCube(): void {
    const body = new RoundedBoxGeometry(0.94, 0.94, 0.94, 3, 0.065);
    const outline = new THREE.Shape(),
      half = 0.38,
      radius = 0.07;
    outline.moveTo(-half + radius, -half);
    outline.lineTo(half - radius, -half);
    outline.quadraticCurveTo(half, -half, half, -half + radius);
    outline.lineTo(half, half - radius);
    outline.quadraticCurveTo(half, half, half - radius, half);
    outline.lineTo(-half + radius, half);
    outline.quadraticCurveTo(-half, half, -half, half - radius);
    outline.lineTo(-half, -half + radius);
    outline.quadraticCurveTo(-half, -half, -half + radius, -half);
    const tile = new THREE.ExtrudeGeometry(outline, {
      depth: 0.018,
      steps: 1,
      bevelEnabled: true,
      bevelThickness: 0.005,
      bevelSize: 0.005,
      bevelSegments: 2,
      curveSegments: 6,
    });
    tile.translate(0, 0, -0.009);
    this.geometries.push(body, tile);
    const plastic = new THREE.MeshPhysicalMaterial({
      color: 0x161a23,
      roughness: 0.32,
      metalness: 0.08,
      clearcoat: 0.55,
      clearcoatRoughness: 0.25,
    });
    this.materials.push(plastic);
    const colors = new Map<Face, THREE.MeshPhysicalMaterial>();
    FACES.forEach((f) => {
      const material = new THREE.MeshPhysicalMaterial({
        color: f.color,
        roughness: 0.9,
        metalness: 0,
        clearcoat: 0,
        specularIntensity: 0.15,
        envMapIntensity: 0.35,
      });
      colors.set(f.face, material);
      this.materials.push(material);
    });
    for (const c of this.model.cubies) {
      const group = new THREE.Group();
      group.add(new THREE.Mesh(body, plastic));
      c.stickers.forEach((s, index) => {
        const mesh = new THREE.Mesh(tile, colors.get(s.face));
        const normal = new THREE.Vector3(...s.normal);
        mesh.position.copy(normal.multiplyScalar(0.478));
        mesh.quaternion.setFromUnitVectors(
          new THREE.Vector3(0, 0, 1),
          new THREE.Vector3(...s.normal),
        );
        mesh.userData = { cubie: c.id, sticker: index };
        group.add(mesh);
        this.stickers.push(mesh);
      });
      this.cube.add(group);
      this.meshes.set(c.id, group);
    }
  }
  private syncMeshes(): void {
    this.model.cubies.forEach((c) => {
      const mesh = this.meshes.get(c.id)!;
      this.cube.attach(mesh);
      mesh.position.set(...c.position);
      const matrix = new THREE.Matrix4().makeBasis(
        ...(c.basis.map((v) => new THREE.Vector3(...v)) as [
          THREE.Vector3,
          THREE.Vector3,
          THREE.Vector3,
        ]),
      );
      mesh.quaternion.setFromRotationMatrix(matrix);
      mesh.scale.set(1, 1, 1);
    });
  }
  private resize(): void {
    if (!this.renderer) return;
    const { width, height } =
      this.viewport.nativeElement.getBoundingClientRect();
    this.renderer.setSize(Math.max(1, width), Math.max(1, height), false);
    this.camera.aspect = width / Math.max(1, height);
    this.camera.updateProjectionMatrix();
    this.requestFrame();
  }
  private requestFrame = (): void => {
    if (
      !this.frame &&
      !this.disposed &&
      !this.error &&
      (this.visible || this.active || this.queue.length) &&
      !document.hidden &&
      this.renderer
    )
      this.zone.runOutsideAngular(
        () => (this.frame = requestAnimationFrame(this.render)),
      );
  };
  private render = (time: number): void => {
    this.frame = 0;
    if (this.disposed || this.error || document.hidden) return;
    const delta = this.lastFrame ? Math.min(time - this.lastFrame, 50) : 16;
    this.lastFrame = time;
    const moving = this.visible && this.controls?.update(delta / 1000);
    if (!this.active && this.queue.length) this.beginTurn();
    if (this.active) {
      const turn = this.active;
      turn.elapsed += delta;
      const t = turn.duration ? Math.min(1, turn.elapsed / turn.duration) : 1;
      turn.pivot.rotation[turn.axis] = turn.angle * (t * t * (3 - 2 * t));
      if (t === 1) {
        this.model.turn(turn.move);
        this.syncMeshes();
        this.cube.remove(turn.pivot);
        this.active = undefined;
        this.zone.run(() => {
          if (turn.record) this.history = [...this.history, turn.move];
          this.remaining = this.queue.length;
          this.busy = this.queue.length > 0;
          this.message = this.model.solved
            ? 'Cubo resuelto. Todas las caras están completas.'
            : `Último giro: ${notation(turn.move)}. ${this.model.correctStickers}/54 pegatinas en su cara.`;
        });
      }
    }
    if (this.visible) this.renderer?.render(this.scene, this.camera);
    if (
      moving ||
      this.active ||
      this.queue.length ||
      (this.visible && this.autoRotate)
    )
      this.requestFrame();
  };
  private beginTurn(): void {
    const item = this.queue.shift()!,
      face = FACES.find((f) => f.face === item.move.face)!;
    const pivot = new THREE.Group();
    this.cube.add(pivot);
    this.model
      .layer(item.move)
      .forEach((c) => pivot.attach(this.meshes.get(c.id)!));
    this.active = {
      ...item,
      pivot,
      elapsed: 0,
      duration: this.reducedMotion.matches ? 0 : this.speed,
      angle: (-face.layer * (item.move.inverse ? -1 : 1) * Math.PI) / 2,
      axis: ['x', 'y', 'z'][face.axis] as 'x' | 'y' | 'z',
    };
  }
  turn(face: Face, inverse = false): void {
    if (!this.busy && !this.error) this.enqueue([{ face, inverse }]);
  }
  private enqueue(moves: Move[], record = true): void {
    this.queue = moves.map((move) => ({ move, record }));
    this.busy = !!moves.length;
    this.remaining = moves.length;
    this.requestFrame();
  }
  scramble(): void {
    if (this.busy || this.error) return;
    const moves: Move[] = [];
    for (let i = 0; i < 20; i++) {
      const options = FACES.filter((f) => f.face !== moves[i - 1]?.face);
      moves.push({
        face: options[Math.floor(Math.random() * options.length)].face,
        inverse: Math.random() < 0.5,
      });
    }
    this.message = 'Mezclando con 20 giros legales…';
    this.enqueue(moves);
  }
  algorithm(): void {
    if (!this.busy && !this.error)
      this.enqueue([
        { face: 'R', inverse: false },
        { face: 'U', inverse: false },
        { face: 'R', inverse: true },
        { face: 'U', inverse: true },
      ]);
  }
  undo(): void {
    if (this.busy || !this.history.length || this.error) return;
    const move = this.history[this.history.length - 1];
    this.history = this.history.slice(0, -1);
    this.enqueue([{ face: move.face, inverse: !move.inverse }], false);
  }
  rewind(): void {
    if (this.busy || !this.history.length || this.error) return;
    const moves = this.history
      .slice()
      .reverse()
      .map((m) => ({ face: m.face, inverse: !m.inverse }));
    this.history = [];
    this.message = 'Reproduciendo los giros inversos…';
    this.enqueue(moves, false);
  }
  reset(): void {
    if (this.busy || this.error) return;
    this.model.reset();
    this.history = [];
    this.syncMeshes();
    this.message = 'Cubo restaurado al estado resuelto.';
    this.requestFrame();
  }
  resetCamera(): void {
    this.controls?.reset();
    this.requestFrame();
  }
  zoom(factor: number): void {
    if (!this.controls) return;
    const offset = this.camera.position.clone().sub(this.controls.target);
    offset.setLength(
      THREE.MathUtils.clamp(
        offset.length() * factor,
        this.controls.minDistance,
        this.controls.maxDistance,
      ),
    );
    this.camera.position.copy(this.controls.target).add(offset);
    this.controls.update();
    this.requestFrame();
  }
  toggleAuto(): void {
    this.autoRotate = !this.autoRotate;
    if (this.controls) this.controls.autoRotate = this.autoRotate;
    this.requestFrame();
  }
  keyboard(event: KeyboardEvent): void {
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    const key = event.key.toUpperCase();
    if (FACES.some((f) => f.face === key)) {
      event.preventDefault();
      this.turn(key as Face, event.shiftKey);
    } else if (event.key === '+' || event.key === '=') {
      event.preventDefault();
      this.zoom(0.85);
    } else if (event.key === '-') {
      event.preventDefault();
      this.zoom(1.15);
    } else if (event.key === 'Home') {
      event.preventDefault();
      this.resetCamera();
    } else if (event.key.startsWith('Arrow') && this.controls) {
      event.preventDefault();
      const offset = this.camera.position.clone().sub(this.controls.target),
        spherical = new THREE.Spherical().setFromVector3(offset);
      if (event.key === 'ArrowLeft') spherical.theta -= 0.16;
      if (event.key === 'ArrowRight') spherical.theta += 0.16;
      if (event.key === 'ArrowUp') spherical.phi -= 0.16;
      if (event.key === 'ArrowDown') spherical.phi += 0.16;
      spherical.makeSafe();
      this.camera.position
        .copy(this.controls.target)
        .add(new THREE.Vector3().setFromSpherical(spherical));
      this.controls.update();
      this.requestFrame();
    }
  }
  private pointerDown = (event: PointerEvent): void => {
    this.pointers.add(event.pointerId);
    if (this.pointers.size > 1) this.multiTouch = true;
    if (this.pointers.size === 1) {
      this.multiTouch = false;
      this.clickStart = {
        id: event.pointerId,
        x: event.clientX,
        y: event.clientY,
      };
    }
  };
  private pointerUp = (event: PointerEvent): void => {
    const start = this.clickStart;
    this.pointers.delete(event.pointerId);
    if (
      !start ||
      start.id !== event.pointerId ||
      this.multiTouch ||
      this.busy ||
      Math.hypot(start.x - event.clientX, start.y - event.clientY) > 6
    )
      return;
    this.clickStart = undefined;
    const rect = this.canvasRef.nativeElement.getBoundingClientRect(),
      ray = new THREE.Raycaster();
    ray.setFromCamera(
      new THREE.Vector2(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        (-(event.clientY - rect.top) / rect.height) * 2 + 1,
      ),
      this.camera,
    );
    const hit = ray.intersectObjects(this.stickers, false)[0];
    if (!hit) return;
    const c = this.model.cubies[hit.object.userData['cubie']],
      normal = c.stickers[hit.object.userData['sticker']].normal;
    const face = FACES.find((f) => normal[f.axis] === f.layer)!;
    this.zone.run(() => {
      this.selected = face.face;
      this.message = `Cara ${face.face} seleccionada: ${face.name.toLowerCase()}. Usa ↻ o ↺ para girarla.`;
    });
  };
  private pointerCancel = (event: PointerEvent): void => {
    this.pointers.delete(event.pointerId);
    this.clickStart = undefined;
  };
  private contextLost = (event: Event): void => {
    event.preventDefault();
    cancelAnimationFrame(this.frame);
    this.frame = 0;
    this.zone.run(() => {
      this.error =
        'Se ha perdido la conexión con el visor 3D. Recarga la página para reiniciarlo.';
      this.busy = false;
    });
  };
  private visibilityChange = (): void => {
    this.lastFrame = 0;
    if (!document.hidden) this.requestFrame();
  };
  ngOnDestroy(): void {
    this.disposed = true;
    this.release();
  }
  private release(): void {
    cancelAnimationFrame(this.frame);
    this.resizeObserver?.disconnect();
    this.intersection?.disconnect();
    document.removeEventListener('visibilitychange', this.visibilityChange);
    const canvas = this.canvasRef.nativeElement;
    canvas.removeEventListener('pointerdown', this.pointerDown);
    canvas.removeEventListener('pointerup', this.pointerUp);
    canvas.removeEventListener('pointercancel', this.pointerCancel);
    canvas.removeEventListener('webglcontextlost', this.contextLost);
    this.controls?.dispose();
    this.geometries.forEach((g) => g.dispose());
    this.materials.forEach((m) => m.dispose());
    this.environment?.dispose();
    this.renderer?.dispose();
  }
}
