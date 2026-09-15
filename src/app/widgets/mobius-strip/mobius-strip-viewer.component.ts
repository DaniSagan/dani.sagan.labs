import {
  AfterViewInit,
  ChangeDetectorRef,
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
import { stripNormal, stripPoint } from './mobius-strip.math';

@Component({
  selector: 'app-mobius-strip-viewer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mobius-strip-viewer.component.html',
  styleUrls: ['./mobius-strip.css'],
})
export class MobiusStripViewerComponent implements AfterViewInit, OnDestroy {
  @ViewChild('host', { static: true }) host!: ElementRef<HTMLDivElement>;
  twisted = true;
  width = 0.6;
  laps = 0;
  route = 'center';
  unavailable = false;
  private renderer?: THREE.WebGLRenderer;
  private controls?: OrbitControls;
  private observer?: ResizeObserver;
  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  private group = new THREE.Group();
  private marker?: THREE.Mesh;
  private arrow?: THREE.ArrowHelper;
  constructor(
    private zone: NgZone,
    private changeDetector: ChangeDetectorRef,
  ) {}
  ngAfterViewInit() {
    try {
      this.renderer = new THREE.WebGLRenderer({ antialias: true });
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      this.renderer.setClearColor(0x0b0b13);
      this.renderer.domElement.setAttribute('role', 'img');
      this.renderer.domElement.setAttribute(
        'aria-label',
        'Modelo tridimensional de la cinta. Los controles de recorrido y vista están disponibles debajo.',
      );
      this.host.nativeElement.appendChild(this.renderer.domElement);
      this.scene.add(new THREE.HemisphereLight(0xffffff, 0x555577, 2));
      const light = new THREE.DirectionalLight(0xffffff, 2.5);
      light.position.set(3, -2, 6);
      this.scene.add(light);
      this.scene.add(this.group);
      this.camera.up.set(0, 0, 1);
      this.camera.position.set(5, -6, 5);
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enablePan = false;
      this.controls.minDistance = 4;
      this.controls.maxDistance = 14;
      this.controls.addEventListener('change', this.render);
      this.observer = new ResizeObserver(() => this.resize());
      this.observer.observe(this.host.nativeElement);
      this.rebuild();
      this.resize();
    } catch {
      this.unavailable = true;
      this.controls?.dispose();
      this.renderer?.dispose();
      this.renderer?.domElement.remove();
      this.renderer = undefined;
      this.observer?.disconnect();
      this.disposeGroup();
      this.changeDetector.detectChanges();
    }
  }
  private vector(u: number, v: number) {
    const p = stripPoint(u, v, this.twisted);
    return new THREE.Vector3(p.x, p.y, p.z);
  }
  private disposeGroup() {
    this.group.traverse((object) => {
      const drawable = object as THREE.Mesh;
      drawable.geometry?.dispose();
      if (drawable.material) {
        (Array.isArray(drawable.material)
          ? drawable.material
          : [drawable.material]
        ).forEach((material) => material.dispose());
      }
    });
    this.group.clear();
  }
  rebuild() {
    if (!this.renderer) {
      return;
    }
    this.disposeGroup();
    const positions: number[] = [],
      indices: number[] = [];
    const along = 160,
      across = 12;
    for (let i = 0; i <= along; i++) {
      for (let j = 0; j <= across; j++) {
        const p = this.vector(
          (i * 2 * Math.PI) / along,
          this.width * ((2 * j) / across - 1),
        );
        positions.push(p.x, p.y, p.z);
        if (i < along && j < across) {
          const a = i * (across + 1) + j,
            b = a + across + 1;
          indices.push(a, b, a + 1, a + 1, b, b + 1);
        }
      }
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(positions, 3),
    );
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
    this.group.add(
      new THREE.Mesh(
        geometry,
        new THREE.MeshStandardMaterial({
          color: 0x7198c9,
          side: THREE.DoubleSide,
          roughness: 0.7,
          polygonOffset: true,
          polygonOffsetFactor: 1,
          polygonOffsetUnits: 1,
        }),
      ),
    );
    this.addLine(
      this.width,
      this.twisted ? 4 * Math.PI : 2 * Math.PI,
      0xf6c76b,
    );
    if (!this.twisted) {
      this.addLine(-this.width, 2 * Math.PI, 0x6ed5ba);
    }
    this.addLine(0, 2 * Math.PI, 0xffffff);
    this.marker = new THREE.Mesh(
      new THREE.SphereGeometry(0.09, 16, 12),
      new THREE.MeshBasicMaterial({ color: 0xef9fa8 }),
    );
    this.group.add(this.marker);
    this.arrow = new THREE.ArrowHelper(
      new THREE.Vector3(0, 0, -1),
      new THREE.Vector3(),
      0.7,
      0xef9fa8,
      0.18,
      0.1,
    );
    this.group.add(this.arrow);
    this.move();
  }
  private addLine(v: number, end: number, color: number) {
    const points = Array.from({ length: 481 }, (_, i) =>
      this.vector((end * i) / 480, v),
    );
    this.group.add(
      new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(points),
        new THREE.LineBasicMaterial({ color }),
      ),
    );
  }
  move() {
    const u = this.laps * 2 * Math.PI;
    this.marker?.position.copy(
      this.vector(u, this.route === 'edge' ? this.width : 0),
    );
    if (this.arrow) {
      this.arrow.visible = this.route === 'center';
      this.arrow.position.copy(this.vector(u, 0));
      const n = stripNormal(u, this.twisted);
      this.arrow.setDirection(new THREE.Vector3(n.x, n.y, n.z));
    }
    this.render();
  }
  view(top: boolean) {
    this.camera.position.set(top ? 0.01 : 5, top ? -0.01 : -6, top ? 9 : 5);
    this.controls?.update();
    this.render();
  }
  private resize() {
    if (!this.renderer) {
      return;
    }
    const width = Math.max(1, this.host.nativeElement.clientWidth),
      height = this.host.nativeElement.clientHeight || 380;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
    this.render();
  }
  private render = () => {
    this.zone.runOutsideAngular(() =>
      this.renderer?.render(this.scene, this.camera),
    );
  };
  ngOnDestroy() {
    this.observer?.disconnect();
    this.controls?.removeEventListener('change', this.render);
    this.controls?.dispose();
    this.disposeGroup();
    this.renderer?.dispose();
    this.renderer?.domElement.remove();
  }
}
