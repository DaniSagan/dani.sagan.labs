import { CUBE_EDGES, planeCubeSection, lineCubeSegment } from './spatial-geometry';

describe('Reference cube geometry',()=>{
  it('has twelve edges and yields a hexagon for a central diagonal plane',()=>{
    expect(CUBE_EDGES.length).toBe(12);const polygon=planeCubeSection([1,1,1],0,2);expect(polygon.length).toBe(6);
    for(const p of polygon){expect(p.every(x=>Math.abs(x)<=2)).toBeTrue();expect(p.reduce((s,x)=>s+x,0)).toBeCloseTo(0,10);}
  });
  it('handles coincident faces, tangent edges, tangent vertices and disjoint planes',()=>{
    expect(planeCubeSection([1,0,0],2,2).length).toBe(4);expect(planeCubeSection([1,1,0],4,2).length).toBe(2);
    expect(planeCubeSection([1,1,1],6,2)).toEqual([[2,2,2]]);expect(planeCubeSection([1,0,0],3,2)).toEqual([]);
    expect(planeCubeSection([0,0,0],0,2)).toEqual([]);
  });
  it('clips solution lines against the cube, including a parallel line outside it',()=>{
    expect(lineCubeSegment([0,1,0],[1,0,0],2)).toEqual([[-2,1,0],[2,1,0]]);
    expect(lineCubeSegment([0,3,0],[1,0,0],2)).toEqual([]);
    const segment=lineCubeSegment([100,100,100],[1,1,1],2);expect(segment).toEqual([[-2,-2,-2],[2,2,2]]);
  });
});
