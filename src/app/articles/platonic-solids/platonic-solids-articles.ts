import { DodecahedronViewerComponent } from './dodecahedron-viewer/dodecahedron-viewer.component';
import { HexahedronViewerComponent } from './hexahedron-viewer/hexahedron-viewer.component';
import { IcosahedronViewerComponent } from './icosahedron-viewer/icosahedron-viewer.component';
import { OctahedronViewerComponent } from './octahedron-viewer/octahedron-viewer.component';
import { TetrahedronViewerComponent } from './tetrahedron-viewer/tetrahedron-viewer.component';

export const PLATONIC_SOLIDS_ARTICLES = [
  DodecahedronViewerComponent,
  HexahedronViewerComponent,
  IcosahedronViewerComponent,
  OctahedronViewerComponent,
  TetrahedronViewerComponent,
] as const;
