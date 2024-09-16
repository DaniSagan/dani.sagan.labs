import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { GeometryViewer } from '../geometry-viewer';
import * as THREE from 'three';

@Component({
  selector: 'app-octahedron-viewer',
  templateUrl: './octahedron-viewer.component.html',
  styleUrl: './octahedron-viewer.component.css'
})
export class OctahedronViewerComponent extends GeometryViewer implements OnInit {
  @ViewChild('rendererContainer', { static: true }) rendererContainer!: ElementRef;

  static title: string = 'Octahedro regular';
  static route: string = 'octahedron-viewer';

  ngOnInit(): void {
    this.initThreeJS(this.rendererContainer);
  }

  getPolyhedron(): THREE.BufferGeometry {
    return new THREE.OctahedronGeometry();
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize(): void {
    this.resizeWindow(this.rendererContainer);
  }
}
