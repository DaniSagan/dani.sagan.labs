import { RouterLink } from '@angular/router';
import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { GeometryViewer } from '../geometry-viewer';
import * as THREE from 'three';

@Component({
  selector: 'app-hexahedron-viewer',
  templateUrl: './hexahedron-viewer.component.html',
  styleUrl: './hexahedron-viewer.component.css',
  standalone: true,
  imports: [RouterLink],
})
export class HexahedronViewerComponent
  extends GeometryViewer
  implements OnInit
{
  @ViewChild('rendererContainer', { static: true })
  rendererContainer!: ElementRef;

  static title: string = 'Hexahedro regular';
  static route: string = 'hexahedron-viewer';

  ngOnInit(): void {
    this.initThreeJS(this.rendererContainer);
  }

  getPolyhedron(): THREE.BufferGeometry {
    return new THREE.BoxGeometry();
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize(): void {
    this.resizeWindow(this.rendererContainer);
  }
}
