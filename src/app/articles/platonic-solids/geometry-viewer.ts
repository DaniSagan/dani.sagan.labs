import { ElementRef } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { SSAOPass } from 'three/examples/jsm/postprocessing/SSAOPass';

export abstract class GeometryViewer {
  protected renderer!: THREE.WebGLRenderer;
  protected scene!: THREE.Scene;
  protected camera!: THREE.PerspectiveCamera;
  protected geometry!: THREE.Mesh;
  protected controls!: OrbitControls;
  protected composer!: EffectComposer;  // Para efectos de postprocesado
  protected ssaoPass!: SSAOPass;        // Para oclusión ambiental

  initThreeJS(rendererContainer: ElementRef): void {
    const width = rendererContainer.nativeElement.clientWidth;
    const height = rendererContainer.nativeElement.clientHeight;

    // Crear el renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(width, height);
    rendererContainer.nativeElement.appendChild(this.renderer.domElement);

    // Crear la escena
    this.scene = new THREE.Scene();

    // Crear la cámara
    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    this.camera.position.z = 5;

    // Crear la geometría del dodecaedro
    const geometry = this.getPolyhedron();//new THREE.DodecahedronGeometry();
    const material = new THREE.MeshStandardMaterial({ color: 0xffffff, wireframe: false });
    this.geometry = new THREE.Mesh(geometry, material);
    this.scene.add(this.geometry);

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

  abstract getPolyhedron(): THREE.PolyhedronGeometry;

  resizeWindow(rendererContainer: ElementRef): void {
    const width = rendererContainer.nativeElement.clientWidth;
    const height = rendererContainer.nativeElement.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
    this.composer.setSize(width, height);
  }
}
