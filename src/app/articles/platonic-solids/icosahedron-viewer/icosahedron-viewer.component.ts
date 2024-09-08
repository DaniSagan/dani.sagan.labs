import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { GeometryViewer } from '../geometry-viewer';
import * as THREE from 'three';

@Component({
  selector: 'app-icosahedron-viewer',
  templateUrl: './icosahedron-viewer.component.html',
  styleUrl: './icosahedron-viewer.component.css'
})
export class IcosahedronViewerComponent extends GeometryViewer implements OnInit {
  @ViewChild('rendererContainer', { static: true }) rendererContainer!: ElementRef;

  title: string = 'Icosahedro regular';

  ngOnInit(): void {
    this.initThreeJS(this.rendererContainer);
  }

  getPolyhedron(): THREE.BufferGeometry {
    return new THREE.IcosahedronGeometry();
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize(): void {
    this.resizeWindow(this.rendererContainer);
  }
}
