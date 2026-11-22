/** All persistent geometry is in millimetres; viewport and selection never enter this model. */
export interface Point {
    x: number;
    y: number;
}
export type Unit = 'mm' | 'cm' | 'm' | 'in';
export const UNIT_MM: Record<Unit, number> = { mm: 1, cm: 10, m: 1000, in: 25.4 };
export interface Wall {
    id: string;
    name: string;
    thickness: number;
    height: number;
    endHeight: number;
    color: string;
    locked: boolean;
}
export interface Room {
    id: string;
    name: string;
    vertices: Point[];
    walls: Wall[];
}
export type Shape = 'rectangle' | 'ellipse' | 'l-shape' | 'chaise' | 'polygon';
export interface FurnitureDefinition {
    id: string;
    name: string;
    category: string;
    shape: Shape;
    width: number;
    depth: number;
    height: number;
    armWidth: number;
    bodyDepth: number;
    radius: number;
    mirrored: boolean;
    color: string;
    points: Point[];
}
export interface FurnitureInstance {
    id: string;
    definitionId: string;
    roomId: string;
    x: number;
    y: number;
    rotation: number;
    locked: boolean;
    hidden: boolean;
}
export type FixtureKind = 'door' | 'window' | 'socket' | 'double-socket' | 'switch' | 'rj45' | 'water' | 'drain' | 'light' | 'radiator' | 'generic';
export interface Fixture {
    doorSwing?: 'inward' | 'outward';
    doorHinge?: 'start' | 'end';
    id: string;
    roomId: string;
    wallId: string;
    kind: FixtureKind;
    name: string;
    offset: number;
    z: number;
    width: number;
    height: number;
    anchor: 'left' | 'right' | 'center' | 'proportional';
    color: string;
}
export interface Annotation {
    id: string;
    roomId: string;
    x: number;
    y: number;
    text: string;
}
export interface CadDocument {
    schemaVersion: 1;
    id: string;
    name: string;
    updated: string;
    unit: Unit;
    precision: number;
    rooms: Room[];
    definitions: FurnitureDefinition[];
    instances: FurnitureInstance[];
    fixtures: Fixture[];
    annotations: Annotation[];
}
export const uid = (): string => crypto.randomUUID();
export const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;
export function makeRoom(name = 'Habitación', width = 3270, depth = 2660): Room {
    return { id: uid(), name, vertices: [{ x: 0, y: 0 }, { x: width, y: 0 }, { x: width, y: depth }, { x: 0, y: depth }],
        walls: Array.from({ length: 4 }, (_, i) => makeWall(i)) };
}
export function makeWall(i: number): Wall {
    return { id: uid(), name: `Pared ${i + 1}`, thickness: 120, height: 2500, endHeight: 2500, color: '#43566b', locked: false };
}
export function definition(name: string, shape: Shape, width: number, depth: number, height = 750): FurnitureDefinition {
    return { id: uid(), name, category: 'Mobiliario', shape, width, depth, height,
        armWidth: Math.min(900, width / 3), bodyDepth: Math.min(950, depth * .6), radius: 80,
        mirrored: false, color: '#62b9ac', points: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: .8, y: 1 }, { x: 0, y: 1 }] };
}
export function newDocument(): CadDocument {
    return { schemaVersion: 1, id: uid(), name: 'Mi proyecto de interiores', updated: new Date().toISOString(), unit: 'cm', precision: 1,
        rooms: [makeRoom()], definitions: [definition('Escritorio', 'rectangle', 1200, 600), definition('Bicicleta estática', 'ellipse', 1100, 550, 1300),
            definition('Escritorio en L', 'l-shape', 1600, 1400), definition('Sofá chaise longue', 'chaise', 2800, 1600, 850),
            definition('Mesa ovalada', 'ellipse', 1600, 900), definition('Armario', 'rectangle', 1800, 600, 2200),
            definition('Cama', 'rectangle', 1500, 2000, 600), definition('Silla', 'rectangle', 450, 450, 850)],
        instances: [], fixtures: [], annotations: [] };
}
