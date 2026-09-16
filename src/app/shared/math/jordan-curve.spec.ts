import { classifyJordanPoint, jordanPolygon, segmentDistance } from './jordan-curve';

describe('Clasificación de puntos respecto de curvas poligonales', () => {
  const square=[{x:0,y:0},{x:10,y:0},{x:10,y:10},{x:0,y:10}];
  it('distingue interior, exterior y frontera, incluidos vértices y segmentos horizontales',()=>{
    expect(classifyJordanPoint({x:5,y:5},square).location).toBe('inside');
    expect(classifyJordanPoint({x:15,y:5},square).location).toBe('outside');
    expect(classifyJordanPoint({x:-5,y:5},square).crossings.length).toBe(2);
    expect(classifyJordanPoint({x:5,y:0},square).location).toBe('boundary');
    expect(classifyJordanPoint({x:0,y:0},square).location).toBe('boundary');
  });
  it('conserva la paridad cuando el rayo pasa por un vértice o toca una tangencia',()=>{
    const diamond=[{x:0,y:5},{x:5,y:0},{x:10,y:5},{x:5,y:10}];
    expect(classifyJordanPoint({x:5,y:5},diamond).crossings.length).toBe(1);
    expect(classifyJordanPoint({x:-5,y:0},diamond).location).toBe('outside');
    expect(classifyJordanPoint({x:-5,y:10},diamond).location).toBe('outside');
    expect(classifyJordanPoint({x:5,y:5},[...diamond].reverse()).location).toBe('inside');
  });
  it('reconoce como exterior una bahía que penetra en la silueta',()=>{
    const bay=jordanPolygon('bay');
    expect(classifyJordanPoint({x:370,y:240},bay).location).toBe('outside');
    expect(classifyJordanPoint({x:180,y:240},bay).location).toBe('inside');
  });
  it('mantiene el centro dentro de las curvas radiales en todo el rango de deformación',()=>{
    for(let i=0;i<=80;i++) {
      const polygon=jordanPolygon('flower',i/100);
      expect(classifyJordanPoint({x:370,y:240},polygon).location).toBe('inside');
      expect(classifyJordanPoint({x:20,y:240},polygon).location).toBe('outside');
    }
  });
  it('aplica explícitamente la tolerancia y trata segmentos degenerados',()=>{
    expect(classifyJordanPoint({x:5,y:0.4},square,0.8).location).toBe('boundary');
    expect(classifyJordanPoint({x:5,y:0.4},square,0.01).location).toBe('inside');
    expect(segmentDistance({x:3,y:4},{x:0,y:0},{x:0,y:0})).toBe(5);
  });
});
