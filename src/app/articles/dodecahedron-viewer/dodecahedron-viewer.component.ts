import { Component, ElementRef, OnInit, ViewChild, HostListener } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { SSAOPass } from 'three/examples/jsm/postprocessing/SSAOPass';

@Component({
  selector: 'app-dodecahedron-viewer',
  templateUrl: './dodecahedron-viewer.component.html',
  styleUrls: ['./dodecahedron-viewer.component.css']
})
export class DodecahedronViewerComponent implements OnInit {
  @ViewChild('rendererContainer', { static: true }) rendererContainer!: ElementRef;

  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private dodecahedron!: THREE.Mesh;
  private controls!: OrbitControls;
  private composer!: EffectComposer;  // Para efectos de postprocesado
  private ssaoPass!: SSAOPass;        // Para oclusión ambiental

  ngOnInit(): void {
    this.initThreeJS();
  }

  initThreeJS(): void {
    const width = this.rendererContainer.nativeElement.clientWidth;
    const height = this.rendererContainer.nativeElement.clientHeight;

    // Crear el renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(width, height);
    this.rendererContainer.nativeElement.appendChild(this.renderer.domElement);

    // Crear la escena
    this.scene = new THREE.Scene();

    // Crear la cámara
    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    this.camera.position.z = 5;

    // Crear la geometría del dodecaedro
    const geometry = new THREE.DodecahedronGeometry();
    const material = new THREE.MeshStandardMaterial({ color: 0xffffff, wireframe: false });
    this.dodecahedron = new THREE.Mesh(geometry, material);
    this.scene.add(this.dodecahedron);

    // Añadir una luz
    const light = new THREE.PointLight(0xffccff, 100, 100);
    light.position.set(10, 10, 10);
    this.scene.add(light);

    // Añadir una luz
    const light2 = new THREE.PointLight(0xffffcc, 100, 100);
    light2.position.set(-10, -10, 10);
    this.scene.add(light2);

    // Ambient light
    const ambientLight = new THREE.AmbientLight( 0x404040 ); // soft white light
    this.scene.add(ambientLight);

    // Crear los controles para permitir la interacción con el ratón
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    // Crear el compositor para postprocesado
    this.composer = new EffectComposer(this.renderer);
    const renderPass = new RenderPass(this.scene, this.camera);
    this.composer.addPass(renderPass);

    // Añadir el SSAO para oclusión ambiental
    this.ssaoPass = new SSAOPass(this.scene, this.camera, width, height);
    this.ssaoPass.kernelRadius = 16; // Configuración de oclusión ambiental
    this.composer.addPass(this.ssaoPass);

    // Render loop
    this.animate();
  }

  animate(): void {
    requestAnimationFrame(() => this.animate());

    // Actualizar los controles (para la interacción con el ratón)
    this.controls.update();

    // Renderizar la escena
    this.renderer.render(this.scene, this.camera);
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize(): void {
    const width = this.rendererContainer.nativeElement.clientWidth;
    const height = this.rendererContainer.nativeElement.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
    this.composer.setSize(width, height);
  }
}
