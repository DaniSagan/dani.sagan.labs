import { CadDocument, clone, FurnitureDefinition, Room, UNIT_MM } from './cad-model';
import { validatePolygon, outline } from './cad-geometry';
function assert(ok: unknown, message: string): asserts ok { if (!ok)
    throw Error(message); }
function record(v: unknown): Record<string, unknown> { assert(v && typeof v === 'object' && !Array.isArray(v), 'Objeto JSON inválido.'); return v as Record<string, unknown>; }
function text(v: unknown, max = 120): void { assert(typeof v === 'string' && v.length <= max, 'Texto inválido o demasiado largo.'); }
function number(v: unknown, min = -1e7, max = 1e7): void { assert(typeof v === 'number' && Number.isFinite(v) && v >= min && v <= max, 'Dimensión fuera de límites.'); }
function bool(v: unknown): void { assert(typeof v === 'boolean', 'Estado booleano inválido.'); }
function color(v: unknown): void { assert(typeof v === 'string' && /^#[a-f0-9]{6}$/i.test(v), 'Color inválido.'); }
function list(v: unknown, max = 1000): unknown[] { assert(Array.isArray(v) && v.length <= max, 'Lista inválida o límite de elementos superado.'); return v; }
function point(v: unknown): void { const p = record(v); number(p['x']); number(p['y']); }
function one(v: unknown, allowed: readonly unknown[]): void { assert(allowed.includes(v), 'Opción desconocida.'); }
export function validateDefinition(value: unknown): asserts value is FurnitureDefinition {
    const d = record(value);
    text(d['id']);
    text(d['name']);
    text(d['category']);
    color(d['color']);
    bool(d['mirrored']);
    assert(typeof d['id'] === 'string' && /^[a-zA-Z0-9-]{1,120}$/.test(d['id']), 'Identificador de mueble inválido.');
    one(d['shape'], ['rectangle', 'ellipse', 'l-shape', 'chaise', 'polygon']);
    for (const k of ['width', 'depth', 'height', 'armWidth', 'bodyDepth'])
        number(d[k], .1, 1e6);
    number(d['radius'], 0, 1e5);
    list(d['points'], 200).forEach(point);
    const typed = value as FurnitureDefinition;
    if (typed.shape === 'l-shape' || typed.shape === 'chaise') {
        assert(typed.armWidth < typed.width, `El ancho del brazo (${typed.armWidth} mm) debe ser menor que la anchura total (${typed.width} mm).`);
        assert(typed.bodyDepth < typed.depth, `El fondo del cuerpo (${typed.bodyDepth} mm) debe ser menor que el fondo total (${typed.depth} mm).`);
    }
    if (typed.shape === 'polygon') {
        assert(typed.points.every(p => p.x >= 0 && p.x <= 1 && p.y >= 0 && p.y <= 1), 'Los vértices del mueble deben estar entre 0 y 1.');
        validatePolygon(outline(typed));
    }
}
/** Version dispatcher: no historical CAD format exists yet. Future migrations belong here. */
export function parseDocument(input: unknown): CadDocument {
    const v = record(input);
    assert(v['schemaVersion'] === 1, 'Versión CAD no compatible. Se admite la versión 1.');
    text(v['id']);
    text(v['name']);
    text(v['updated']);
    assert(typeof v['updated'] === 'string' && Number.isFinite(Date.parse(v['updated'])), 'Fecha de actualización inválida.');
    one(v['unit'], Object.keys(UNIT_MM));
    number(v['precision'], 0, 4);
    assert(Number.isInteger(v['precision']), 'Precisión inválida.');
    const ids = new Set<string>();
    const id = (x: Record<string, unknown>) => { const s = x['id']; assert(typeof s === 'string' && /^[a-zA-Z0-9-]{1,120}$/.test(s) && !ids.has(s), 'Identificador vacío, repetido o inválido.'); ids.add(s); };
    id(v);
    const rooms = list(v['rooms'], 100);
    assert(rooms.length > 0, 'El proyecto necesita una habitación.');
    const roomIds = new Set<string>(), walls = new Map<string, Set<string>>();
    for (const value of rooms) {
        const r = record(value);
        id(r);
        text(r['name']);
        roomIds.add(r['id'] as string);
        const vertices = list(r['vertices'], 200);
        vertices.forEach(point);
        validatePolygon(vertices as Room['vertices']);
        const ws = list(r['walls'], 200);
        assert(ws.length === vertices.length, 'Cada segmento debe tener una pared.');
        const refs = new Set<string>();
        for (const value of ws) {
            const w = record(value);
            id(w);
            refs.add(w['id'] as string);
            text(w['name']);
            number(w['thickness'], 1, 2000);
            number(w['height'], 1, 1e6);
            number(w['endHeight'], 1, 1e6);
            color(w['color']);
            bool(w['locked']);
        }
        walls.set(r['id'] as string, refs);
    }
    const definitions = list(v['definitions'], 1000), definitionIds = new Set<string>();
    for (const value of definitions) {
        validateDefinition(value);
        id(record(value));
        definitionIds.add(value.id);
    }
    for (const value of list(v['instances'], 3000)) {
        const i = record(value);
        id(i);
        assert(roomIds.has(i['roomId'] as string) && definitionIds.has(i['definitionId'] as string), 'El mueble referencia una habitación o definición inexistente.');
        number(i['x']);
        number(i['y']);
        number(i['rotation'], -36000, 36000);
        bool(i['locked']);
        bool(i['hidden']);
    }
    for (const value of list(v['fixtures'], 3000)) {
        const f = record(value);
        id(f);
        assert(walls.get(f['roomId'] as string)?.has(f['wallId'] as string), 'El elemento referencia una pared inexistente.');
        one(f['kind'], ['door', 'window', 'socket', 'double-socket', 'switch', 'rj45', 'water', 'drain', 'light', 'radiator', 'generic']);
        one(f['anchor'], ['left', 'right', 'center', 'proportional']);
        if (f['doorSwing'] !== undefined) one(f['doorSwing'], ['inward', 'outward']);
        if (f['doorHinge'] !== undefined) one(f['doorHinge'], ['start', 'end']);
        text(f['name']);
        number(f['offset']);
        number(f['z'], 0, 1e6);
        number(f['width'], .1, 1e6);
        number(f['height'], .1, 1e6);
        color(f['color']);
    }
    for (const value of list(v['annotations'], 1000)) {
        const a = record(value);
        id(a);
        assert(roomIds.has(a['roomId'] as string), 'La nota referencia una habitación inexistente.');
        point(a);
        text(a['text'], 2000);
    }
    return clone(input as CadDocument);
}
export class DocumentHistory {
    private past: CadDocument[] = [];
    private future: CadDocument[] = [];
    get canUndo(): boolean { return this.past.length > 0; }
    get canRedo(): boolean { return this.future.length > 0; }
    commit(before: CadDocument): void { this.past.push(clone(before)); if (this.past.length > 80)
        this.past.shift(); this.future = []; }
    undo(current: CadDocument): CadDocument { const previous = this.past.pop(); if (!previous)
        return current; this.future.push(clone(current)); return previous; }
    redo(current: CadDocument): CadDocument { const next = this.future.pop(); if (!next)
        return current; this.past.push(clone(current)); return next; }
    reset(): void { this.past = []; this.future = []; }
}
