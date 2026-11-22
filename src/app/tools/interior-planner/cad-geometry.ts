import { FurnitureDefinition, FurnitureInstance, Point, Room, Fixture } from './cad-model';
export const EPS = 1e-6;
export const distance = (a: Point, b: Point): number => Math.hypot(a.x - b.x, a.y - b.y);
export const cross = (a: Point, b: Point, c: Point): number => (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
export function onSegment(p: Point, a: Point, b: Point): boolean {
    return Math.abs(cross(a, b, p)) <= EPS * Math.max(1, distance(a, b)) && p.x >= Math.min(a.x, b.x) - EPS && p.x <= Math.max(a.x, b.x) + EPS && p.y >= Math.min(a.y, b.y) - EPS && p.y <= Math.max(a.y, b.y) + EPS;
}
export function intersects(a: Point, b: Point, c: Point, d: Point): boolean {
    const x = cross(a, b, c), y = cross(a, b, d), z = cross(c, d, a), w = cross(c, d, b);
    return ((x > EPS && y < -EPS) || (x < -EPS && y > EPS)) && ((z > EPS && w < -EPS) || (z < -EPS && w > EPS)) || onSegment(c, a, b) || onSegment(d, a, b) || onSegment(a, c, d) || onSegment(b, c, d);
}
export const signedArea = (p: Point[]): number => p.reduce((s, a, i) => { const b = p[(i + 1) % p.length]; return s + a.x * b.y - b.x * a.y; }, 0) / 2;
export const area = (p: Point[]): number => Math.abs(signedArea(p));
export const perimeter = (p: Point[]): number => p.reduce((s, a, i) => s + distance(a, p[(i + 1) % p.length]), 0);
export function centroid(p: Point[]): Point {
    const s = 6 * signedArea(p);
    return p.reduce((out, a, i) => { const b = p[(i + 1) % p.length], k = a.x * b.y - b.x * a.y; return { x: out.x + (a.x + b.x) * k / s, y: out.y + (a.y + b.y) * k / s }; }, { x: 0, y: 0 });
}
export function validatePolygon(p: Point[]): void {
    if (p.length < 3 || p.length > 200 || p.some(a => !Number.isFinite(a.x) || !Number.isFinite(a.y) || Math.abs(a.x) > 1e7 || Math.abs(a.y) > 1e7))
        throw Error('El contorno necesita entre 3 y 200 vértices con coordenadas válidas.');
    for (let i = 0; i < p.length; i++) {
        if (distance(p[i], p[(i + 1) % p.length]) < .1)
            throw Error('Hay vértices coincidentes o una pared menor de 0,1 mm.');
        for (let j = i + 1; j < p.length; j++)
            if (j !== i + 1 && !(i === 0 && j === p.length - 1) && intersects(p[i], p[(i + 1) % p.length], p[j], p[(j + 1) % p.length]))
                throw Error('El contorno se cruza o contiene segmentos duplicados.');
        const prev = p[(i + p.length - 1) % p.length], next = p[(i + 1) % p.length];
        if (Math.abs(cross(prev, p[i], next)) < EPS && ((prev.x - p[i].x) * (next.x - p[i].x) + (prev.y - p[i].y) * (next.y - p[i].y)) > 0)
            throw Error('Una pared retrocede sobre el segmento anterior.');
    }
    if (area(p) < 1)
        throw Error('El contorno tiene superficie nula.');
}
export function inside(p: Point, poly: Point[]): boolean {
    let yes = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
        const a = poly[j], b = poly[i];
        if (onSegment(p, a, b))
            return true;
        if ((a.y > p.y) !== (b.y > p.y) && p.x < (b.x - a.x) * (p.y - a.y) / (b.y - a.y) + a.x)
            yes = !yes;
    }
    return yes;
}
export function transform(p: Point, origin: Point, degrees: number): Point {
    const t = degrees * Math.PI / 180;
    return { x: origin.x + p.x * Math.cos(t) - p.y * Math.sin(t), y: origin.y + p.x * Math.sin(t) + p.y * Math.cos(t) };
}
export function outline(d: FurnitureDefinition): Point[] {
    const w = d.width, h = d.depth;
    let p: Point[];
    if (d.shape === 'polygon')
        p = d.points.map(q => ({ x: q.x * w, y: q.y * h }));
    else if (d.shape === 'ellipse')
        p = Array.from({ length: 96 }, (_, i) => ({ x: w / 2 + w / 2 * Math.cos(i * Math.PI / 48), y: h / 2 + h / 2 * Math.sin(i * Math.PI / 48) }));
    else if (d.shape === 'l-shape' || d.shape === 'chaise')
        p = [{ x: 0, y: 0 }, { x: w, y: 0 }, { x: w, y: h }, { x: w - d.armWidth, y: h }, { x: w - d.armWidth, y: d.bodyDepth }, { x: 0, y: d.bodyDepth }];
    else
        p = [{ x: 0, y: 0 }, { x: w, y: 0 }, { x: w, y: h }, { x: 0, y: h }];
    return d.mirrored ? p.map(q => ({ x: w - q.x, y: q.y })).reverse() : p;
}
/** Exact circular fillets in SVG, with radius clamped to half each neighbouring edge. */
export function furniturePath(d: FurnitureDefinition): string {
    if (d.shape === 'ellipse')
        return `M 0 ${d.depth / 2} A ${d.width / 2} ${d.depth / 2} 0 1 0 ${d.width} ${d.depth / 2} A ${d.width / 2} ${d.depth / 2} 0 1 0 0 ${d.depth / 2} Z`;
    const p = outline(d);
    if (!d.radius)
        return polygonPath(p);
    const parts = p.map((v, i) => {
        const a = p[(i + p.length - 1) % p.length], b = p[(i + 1) % p.length], la = distance(v, a), lb = distance(v, b);
        const ux = (a.x - v.x) / la, uy = (a.y - v.y) / la, vx = (b.x - v.x) / lb, vy = (b.y - v.y) / lb;
        const angle = Math.acos(Math.max(-1, Math.min(1, ux * vx + uy * vy))), tan = Math.tan(angle / 2);
        if (!Number.isFinite(tan) || tan < EPS || Math.abs(angle - Math.PI) < EPS)
            return { start: v, end: v, r: 0, sweep: 0 };
        const length = Math.min(d.radius / tan, la / 2, lb / 2), r = length * tan;
        return { start: { x: v.x + ux * length, y: v.y + uy * length }, end: { x: v.x + vx * length, y: v.y + vy * length }, r, sweep: cross(a, v, b) > 0 ? 1 : 0 };
    });
    return parts.map((s, i) => `${i ? 'L' : 'M'} ${s.start.x} ${s.start.y} ${s.r ? `A ${s.r} ${s.r} 0 0 ${s.sweep} ${s.end.x} ${s.end.y}` : ''}`).join(' ') + ' Z';
}
export const polygonPath = (p: Point[]): string => p.map((q, i) => `${i ? 'L' : 'M'} ${q.x} ${q.y}`).join(' ') + ' Z';
export const worldOutline = (d: FurnitureDefinition, i: FurnitureInstance): Point[] => outline(d).map(p => transform(p, i, i.rotation));
export function overlaps(a: Point[], b: Point[]): boolean {
    return a.some(p => inside(p, b)) || b.some(p => inside(p, a)) || a.some((p, i) => b.some((q, j) => intersects(p, a[(i + 1) % a.length], q, b[(j + 1) % b.length])));
}
/** Includes edge midpoints/intersections, so concave boundaries cannot be crossed unnoticed. */
export function contained(shape: Point[], room: Point[]): boolean {
    return shape.every((p, i) => {
        const q = shape[(i + 1) % shape.length], ts = [0, 1];
        for (let j = 0; j < room.length; j++) {
            const a = room[j], b = room[(j + 1) % room.length], den = (q.x - p.x) * (b.y - a.y) - (q.y - p.y) * (b.x - a.x);
            if (Math.abs(den) > EPS) {
                const t = ((a.x - p.x) * (b.y - a.y) - (a.y - p.y) * (b.x - a.x)) / den, u = ((a.x - p.x) * (q.y - p.y) - (a.y - p.y) * (q.x - p.x)) / den;
                if (t > 0 && t < 1 && u >= 0 && u <= 1)
                    ts.push(t);
            }
        }
        ts.sort((a, b) => a - b);
        return inside(p, room) && ts.slice(1).every((t, j) => inside({ x: p.x + (q.x - p.x) * (t + ts[j]) / 2, y: p.y + (q.y - p.y) * (t + ts[j]) / 2 }, room));
    });
}
export function wallLength(r: Room, index: number): number { return distance(r.vertices[index], r.vertices[(index + 1) % r.vertices.length]); }
export function fixtureOffset(f: Fixture, length: number): number {
    return f.anchor === 'right' ? length - f.offset - f.width : f.anchor === 'center' ? (length - f.width) / 2 + f.offset : f.anchor === 'proportional' ? f.offset * length : f.offset;
}
export function fixturePlan(f: Fixture, r: Room): {
    point: Point;
    angle: number;
    offset: number;
} {
    const i = r.walls.findIndex(w => w.id === f.wallId), a = r.vertices[i], b = r.vertices[(i + 1) % r.vertices.length], length = distance(a, b), offset = fixtureOffset(f, length);
    return { point: { x: a.x + (b.x - a.x) * offset / length, y: a.y + (b.y - a.y) * offset / length }, angle: Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI, offset };
}
export function snap(p: Point, vertices: Point[], grid: number, tolerance: number): Point {
    const nearest = vertices.find(v => distance(p, v) < tolerance);
    if (nearest)
        return { ...nearest };
    return { x: Math.round(p.x / grid) * grid, y: Math.round(p.y / grid) * grid };
}
/** Directed edit: preserve the start vertex, place the endpoint, validate the whole contour atomically. */
export function setWall(r: Room, index: number, length: number, angle: number): void {
    if (r.walls[index].locked)
        throw Error('La pared está bloqueada.');
    if (r.walls[(index + 1) % r.walls.length].locked)
        throw Error('La pared siguiente está bloqueada: no se puede desplazar su vértice inicial.');
    if (!Number.isFinite(length) || length < .1 || !Number.isFinite(angle))
        throw Error('Longitud o ángulo inválidos.');
    const p = r.vertices[index], next = (index + 1) % r.vertices.length, t = angle * Math.PI / 180;
    const candidate = r.vertices.map(v => ({ ...v }));
    candidate[next] = { x: p.x + length * Math.cos(t), y: p.y + length * Math.sin(t) };
    validatePolygon(candidate);
    r.vertices = candidate;
}
