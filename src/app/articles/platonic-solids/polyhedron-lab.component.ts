import { AfterViewInit, Component, ElementRef, Input, NgZone, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { PolyhedronModel, Point3, scale } from './polyhedron-model';

@Component({
  selector: 'app-polyhedron-lab', standalone: true, imports: [CommonModule, FormsModule],
  templateUrl: './polyhedron-lab.component.html', styleUrl: './polyhedron-lab.component.css',
})
export class PolyhedronLabComponent implements AfterViewInit, OnDestroy {
  @Input({ required: true }) model!: PolyhedronModel;
  @ViewChild('stage', { static: true }) stage!: ElementRef<HTMLDivElement>;
  edge = 1; exploded = 0; face = 0;
  edges = true; vertices = true; labels = false; dual = false; radii = false;
  sphere: 'none' | 'inner' | 'outer' = 'none';
  rotating = false; xray = false; failed = false; angle = false;
  private renderer?: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera(35, 1, 0.05, 100);
  private controls?: OrbitControls;
  private solid = new THREE.Group();
  private faceMeshes: THREE.Mesh<THREE.BufferGeometry, THREE.MeshPhysicalMaterial>[] = [];
  private vertexGroup = new THREE.Group();
  private dualGroup = new THREE.Group();
  private radiusGroup = new THREE.Group();
  private angleGroup = new THREE.Group();
  private sphereMesh?: THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial>;
  private labelsDOM: HTMLSpanElement[] = [];
  private frame = 0;
  private visible = true;
  private resizeObserver?: ResizeObserver;
  private visibilityObserver?: IntersectionObserver;
  private environment?: THREE.WebGLRenderTarget;
  private cleanups: (() => void)[] = [];
  private reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  constructor(private zone: NgZone) {}
  get selectedFace() { return this.model.faces[this.face]; }
  get faceAngle() { return 180 * (this.model.p - 2) / this.model.p; }
  get solidAngle() { return this.model.q * this.model.dihedral * Math.PI / 180 - (this.model.q - 2) * Math.PI; }
  get coordinates() { return this.model.vertices; }
  number(n: number): string { return n.toLocaleString('es-ES', { maximumFractionDigits: 4 }); }

  ngAfterViewInit(): void {
    try {
      this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      this.renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
      this.renderer.outputColorSpace = THREE.SRGBColorSpace;
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      this.renderer.toneMappingExposure = 0.95;
      const canvas = this.renderer.domElement;
      canvas.setAttribute('aria-label', `${this.model.name} interactivo. Arrastra para girar y usa la rueda o dos dedos para acercar.`);
      canvas.setAttribute('role', 'img');
      this.stage.nativeElement.prepend(canvas);
      const pmrem = new THREE.PMREMGenerator(this.renderer);
      const room = new RoomEnvironment();
      this.environment = pmrem.fromScene(room, 0.04);
      this.scene.environment = this.environment.texture;
      room.dispose(); pmrem.dispose();
      this.scene.add(new THREE.HemisphereLight(0xe1f1ff, 0x302016, 0.8));
      const light = new THREE.DirectionalLight(0xffffff, 2.5);
      light.position.set(3,5,4); this.scene.add(light);
      const rim = new THREE.DirectionalLight(0x8ccbc2, 1.5);
      rim.position.set(-3,1,-2); this.scene.add(rim);
      this.scene.add(this.solid);
      this.solid.add(this.vertexGroup, this.dualGroup, this.radiusGroup, this.angleGroup);
      this.build();
      this.controls = new OrbitControls(this.camera, canvas);
      this.controls.enableDamping = true;
      this.controls.enablePan = false;
      this.controls.minDistance = 2.7; this.controls.maxDistance = 9;
      this.controls.autoRotateSpeed = 0.7;
      this.reset();
      let down = [0,0];
      const pointerDown = (event: PointerEvent) => down = [event.clientX, event.clientY];
      const pointerUp = (event: PointerEvent) => {
        if (Math.hypot(event.clientX-down[0],event.clientY-down[1]) > 5) return;
        const rect = canvas.getBoundingClientRect();
        const ray = new THREE.Raycaster();
        ray.setFromCamera(new THREE.Vector2((event.clientX-rect.left)/rect.width*2-1, -(event.clientY-rect.top)/rect.height*2+1), this.camera);
        const hit = ray.intersectObjects(this.faceMeshes, false)[0];
        if (hit) this.zone.run(() => { this.face = this.faceMeshes.indexOf(hit.object as typeof this.faceMeshes[number]); this.update(); });
      };
      canvas.addEventListener('pointerdown', pointerDown);
      canvas.addEventListener('pointerup', pointerUp);
      this.cleanups.push(() => { canvas.removeEventListener('pointerdown', pointerDown); canvas.removeEventListener('pointerup', pointerUp); });
      this.resizeObserver = new ResizeObserver(() => this.resize());
      this.resizeObserver.observe(this.stage.nativeElement);
      this.visibilityObserver = new IntersectionObserver(([entry]) => this.visible = entry.isIntersecting);
      this.visibilityObserver.observe(this.stage.nativeElement);
      this.resize(); this.update();
      this.zone.runOutsideAngular(() => this.animate());
    } catch {
      queueMicrotask(() => { this.failed = true; });
      this.dispose();
    }
  }
  private vector(p: Point3): THREE.Vector3 { return new THREE.Vector3(...p); }
  private line(points: Point3[], color: number, opacity = 1): THREE.LineSegments {
    return new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(points.map(p => this.vector(p))), new THREE.LineBasicMaterial({ color, transparent: opacity < 1, opacity }));
  }
  private build(): void {
    const vertices = this.model.vertices.map(v => scale(v, 1 / this.model.radius));
    const view = new THREE.Vector3(2.7, 2.1, 3.6);
    this.face = this.model.faces.reduce((best, face, i) =>
      this.vector(face.normal).dot(view) > this.vector(this.model.faces[best].normal).dot(view) ? i : best, 0);
    for (const [i, face] of this.model.faces.entries()) {
      const center = scale(face.center, 1 / this.model.radius);
      const positions: number[] = [];
      for (let k=1; k<face.vertices.length-1; k++)
        for (const id of [face.vertices[0],face.vertices[k],face.vertices[k+1]]) positions.push(...vertices[id]);
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions,3));
      geometry.computeVertexNormals();
      // The golden-angle hue spacing separates consecutive faces. Varying
      // lightness adds another cue, with a stable color for every face index.
      const color = new THREE.Color().setHSL((0.08 + i * 0.38196601125) % 1, 0.58, 0.46 + (i % 3) * 0.07, THREE.SRGBColorSpace);
      const material = new THREE.MeshPhysicalMaterial({ color, roughness: 0.28, metalness: 0.3, clearcoat: 0.8, clearcoatRoughness: 0.24, envMapIntensity: 0.65, side: THREE.DoubleSide });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.userData['center'] = center;
      mesh.userData['face'] = i;
      this.faceMeshes.push(mesh); this.solid.add(mesh);
      // Per-face outlines follow exploded faces; no triangulation diagonals.
      const outline = this.line(face.vertices.flatMap((id,k) => [vertices[id],vertices[face.vertices[(k+1)%face.vertices.length]]]), 0xf2dfb8);
      mesh.add(outline);
    }
    for (const [i, vertex] of vertices.entries()) {
      const point = new THREE.Mesh(new THREE.SphereGeometry(0.023,12,8), new THREE.MeshStandardMaterial({ color: 0xffe1a4, metalness: 0.25, roughness: 0.3 }));
      point.position.copy(this.vector(vertex)); this.vertexGroup.add(point);
      const label = document.createElement('span');
      label.className = 'vertex-label'; label.textContent = `V${i}`;
      this.stage.nativeElement.append(label); this.labelsDOM.push(label);
    }
    const centers = this.model.faces.map(f => scale(f.center, 1 / this.model.radius));
    for (let i=0;i<this.model.faces.length;i++) for (let j=i+1;j<this.model.faces.length;j++)
      if (this.model.faces[i].vertices.filter(v => this.model.faces[j].vertices.includes(v)).length === 2)
        this.dualGroup.add(this.line([centers[i],centers[j]],0xf2b86f));
    for (const center of centers) {
      const point = new THREE.Mesh(new THREE.SphereGeometry(0.018,10,8), new THREE.MeshBasicMaterial({ color: 0xffcf87, depthTest: false }));
      point.position.copy(this.vector(center)); this.dualGroup.add(point);
    }
    this.sphereMesh = new THREE.Mesh(new THREE.SphereGeometry(1,40,24), new THREE.MeshBasicMaterial({ color: 0x8ebbe2, wireframe: true, transparent: true, opacity: 0.12, depthWrite: false }));
    this.solid.add(this.sphereMesh);
  }
  update(): void {
    if (!this.renderer) return;
    this.face = Number(this.face);
    const f = this.selectedFace;
    const neighbor = this.model.faces.findIndex((other, i) => i !== this.face && other.vertices.includes(f.vertices[0]) && other.vertices.includes(f.vertices[1]));
    for (const [i, mesh] of this.faceMeshes.entries()) {
      const selected = i === this.face;
      const adjacent = this.angle && i === neighbor;
      // Highlight through the outline and a gentle glow, preserving face colors.
      mesh.material.emissive.setHex(selected ? 0xe6b96a : adjacent ? 0x8ebbe2 : 0x000000);
      mesh.material.emissiveIntensity = selected || adjacent ? 0.16 : 0;
      const outline = mesh.children[0] as THREE.LineSegments<THREE.BufferGeometry, THREE.LineBasicMaterial>;
      outline.material.color.setHex(selected ? 0xffd166 : adjacent ? 0x8ebbe2 : 0xf2dfb8);
      mesh.material.transparent = this.xray || this.dual;
      mesh.material.opacity = this.dual ? 0.16 : this.xray ? 0.28 : 1;
      mesh.material.depthWrite = !(this.xray || this.dual);
      mesh.material.needsUpdate = true;
      const center = mesh.userData['center'] as Point3;
      mesh.position.copy(this.vector(center).multiplyScalar(this.exploded));
      outline.visible = this.edges || selected || adjacent;
    }
    this.vertexGroup.visible = this.vertices && this.exploded === 0;
    this.dualGroup.visible = this.dual;
    if (this.sphereMesh) {
      this.sphereMesh.visible = this.sphere !== 'none';
      this.sphereMesh.scale.setScalar(this.sphere === 'inner' ? this.model.inradius / this.model.radius : 1);
    }
    // Replace only the three radius segments, disposing their GPU resources.
    this.radiusGroup.children.slice().forEach(child => { this.release(child); this.radiusGroup.remove(child); });
    const a = this.model.vertices[f.vertices[0]], b = this.model.vertices[f.vertices[1]];
    const middle = scale([a[0]+b[0],a[1]+b[1],a[2]+b[2]],0.5);
    const origin: Point3 = [0,0,0];
    for (const [point, color] of [[a,0x8ebbe2],[f.center,0xe6b96a],[middle,0x9ecfa9]] as const)
      this.radiusGroup.add(this.line([origin,scale(point,1/this.model.radius)],color));
    this.radiusGroup.visible = this.radii;
    this.angleGroup.children.slice().forEach(child => { this.release(child); this.angleGroup.remove(child); });
    if (neighbor >= 0) {
      const midpoint = this.vector(scale(middle, 1 / this.model.radius));
      const u = this.vector(f.center).sub(this.vector(middle)).normalize();
      const w = this.vector(this.model.faces[neighbor].center).sub(this.vector(middle)).normalize();
      const v = w.clone().addScaledVector(u, -u.dot(w)).normalize();
      const delta = this.model.dihedral * Math.PI / 180;
      const points: THREE.Vector3[] = [];
      for (let i=0;i<=48;i++) points.push(midpoint.clone().addScaledVector(u, 0.23*Math.cos(delta*i/48)).addScaledVector(v, 0.23*Math.sin(delta*i/48)));
      const material = new THREE.LineBasicMaterial({ color: 0xfff2d8, depthTest: false });
      const arc = new THREE.Line(new THREE.BufferGeometry().setFromPoints(points),material);
      arc.renderOrder = 5; this.angleGroup.add(arc);
      for (const direction of [u,w]) {
        const segment = new THREE.Line(new THREE.BufferGeometry().setFromPoints([midpoint,midpoint.clone().addScaledVector(direction,0.32)]),material.clone());
        segment.renderOrder = 5; this.angleGroup.add(segment);
      }
    }
    this.angleGroup.visible = this.angle && this.exploded === 0;
  }
  project(plane: 'xy' | 'xz' | 'yz'): void {
    this.rotating = false;
    this.camera.up.set(0,1,0);
    if (plane === 'xy') this.camera.position.set(0,0,4.9);
    if (plane === 'yz') this.camera.position.set(4.9,0,0);
    if (plane === 'xz') { this.camera.position.set(0,4.9,0); this.camera.up.set(0,0,-1); }
    this.controls?.target.set(0,0,0); this.controls?.update();
  }
  reset(): void {
    this.camera.up.set(0,1,0);
    this.camera.position.set(2.7,2.1,3.6);
    this.controls?.target.set(0,0,0); this.controls?.update();
  }
  private resize(): void {
    const { width, height } = this.stage.nativeElement.getBoundingClientRect();
    if (!width || !height || !this.renderer) return;
    this.camera.aspect = width / height; this.camera.updateProjectionMatrix();
    this.renderer.setSize(width,height);
  }
  private animate = (): void => {
    this.frame = requestAnimationFrame(this.animate);
    if (!this.visible || !this.renderer) return;
    if (this.controls) { this.controls.autoRotate = this.rotating && !this.reducedMotion; this.controls.update(); }
    this.renderer.render(this.scene,this.camera);
    const { clientWidth: w, clientHeight: h } = this.stage.nativeElement;
    const direction = this.camera.position.clone().normalize();
    this.labelsDOM.forEach((label,i) => {
      const v = this.vector(scale(this.model.vertices[i],1/this.model.radius));
      const front = v.dot(direction) > -0.08;
      const projected = v.clone().multiplyScalar(1.065).project(this.camera);
      label.hidden = !this.labels || this.exploded > 0 || !front || projected.z > 1;
      label.style.transform = `translate(${(projected.x+1)*w/2}px,${(1-projected.y)*h/2}px) translate(-50%,-50%)`;
    });
  };
  download(): void {
    if (!this.renderer) return;
    this.renderer.render(this.scene,this.camera);
    const a = document.createElement('a');
    a.download = `${this.model.name.toLowerCase()}.png`; a.href = this.renderer.domElement.toDataURL('image/png'); a.click();
  }
  private release(object: THREE.Object3D): void {
    object.traverse(child => {
      const mesh = child as THREE.Mesh;
      mesh.geometry?.dispose();
      if (Array.isArray(mesh.material)) mesh.material.forEach(m => m.dispose());
      else mesh.material?.dispose();
    });
  }
  private dispose(): void {
    cancelAnimationFrame(this.frame); this.resizeObserver?.disconnect(); this.visibilityObserver?.disconnect();
    this.controls?.dispose(); this.cleanups.forEach(fn => fn());
    this.release(this.scene); this.environment?.dispose();
    this.renderer?.forceContextLoss(); this.renderer?.dispose(); this.renderer?.domElement.remove();
    this.renderer = undefined;
    this.labelsDOM.forEach(label => label.remove());
    this.labelsDOM = [];
  }
  ngOnDestroy(): void { this.dispose(); }
}
