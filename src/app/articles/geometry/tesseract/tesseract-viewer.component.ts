import { AfterViewInit, Component, ElementRef, NgZone, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { ConvexGeometry } from 'three/examples/jsm/geometries/ConvexGeometry.js';
import { hasSpatialVolume, project4D, rotate4D, sliceTesseract, TESSERACT_CELLS, TESSERACT_EDGES, TESSERACT_FACES, TESSERACT_VERTICES } from '../../../shared/math/tesseract';

@Component({
  selector: 'app-tesseract-viewer', standalone: true, imports: [CommonModule, FormsModule],
  templateUrl: './tesseract-viewer.component.html', styleUrl: './tesseract-viewer.component.css'
})
export class TesseractViewerComponent implements AfterViewInit, OnDestroy {
  @ViewChild('viewport', { static: true }) viewport!: ElementRef<HTMLDivElement>;
  @ViewChild('laboratory', { static: true }) laboratory!: ElementRef<HTMLElement>;
  readonly planes = ['XY', 'XZ', 'XW', 'YZ', 'YW', 'ZW'];
  readonly cells = TESSERACT_CELLS;
  angles = [0, 0, 0, 0, 0, 0];
  playing = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  speed = 0.35;
  distance = 4;
  perspective = true;
  facesVisible = true;
  bloomEnabled = true;
  selectedCell = -1;
  mode = 'projection';
  slice = 0;
  sliceCount = 8;
  sliceKind = 'Sección tridimensional';
  error = '';
  notice = '';
  private renderer?: THREE.WebGLRenderer;
  private composer?: EffectComposer;
  private controls?: OrbitControls;
  private camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
  private scene = new THREE.Scene();
  private object = new THREE.Group();
  private section = new THREE.Group();
  private nodes: THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial>[] = [];
  private edges: THREE.Mesh<THREE.CylinderGeometry, THREE.MeshBasicMaterial>[] = [];
  private faces: THREE.Mesh<THREE.BufferGeometry, THREE.MeshBasicMaterial>[] = [];
  private sparks: THREE.Points<THREE.BufferGeometry, THREE.PointsMaterial> | undefined;
  private resizeObserver?: ResizeObserver;
  private observer?: IntersectionObserver;
  private visible = true;
  private frame = 0;
  private lastTime = 0;
  private elapsed = 0;
  private dirty = true;
  private disposed = false;
  private up = new THREE.Vector3(0, 1, 0);
  private colors = ['#74dfff', '#bd9bff', '#ffc080', '#69ffd2'].map(c => new THREE.Color(c));

  constructor(private zone: NgZone) {}

  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => {
      try {
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
        this.renderer.setClearColor(0x080b18, 0);
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.1;
        const canvas = this.renderer.domElement;
        canvas.setAttribute('role', 'img');
        canvas.setAttribute('aria-label', 'Teseracto interactivo: 16 vértices y 32 aristas. Usa los controles para rotar en cuatro dimensiones o explorar sus secciones.');
        canvas.addEventListener('webglcontextlost', this.onContextLost);
        this.viewport.nativeElement.appendChild(canvas);
        this.camera.position.set(5.5, 3.4, 7.2);
        this.controls = new OrbitControls(this.camera, canvas);
        this.controls.enableDamping = true;
        this.controls.enablePan = false;
        this.controls.minDistance = 4;
        this.controls.maxDistance = 18;
        this.scene.add(this.object, this.section);
        this.createGeometry();
        this.composer = new EffectComposer(this.renderer);
        this.composer.addPass(new RenderPass(this.scene, this.camera));
        this.composer.addPass(new UnrealBloomPass(new THREE.Vector2(1, 1), 0.65, 0.65, 0.65));
        this.composer.addPass(new OutputPass());
        this.resizeObserver = new ResizeObserver(() => this.resize());
        this.resizeObserver.observe(this.viewport.nativeElement);
        this.observer = new IntersectionObserver(entries => {
          this.visible = entries[0].isIntersecting;
          if (this.visible) this.start(); else this.stop();
        });
        this.observer.observe(this.viewport.nativeElement);
        document.addEventListener('visibilitychange', this.onVisibility);
        this.resize();
        this.start();
      } catch {
        this.zone.run(() => this.error = 'No se ha podido iniciar el visor WebGL. Prueba a activar la aceleración gráfica del navegador. El artículo y sus diagramas siguen disponibles.');
        this.release();
      }
    });
  }

  private createGeometry(): void {
    const sphere = new THREE.SphereGeometry(0.033, 16, 10);
    const cylinder = new THREE.CylinderGeometry(0.009, 0.009, 1, 8);
    this.nodes = TESSERACT_VERTICES.map(() => {
      const mesh = new THREE.Mesh(sphere, new THREE.MeshBasicMaterial({ color: '#e2f8ff' }));
      this.object.add(mesh); return mesh;
    });
    this.edges = TESSERACT_EDGES.map(([a, b]) => {
      const axis = Math.log2(a ^ b);
      const mesh = new THREE.Mesh(cylinder, new THREE.MeshBasicMaterial({ color: this.colors[axis], transparent: true }));
      this.object.add(mesh); return mesh;
    });
    this.faces = TESSERACT_FACES.map((indices, i) => {
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(12), 3));
      geometry.setIndex([0, 1, 2, 0, 2, 3]);
      const mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({
        color: this.colors[Math.floor(i / 4) % 4], transparent: true, opacity: 0.045,
        side: THREE.DoubleSide, depthWrite: false
      }));
      this.object.add(mesh); return mesh;
    });
    const particles = new THREE.BufferGeometry();
    particles.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(32 * 3), 3));
    this.sparks = new THREE.Points(particles, new THREE.PointsMaterial({ color: 0xb5eaff, size: 0.045, transparent: true, opacity: 0.8, depthWrite: false }));
    this.object.add(this.sparks);
  }

  update(): void { this.dirty = true; }
  manualRotation(): void { this.playing = false; this.update(); }
  togglePlay(): void { this.playing = !this.playing; }
  selectCell(index: number): void { this.selectedCell = index; this.update(); }
  preset(name: string): void {
    this.playing = false;
    this.mode = name === 'slice' ? 'slice' : 'projection';
    this.angles = name === 'slice' ? [0, 0, 35, 0, 35, 35] : name === 'double' ? [25, 0, 35, 0, 15, 0] : [0, 0, 0, 0, 0, 0];
    this.selectedCell = -1; this.slice = 0; this.distance = 4; this.perspective = true;
    this.camera.position.set(5.5, 3.4, 7.2);
    this.controls?.target.set(0, 0, 0);
    this.controls?.update();
    if (name === 'double') this.playing = true;
    this.update();
  }
  orbit(amount: number): void {
    this.camera.position.applyAxisAngle(this.up, amount);
    this.controls?.update();
  }

  private updateGeometry(): void {
    const rotated = TESSERACT_VERTICES.map(v => rotate4D(v, this.angles.map(a => a * Math.PI / 180)));
    const positions = rotated.map(v => new THREE.Vector3(...project4D(v, this.distance, this.perspective)));
    const selected = this.selectedCell < 0 ? null : this.cells[this.selectedCell].vertices;
    this.object.visible = this.mode === 'projection';
    this.section.visible = this.mode === 'slice';
    if (this.mode === 'projection') {
      this.nodes.forEach((node, i) => {
        node.position.copy(positions[i]);
        node.material.color.set(selected && !selected.includes(i) ? '#334154' : '#e2f8ff');
        node.scale.setScalar(0.85 + (rotated[i][3] + 2) * 0.16);
      });
      this.edges.forEach((edge, i) => {
        const [a, b] = TESSERACT_EDGES[i];
        const direction = positions[b].clone().sub(positions[a]);
        edge.position.copy(positions[a]).add(positions[b]).multiplyScalar(0.5);
        edge.scale.set(1, direction.length(), 1);
        edge.quaternion.setFromUnitVectors(this.up, direction.normalize());
        edge.material.opacity = selected && !(selected.includes(a) && selected.includes(b)) ? 0.1 : 1;
      });
      this.faces.forEach((face, i) => {
        face.visible = this.facesVisible;
        const attr = face.geometry.getAttribute('position');
        TESSERACT_FACES[i].forEach((index, j) => attr.setXYZ(j, ...positions[index].toArray()));
        attr.needsUpdate = true;
        face.geometry.computeBoundingSphere();
        face.material.opacity = selected ? (TESSERACT_FACES[i].every(v => selected.includes(v)) ? 0.19 : 0.008) : 0.045;
      });
      if (this.sparks) {
        this.sparks.visible = selected === null;
        const attr = this.sparks.geometry.getAttribute('position');
        TESSERACT_EDGES.forEach(([a, b], i) => {
          const p = positions[a].clone().lerp(positions[b], (this.elapsed * 0.18 + i * 0.618) % 1);
          attr.setXYZ(i, p.x, p.y, p.z);
        });
        attr.needsUpdate = true;
        this.sparks.geometry.computeBoundingSphere();
      }
    } else {
      this.clearSection();
      const points = sliceTesseract(rotated, this.slice);
      const volume = hasSpatialVolume(points);
      const kind = volume ? 'Sección tridimensional' : points.length ? 'Sección degenerada (sin volumen)' : 'El hiperplano no corta el teseracto';
      if (this.sliceCount !== points.length || this.sliceKind !== kind) this.zone.run(() => { this.sliceCount = points.length; this.sliceKind = kind; });
      const vectors = points.map(p => new THREE.Vector3(...p));
      if (volume) {
        const geometry = new ConvexGeometry(vectors);
        this.section.add(new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: '#70dfef', transparent: true, opacity: 0.16, side: THREE.DoubleSide, depthWrite: false })));
        this.section.add(new THREE.LineSegments(new THREE.EdgesGeometry(geometry, 1), new THREE.LineBasicMaterial({ color: '#9bf4ff' })));
      }
      if (points.length) {
        this.section.add(new THREE.Points(new THREE.BufferGeometry().setFromPoints(vectors), new THREE.PointsMaterial({ color: '#ffe1ad', size: 0.065 })));
      }
    }
    this.dirty = false;
  }

  private animate = (time: number): void => {
    this.frame = 0;
    if (this.disposed || !this.visible || document.hidden || !this.renderer) return;
    const dt = this.lastTime ? Math.min((time - this.lastTime) / 1000, 0.05) : 0;
    this.lastTime = time;
    if (this.playing) {
      this.elapsed += dt;
      this.angles[2] = (this.angles[2] + dt * this.speed * 40) % 360;
      this.angles[3] = (this.angles[3] + dt * this.speed * 27) % 360;
      this.dirty = true;
    }
    if (this.dirty) this.updateGeometry();
    this.controls?.update();
    this.render();
    this.frame = requestAnimationFrame(this.animate);
  };
  private render(): void {
    if (this.bloomEnabled) this.composer?.render();
    else this.renderer?.render(this.scene, this.camera);
  }
  private start(): void {
    if (!this.frame && !this.disposed && !document.hidden && !this.error) {
      this.lastTime = 0;
      this.zone.runOutsideAngular(() => this.frame = requestAnimationFrame(this.animate));
    }
  }
  private stop(): void { cancelAnimationFrame(this.frame); this.frame = 0; this.lastTime = 0; }
  private onVisibility = (): void => { if (document.hidden) this.stop(); else if (this.visible) this.start(); };
  private onContextLost = (event: Event): void => {
    event.preventDefault(); this.stop();
    this.zone.run(() => this.error = 'Se ha perdido el contexto gráfico. Recarga la página para reiniciar el visor.');
  };
  private resize(): void {
    const { width, height } = this.viewport.nativeElement.getBoundingClientRect();
    if (!width || !height) return;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer?.setSize(width, height);
    this.composer?.setSize(width, height);
  }
  async fullscreen(): Promise<void> {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await this.laboratory.nativeElement.requestFullscreen();
    } catch { this.notice = 'Tu navegador no permite activar la pantalla completa en este momento.'; }
  }
  exportImage(): void {
    if (!this.renderer || this.error) return;
    if (this.dirty) this.updateGeometry();
    const background = this.scene.background;
    this.scene.background = new THREE.Color('#080b18');
    this.render();
    this.renderer.domElement.toBlob(blob => {
      if (!blob) { this.zone.run(() => this.notice = 'No se ha podido exportar la imagen.'); return; }
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a'); link.href = url; link.download = 'teseracto.png'; link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    });
    this.scene.background = background;
  }
  private clearSection(): void {
    this.section.children.forEach(child => {
      const mesh = child as THREE.Mesh;
      mesh.geometry.dispose();
      const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      materials.forEach(m => m.dispose());
    });
    this.section.clear();
  }
  private release(): void {
    this.stop(); this.resizeObserver?.disconnect(); this.observer?.disconnect();
    document.removeEventListener('visibilitychange', this.onVisibility);
    this.controls?.dispose(); this.clearSection();
    const geometries = new Set<THREE.BufferGeometry>();
    this.object.traverse(child => {
      if (child instanceof THREE.Mesh || child instanceof THREE.Points) {
        geometries.add(child.geometry);
        const materials = Array.isArray(child.material) ? child.material : [child.material];
        materials.forEach((m: THREE.Material) => m.dispose());
      }
    });
    geometries.forEach(g => g.dispose());
    this.composer?.passes.forEach(pass => pass.dispose()); this.composer?.dispose();
    this.renderer?.domElement.removeEventListener('webglcontextlost', this.onContextLost);
    this.renderer?.dispose(); this.renderer?.domElement.remove();
  }
  ngOnDestroy(): void { this.disposed = true; this.release(); }
}
