import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { GeometryViewer } from '../geometry-viewer';
import * as THREE from 'three';

@Component({
  selector: 'app-tetrahedron-viewer',
  templateUrl: './tetrahedron-viewer.component.html',
  styleUrl: './tetrahedron-viewer.component.css',
  standalone: true,
})
export class TetrahedronViewerComponent extends GeometryViewer {
  @ViewChild('rendererContainer', { static: true })
  rendererContainer!: ElementRef;

  static title: string = 'Tetrahedro regular';
  static route: string = 'tetrahedron-viewer';

  ngOnInit(): void {
    this.initThreeJS(this.rendererContainer);
  }

  getPolyhedron(): THREE.BufferGeometry {
    return new THREE.TetrahedronGeometry();
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize(): void {
    this.resizeWindow(this.rendererContainer);
  }
}
