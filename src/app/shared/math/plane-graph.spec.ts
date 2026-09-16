import { boundedPlaneFaces, cycleEdgeIndex, PLANE_EDGES, PLANE_POINTS, planeComponents, planeFaceLabel } from './plane-graph';

describe('Geometría y topología de la malla plana', () => {
  it('cuenta las caras por sus bordes, incluyendo la cara exterior por separado', () => {
    expect(boundedPlaneFaces(PLANE_POINTS, []).length).toBe(0);
    expect(boundedPlaneFaces(PLANE_POINTS, PLANE_EDGES.slice(0, 8)).length).toBe(0);
    expect(boundedPlaneFaces(PLANE_POINTS, PLANE_EDGES.slice(0, 12)).length).toBe(4);
    expect(boundedPlaneFaces(PLANE_POINTS, PLANE_EDGES).length).toBe(8);
  });
  it('incluye los vértices aislados en el número de componentes', () => {
    const edges = PLANE_EDGES.filter((_, i) => [0,6,12,5,11,15].includes(i));
    expect(new Set(planeComponents(9, edges)).size).toBe(5);
    expect(boundedPlaneFaces(PLANE_POINTS, edges).length).toBe(2);
    expect(new Set(planeComponents(9, [])).size).toBe(9);
  });
  it('reduce los ciclos a un árbol sin desconectar la malla', () => {
    let edges = [...PLANE_EDGES];
    while (cycleEdgeIndex(9, edges) >= 0) {
      const previous = boundedPlaneFaces(PLANE_POINTS, edges).length;
      edges.splice(cycleEdgeIndex(9, edges), 1);
      expect(new Set(planeComponents(9, edges)).size).toBe(1);
      expect(boundedPlaneFaces(PLANE_POINTS, edges).length).toBe(previous - 1);
    }
    expect(edges.length).toBe(8);
  });
  it('verifica Euler con recuentos independientes en 1024 subgrafos reproducibles', () => {
    for (let i = 0; i < 1024; i++) {
      const mask = (i * 40503 + 7919) & 65535;
      const edges = PLANE_EDGES.filter((_, j) => mask & (1 << j));
      const faces = boundedPlaneFaces(PLANE_POINTS, edges).length + 1;
      const k = new Set(planeComponents(9, edges)).size;
      expect(9 - edges.length + faces).toBe(1 + k);
    }
  });
  it('sitúa las etiquetas dentro de caras cóncavas sin dejarlas sobre sus bordes', () => {
    const points = [{x:0,y:0},{x:4,y:0},{x:4,y:1},{x:1,y:1},{x:1,y:4},{x:0,y:4}];
    const p = planeFaceLabel(points, [0,1,2,3,4,5]);
    expect(p.x > 0 && p.y > 0 && (p.x < 1 || p.y < 1)).toBe(true);
  });
});
