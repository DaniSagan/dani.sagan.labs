import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'app-rubik-cube',
  templateUrl: './rubik-cube.component.html',
  styleUrls: ['./rubik-cube.component.css']
})
export class RubikCubeComponent implements AfterViewInit {
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  scene!: THREE.Scene;
  camera!: THREE.PerspectiveCamera;
  renderer!: THREE.WebGLRenderer;
  cube!: THREE.Group;
  rotationSpeed: number = 0.01;
  isRotating: boolean = false; // Control de rotación

  // Colores tradicionales del cubo de Rubik
  colors = {
    white: '#FFFFFF',
    red: '#FF0000',
    blue: '#0000FF',
    green: '#00FF00',
    yellow: '#FFFF00',
    orange: '#FFA500'
  };

  ngAfterViewInit() {
    this.initScene();
    this.animate();
  }

  // Inicializar la escena
  initScene() {
    const canvas = this.canvasRef.nativeElement;

    // Crear la escena
    this.scene = new THREE.Scene();

    // Crear la cámara
    this.camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    this.camera.position.z = 5;

    // Crear el renderer
    this.renderer = new THREE.WebGLRenderer({ canvas: canvas });
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);

    // Crear el cubo de Rubik
    this.cube = new THREE.Group();

    const cubeSize = 0.9;

    // Crear cubitos dentro del cubo de Rubik (3x3x3)
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          const geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);

          // Definir materiales para cada cara (colores tradicionales)
          const materials = [
            new THREE.MeshBasicMaterial({ color: this.colors.white }),  // Cara superior (blanco)
            new THREE.MeshBasicMaterial({ color: this.colors.yellow }), // Cara inferior (amarillo)
            new THREE.MeshBasicMaterial({ color: this.colors.red }),    // Cara frontal (rojo)
            new THREE.MeshBasicMaterial({ color: this.colors.orange }), // Cara trasera (naranja)
            new THREE.MeshBasicMaterial({ color: this.colors.blue }),   // Cara izquierda (azul)
            new THREE.MeshBasicMaterial({ color: this.colors.green })   // Cara derecha (verde)
          ];

          const cubie = new THREE.Mesh(geometry, materials);
          cubie.position.set(x, y, z);
          cubie.userData = { x, y, z };  // Almacena la posición inicial para rotaciones
          this.cube.add(cubie);
        }
      }
    }

    this.scene.add(this.cube);
  }

  // Animación para rotar el cubo
  animate() {
    requestAnimationFrame(() => this.animate());
    this.renderer.render(this.scene, this.camera);
  }

  // Rotar una cara del cubo
  rotateFace(axis: string, index: number, direction: number) {
    if (this.isRotating) return;

    this.isRotating = true;
    const duration = 500; // Duración de la animación
    const angle = direction * Math.PI / 2; // Ángulo de rotación (90 grados)

    const cubies = this.cube.children.filter((cubie: any) => Math.round(cubie.position[axis]) === index);

    // Realizar la animación
    let startTime: number;
    const animateRotation = (time: number) => {
      if (!startTime) startTime = time;
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const rotationMatrix = new THREE.Matrix4();
      rotationMatrix.makeRotationAxis(new THREE.Vector3(axis === 'x' ? 1 : 0, axis === 'y' ? 1 : 0, axis === 'z' ? 1 : 0), progress * angle);

      cubies.forEach((cubie: any) => {
        cubie.applyMatrix4(rotationMatrix);
      });

      if (progress < 1) {
        requestAnimationFrame(animateRotation);
      } else {
        this.updateCubiesPosition(cubies, axis, direction);
        this.isRotating = false;
      }
    };

    requestAnimationFrame(animateRotation);
  }

  // Actualizar la posición de los cubitos después de la rotación
  updateCubiesPosition(cubies: any[], axis: string, direction: number) {
    cubies.forEach(cubie => {
      const { x, y, z } = cubie.userData;

      switch (axis) {
        case 'x':
          cubie.userData.y = direction > 0 ? -z : z;
          cubie.userData.z = direction > 0 ? y : -y;
          break;
        case 'y':
          cubie.userData.x = direction > 0 ? z : -z;
          cubie.userData.z = direction > 0 ? -x : x;
          break;
        case 'z':
          cubie.userData.x = direction > 0 ? -y : y;
          cubie.userData.y = direction > 0 ? x : -x;
          break;
      }

      cubie.position.set(cubie.userData.x, cubie.userData.y, cubie.userData.z);
    });
  }

  // Rotar todo el cubo
  rotateCube(axis: string, direction: number) {
    if (axis === 'x') {
      this.cube.rotation.x += direction * Math.PI / 2;
    } else if (axis === 'y') {
      this.cube.rotation.y += direction * Math.PI / 2;
    } else if (axis === 'z') {
      this.cube.rotation.z += direction * Math.PI / 2;
    }
  }
}
