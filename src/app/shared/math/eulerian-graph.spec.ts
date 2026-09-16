import { analyzeBridges, Bridge, eulerianRoute, KONIGSBERG_BRIDGES } from './eulerian-graph';

function verifyRoute(edges: Bridge[]): void {
  const route = eulerianRoute(edges)!;
  expect(route).not.toBeNull();
  if (!route) return;
  expect(route.vertices.length).toBe(edges.length + 1);
  expect(new Set(route.edges).size).toBe(edges.length);
  expect([...route.edges].sort((a, b) => a - b)).toEqual(edges.map(e => e.id).sort((a, b) => a - b));
  route.edges.forEach((id, i) => {
    const edge = edges.find(e => e.id === id)!;
    const a = route.vertices[i], b = route.vertices[i + 1];
    expect((edge.a === a && edge.b === b) || (edge.a === b && edge.b === a)).toBe(true);
  });
}

describe('Recorridos eulerianos de multigrafos', () => {
  it('descarta los siete puentes originales por sus cuatro grados impares', () => {
    const analysis = analyzeBridges(KONIGSBERG_BRIDGES);
    expect(analysis.degrees).toEqual([5, 3, 3, 3]);
    expect(analysis.connected).toBe(true);
    expect(analysis.kind).toBe('impossible');
    expect(eulerianRoute(KONIGSBERG_BRIDGES)).toBeNull();
  });
  it('encuentra un recorrido abierto al retirar cualquiera de los siete puentes', () => {
    KONIGSBERG_BRIDGES.forEach(removed => {
      const edges = KONIGSBERG_BRIDGES.filter(e => e.id !== removed.id);
      const analysis = analyzeBridges(edges);
      expect(analysis.kind).toBe('open');
      verifyRoute(edges);
      const route = eulerianRoute(edges)!;
      expect([route.vertices[0], route.vertices[route.vertices.length - 1]].sort()).toEqual(analysis.odd);
      expect(eulerianRoute(edges, removed.a)).toBeNull();
    });
  });
  it('construye un circuito al emparejar los cuatro vértices impares con dos puentes', () => {
    const edges = [...KONIGSBERG_BRIDGES, { id: 8, a: 0, b: 1 }, { id: 9, a: 2, b: 3 }];
    expect(analyzeBridges(edges).kind).toBe('circuit');
    verifyRoute(edges);
    const route = eulerianRoute(edges)!;
    expect(route.vertices[0]).toBe(route.vertices[route.vertices.length - 1]);
  });
  it('rechaza componentes separadas aunque todos los grados sean pares', () => {
    const edges = [{ id: 1, a: 0, b: 1 }, { id: 2, a: 0, b: 1 }, { id: 3, a: 2, b: 3 }, { id: 4, a: 2, b: 3 }];
    expect(analyzeBridges(edges).odd).toEqual([]);
    expect(analyzeBridges(edges).connected).toBe(false);
    expect(eulerianRoute(edges)).toBeNull();
  });
  it('ignora vértices aislados y trata los puentes paralelos como aristas diferentes', () => {
    const edges = KONIGSBERG_BRIDGES.slice(0, 2);
    expect(analyzeBridges(edges).kind).toBe('circuit');
    verifyRoute(edges);
    expect(eulerianRoute(edges, 3)).toBeNull();
    expect(analyzeBridges([]).kind).toBe('empty');
    expect(eulerianRoute([])).toBeNull();
  });
  it('produce rutas continuas sin omitir ni repetir aristas para todos los subgrafos posibles', () => {
    for (let mask = 1; mask < 128; mask++) {
      const edges = KONIGSBERG_BRIDGES.filter((_, i) => mask & (1 << i));
      if (analyzeBridges(edges).kind === 'impossible') expect(eulerianRoute(edges)).toBeNull();
      else verifyRoute(edges);
    }
  });
});
