import { hasSpatialVolume, project4D, rotate4D, sliceTesseract, TESSERACT_CELLS, TESSERACT_EDGES, TESSERACT_FACES, TESSERACT_VERTICES } from './tesseract';

describe('Geometría del teseracto', () => {
  it('tiene 16 vértices, 32 aristas, 24 caras y 8 celdas con las incidencias correctas', () => {
    expect(TESSERACT_VERTICES.length).toBe(16);
    expect(TESSERACT_EDGES.length).toBe(32);
    expect(TESSERACT_FACES.length).toBe(24);
    expect(TESSERACT_CELLS.length).toBe(8);
    TESSERACT_VERTICES.forEach((_, i) => expect(TESSERACT_EDGES.filter(e => e.includes(i)).length).toBe(4));
    TESSERACT_CELLS.forEach(cell => {
      expect(cell.vertices.length).toBe(8);
      expect(TESSERACT_EDGES.filter(e => e.every(v => cell.vertices.includes(v))).length).toBe(12);
      expect(TESSERACT_FACES.filter(f => f.every(v => cell.vertices.includes(v))).length).toBe(6);
    });
    TESSERACT_FACES.forEach(f => expect(TESSERACT_CELLS.filter(c => f.every(v => c.vertices.includes(v))).length).toBe(2));
  });

  it('conserva radios y longitudes de las aristas con una composición general de rotaciones', () => {
    const rotated = TESSERACT_VERTICES.map(v => rotate4D(v, [0.5, 1.2, 0.9, 2.1, 0.8, 3]));
    rotated.forEach(v => expect(Math.hypot(...v)).toBeCloseTo(2, 12));
    TESSERACT_EDGES.forEach(([a, b]) => expect(Math.hypot(...rotated[a].map((x, i) => x - rotated[b][i]))).toBeCloseTo(2, 12));
  });

  it('proyecta las dos celdas w con la escala esperada y evita una cámara dentro del radio del objeto', () => {
    expect(project4D([1, 1, 1, 1])).toEqual([4 / 3, 4 / 3, 4 / 3]);
    expect(project4D([1, 1, 1, -1])).toEqual([0.8, 0.8, 0.8]);
    expect(project4D([1, -1, 1, 1], 4, false)).toEqual([1, -1, 1]);
    expect(() => project4D([1, 1, 1, 1], 2)).toThrowError(RangeError);
  });

  it('obtiene cubos interiores y de frontera sin duplicados, y detecta el corte vacío', () => {
    [-1, -0.4, 0, 0.8, 1].forEach(w => {
      const points = sliceTesseract(TESSERACT_VERTICES, w);
      expect(points.length).toBe(8);
      expect(hasSpatialVolume(points)).toBe(true);
    });
    expect(sliceTesseract(TESSERACT_VERTICES, 1.01)).toEqual([]);
  });

  it('obtiene la sección octaédrica central perpendicular a una diagonal principal', () => {
    // Last row of this rotation is (1/2, 1/2, 1/2, 1/2).
    const rotated = TESSERACT_VERTICES.map(v => rotate4D(v, [0, 0, Math.PI / 4, 0, Math.atan(1 / Math.sqrt(2)), Math.PI / 6]));
    const points = sliceTesseract(rotated, 0);
    expect(points.length).toBe(6);
    expect(hasSpatialVolume(points)).toBe(true);
    points.forEach(p => expect(Math.hypot(...p)).toBeCloseTo(2, 10));
  });

  it('distingue intersecciones degeneradas de sólidos tridimensionales', () => {
    expect(hasSpatialVolume([])).toBe(false);
    expect(hasSpatialVolume([[0, 0, 0], [1, 0, 0], [1, 1, 0], [0, 1, 0]])).toBe(false);
    expect(hasSpatialVolume([[0, 0, 0], [1, 0, 0], [0, 1, 0], [0, 0, 1]])).toBe(true);
  });
});
