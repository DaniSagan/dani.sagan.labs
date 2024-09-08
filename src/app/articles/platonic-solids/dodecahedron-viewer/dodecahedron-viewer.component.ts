import { Component, ElementRef, OnInit, ViewChild, HostListener, Input } from '@angular/core';
import * as THREE from 'three';
import { GeometryViewer } from '../geometry-viewer';

@Component({
  selector: 'app-dodecahedron-viewer',
  templateUrl: './dodecahedron-viewer.component.html',
  styleUrls: ['./dodecahedron-viewer.component.css']
})
export class DodecahedronViewerComponent extends GeometryViewer implements OnInit {
  @ViewChild('rendererContainer', { static: true }) rendererContainer!: ElementRef;

  title: string = 'Dodecahedro regular';

  ngOnInit(): void {
    this.initThreeJS(this.rendererContainer);
  }

  getPolyhedron(): THREE.BufferGeometry {
    return new THREE.DodecahedronGeometry();
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize(): void {
    this.resizeWindow(this.rendererContainer);
  }
}
