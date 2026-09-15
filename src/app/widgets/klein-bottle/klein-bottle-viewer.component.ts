import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, NgZone, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { ParametricGeometry } from 'three/examples/jsm/geometries/ParametricGeometry.js';
import { kleinPoint } from './klein-bottle.math';

@Component({
  selector: 'app-klein-bottle-viewer', standalone: true,
  imports: [CommonModule, FormsModule], templateUrl: './klein-bottle-viewer.component.html',
  styleUrls: ['./klein-bottle.css']
})
export class KleinBottleViewerComponent implements AfterViewInit, OnDestroy {
  @ViewChild('host', { static: true }) host!: ElementRef<HTMLDivElement>;
  section = 0.3;
  point = 0.25;
  wireframe = false;
  unavailable = false;
  private renderer?: THREE.WebGLRenderer;
  private controls?: OrbitControls;
  private observer?: ResizeObserver;
  private scene = new THREE.Scene();
  private group = new THREE.Group();
  private camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  private material?: THREE.MeshStandardMaterial;
  private sectionLine?: THREE.Line;
  private marker?: THREE.Mesh;
  constructor(private zone: NgZone, private detector: ChangeDetectorRef) {}
  get position() { return kleinPoint(this.section, this.point); }
  ngAfterViewInit() {
    try {
      this.renderer = new THREE.WebGLRenderer({ antialias: true });
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); this.renderer.setClearColor(0x0b0b13);
      this.renderer.domElement.setAttribute('role', 'img');
      this.renderer.domElement.setAttribute('aria-label', 'Inmersión tridimensional de la botella de Klein con sección amarilla y punto rosa.');
      this.host.nativeElement.appendChild(this.renderer.domElement);
      this.scene.add(new THREE.HemisphereLight(0xffffff, 0x555577, 2));
      const light = new THREE.DirectionalLight(0xffffff, 2.5); light.position.set(3, -4, 6); this.scene.add(light);
      this.scene.add(this.group); this.camera.up.set(0, 0, 1); this.camera.position.set(7, -10, 5);
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enablePan = false; this.controls.minDistance = 5; this.controls.maxDistance = 18;
      this.controls.addEventListener('change', this.render);
      this.material = new THREE.MeshStandardMaterial({ color: 0x7198c9, side: THREE.DoubleSide, roughness: 0.65, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1 });
      const geometry = new ParametricGeometry((u, v, target) => { const p = kleinPoint(u, v); target.set(p.x, p.y, p.z); }, 160, 64);
      this.group.add(new THREE.Mesh(geometry, this.material));
      this.sectionLine = new THREE.Line(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({ color: 0xf6c76b })); this.group.add(this.sectionLine);
      this.marker = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 12), new THREE.MeshBasicMaterial({ color: 0xef9fa8 })); this.group.add(this.marker);
      this.observer = new ResizeObserver(() => this.resize()); this.observer.observe(this.host.nativeElement);
      this.update(); this.resize();
    } catch {
      this.unavailable = true; this.dispose(); this.detector.detectChanges();
    }
  }
  update() {
    if (!this.renderer) { return; }
    if (this.material) { this.material.wireframe = this.wireframe; }
    if (this.sectionLine) {
      const points = Array.from({ length: 161 }, (_, i) => { const p = kleinPoint(this.section, i / 160); return new THREE.Vector3(p.x, p.y, p.z); });
      this.sectionLine.geometry.dispose(); this.sectionLine.geometry = new THREE.BufferGeometry().setFromPoints(points);
    }
    const p = this.position; this.marker?.position.set(p.x, p.y, p.z); this.render();
  }
  view(side: boolean) { this.camera.position.set(side ? 0 : 7, side ? -13 : -10, side ? 0 : 5); this.controls?.update(); this.render(); }
  private resize() {
    if (!this.renderer) { return; }
    const width = Math.max(1, this.host.nativeElement.clientWidth), height = this.host.nativeElement.clientHeight || 400;
    this.camera.aspect = width / height; this.camera.updateProjectionMatrix(); this.renderer.setSize(width, height); this.render();
  }
  private render = () => { this.zone.runOutsideAngular(() => this.renderer?.render(this.scene, this.camera)); };
  private dispose() {
    this.observer?.disconnect(); this.controls?.removeEventListener('change', this.render); this.controls?.dispose();
    this.group.traverse(object => { const mesh = object as THREE.Mesh; mesh.geometry?.dispose();
      if (mesh.material) { (Array.isArray(mesh.material) ? mesh.material : [mesh.material]).forEach(material => material.dispose()); } });
    this.group.clear(); this.renderer?.dispose(); this.renderer?.domElement.remove(); this.renderer = undefined;
  }
  ngOnDestroy() { this.dispose(); }
}
