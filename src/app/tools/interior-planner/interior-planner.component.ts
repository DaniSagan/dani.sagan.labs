import { isOpening, openingSymbol, openingThickness, validateOpening, windowElevation } from './cad-openings';
import { interiorWallFrame, interiorWallLength, interiorFixturePlan, setInteriorWall, moveInteriorVertex, wallDrawing } from './cad-walls';
import { AfterViewInit, Component, ElementRef, HostListener, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { visibleViewport } from './cad-viewport';
import { gridResolution } from './cad-grid';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CadDocument, FurnitureDefinition, FurnitureInstance, Fixture, FixtureKind, Point, Room, Unit, UNIT_MM, clone, definition, makeRoom, makeWall, newDocument, uid } from './cad-model';
import { area, centroid, contained, distance, fixtureOffset, furniturePath, overlaps, perimeter, polygonPath, snap, validatePolygon, worldOutline } from './cad-geometry';
import { DocumentHistory, parseDocument, validateDefinition } from './cad-document';
import { CadStorage } from './cad-storage';
import { Bounds, bounds, download, escapeXml, exportPng, exportSvg } from './cad-export';
@Component({ selector: 'app-interior-planner', standalone: true, imports: [CommonModule, FormsModule], templateUrl: './interior-planner.component.html', styleUrls: ['./interior-planner.component.css', './cad-layout.css'] })
export class InteriorPlannerComponent implements OnInit, AfterViewInit, OnDestroy {
    constructor(private readonly zone: NgZone) {}
    private viewportObserver?: ResizeObserver;
    private viewportSize = { width: 700, height: 570 };
    @ViewChild('drawing')
    drawing?: ElementRef<SVGSVGElement>;
    doc = newDocument();
    roomId = this.doc.rooms[0].id;
    wallIndex = 0;
    view: 'plan' | 'elevation' = 'plan';
    projects: CadDocument[] = [];
    personal: FurnitureDefinition[] = [];
    readonly storage = new CadStorage();
    readonly history = new DocumentHistory();
    status = 'Cargando biblioteca local…';
    message = '';
    ready = false;
    dimensions = true;
    gridVisible = true;
    snapping = true;
    grid = 100;
    expanded = false;
    box: Bounds = { x: -500, y: -500, width: 4500, height: 3700 };
    tool: 'select' | 'pan' | 'draw' | 'measure' = 'select';
    selectedId = '';
    selectedFixtureId = '';
    fixtureEdit?: Fixture;
    selectedVertex = -1;
    vertexEdit: Point = { x: 0, y: 0 };
    private vertexEditTimer?: ReturnType<typeof setTimeout>;
    private vertexInputValid = { x: true, y: true };
    points: Point[] = [];
    measure: Point[] = [];
    cursor: Point = { x: 0, y: 0 };
    roomWidth = 327;
    roomDepth = 266;
    roomName = 'Habitación';
    coordinateText = '';
    search = '';
    fixtureKind: FixtureKind = 'socket';
    furnitureDraft = definition('Mi mueble', 'l-shape', 1600, 1400);
    polygonText = '0,0; 1,0; 1,0.4; 0.4,0.4; 0.4,1; 0,1';
    fixtureDraft = { offset: 45, z: 30, width: 8, height: 8, anchor: 'left' as Fixture['anchor'] };
    wallDraft = { length: 0, angle: 0, thickness: 12, height: 250, endHeight: 250 };
    pngWidth = 2400;
    transparent = false;
    paper = 'A4';
    printScale = 50;
    orientation = 'landscape';
    notes = '';
    private timer?: ReturnType<typeof setTimeout>;
    private revision = 0;
    private saveQueue: Promise<void> = Promise.resolve();
    private destroyed = false;
    private drag?: {
        kind: 'object' | 'vertex' | 'fixture' | 'pan';
        start: Point;
        before: CadDocument;
        origin: Point;
        box: Bounds;
        id: string;
        index: number;
        invalid?: string;
    };
    private copied?: FurnitureInstance;
    get room(): Room { return this.doc.rooms.find(r => r.id === this.roomId) || this.doc.rooms[0]; }
    get wall() { return this.room.walls[this.wallIndex] || this.room.walls[0]; }
    get factor(): number { return UNIT_MM[this.doc.unit]; }
    get instances(): FurnitureInstance[] { return this.doc.instances.filter(i => i.roomId === this.room.id && !i.hidden); }
    get fixtures(): Fixture[] { return this.doc.fixtures.filter(f => f.roomId === this.room.id && (this.view === 'plan' || f.wallId === this.wall.id)); }
    get selected(): FurnitureInstance | undefined { return this.doc.instances.find(i => i.id === this.selectedId); }
    get selectedFixture(): Fixture | undefined { return this.doc.fixtures.find(f => f.id === this.selectedFixtureId); }
    get library(): FurnitureDefinition[] { return this.doc.definitions.filter(d => d.name.toLocaleLowerCase().includes(this.search.toLocaleLowerCase())); }
    get surface(): number { return area(this.room.vertices) / 1e6; }
    get surfaceLabel(): string { return this.surface.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
    get perimeter(): number { return perimeter(this.room.vertices); }
    get center(): Point { return centroid(this.room.vertices); }
    get wallsDrawing() { return wallDrawing(this.room); }
    get roomPath(): string { return polygonPath(this.room.vertices); }
    get elevationPath(): string { const l = interiorWallLength(this.room, this.wallIndex); return `M 0 0 L ${l} 0 L ${l} ${-this.wall.endHeight} L 0 ${-this.wall.height} Z`; }
    get viewBox(): string { return `${this.box.x} ${this.box.y} ${this.box.width} ${this.box.height}`; }
    get visibleBox(): Bounds { return visibleViewport(this.box, this.viewportSize.width, this.viewportSize.height); }
    get fontSize(): number { return 12 / Math.max(.0001, Math.min(this.viewportSize.width / this.box.width, this.viewportSize.height / this.box.height)); }
    get fineGridVisible(): boolean { return gridResolution(this.grid, 12 / this.fontSize, this.gridVisible).fine; }
    get effectiveGrid(): number { return gridResolution(this.grid, 12 / this.fontSize, this.gridVisible).step; }
    get warnings(): string[] {
        const result: string[] = [], shapes = this.instances.map(i => ({ i, d: this.def(i), p: worldOutline(this.def(i), i) }));
        for (let k = 0; k < shapes.length; k++) {
            const a = shapes[k];
            if (!contained(a.p, this.room.vertices))
                result.push(`${a.d.name}: fuera del contorno interior de referencia o atravesando una pared.`);
            for (let j = k + 1; j < shapes.length; j++)
                if (overlaps(a.p, shapes[j].p))
                    result.push(`${a.d.name} y ${shapes[j].d.name}: posible superposición (envolventes sin redondeo).`);
        }
        for (const f of this.doc.fixtures.filter(f => f.roomId === this.room.id)) {
            const index = this.room.walls.findIndex(w => w.id === f.wallId), w = this.room.walls[index], l = interiorWallLength(this.room, index), x = fixtureOffset(f, l), roof = (t: number) => w.height + (w.endHeight - w.height) * t / l;
            if (x < 0 || x + f.width > l || f.z + f.height > Math.min(roof(x), roof(x + f.width)))
                result.push(`${f.name}: excede el contorno del alzado.`);
        }
        return result;
    }
    async ngOnInit(): Promise<void> {
        try {
            this.projects = await this.storage.projects();
            this.personal = await this.storage.library();
            if (this.projects.length)
                this.doc = clone(this.projects[0]);
            this.roomId = this.doc.rooms[0].id;
            this.status = this.projects.length ? 'Proyecto recuperado' : 'Preparado';
        }
        catch (e) {
            this.status = 'Almacenamiento no disponible: exporta JSON para conservar tu trabajo.';
            this.error(e);
        }
        this.ready = true;
        this.fit();
        this.syncWall();
    }
    ngAfterViewInit(): void {
        this.viewportObserver = new ResizeObserver(entries => {
            const size = entries[0]?.contentRect;
            if (this.destroyed || !size || size.width <= 0 || size.height <= 0 ||
                (size.width === this.viewportSize.width && size.height === this.viewportSize.height)) return;
            this.zone.run(() => this.viewportSize = { width: size.width, height: size.height });
        });
        if (this.drawing) this.viewportObserver.observe(this.drawing.nativeElement);
    }
    ngOnDestroy(): void { this.destroyed = true; this.viewportObserver?.disconnect(); if (this.vertexEditTimer) clearTimeout(this.vertexEditTimer); if (this.timer)
        clearTimeout(this.timer); if (this.ready)
        void this.persist(); }
    fmt(n: number): string {
        const converted = n / this.factor;
        const roundedZero = Math.abs(converted) < 0.5 / Math.pow(10, this.doc.precision) ? 0 : converted;
        return roundedZero.toLocaleString('es-ES', { maximumFractionDigits: this.doc.precision }) + ' ' + this.doc.unit;
    }
    pointList(p: Point[]): string { return p.map(q => `${q.x},${q.y}`).join(' '); }
    measuredDistance(): number { return this.measure.length === 2 ? distance(this.measure[0], this.measure[1]) : 0; }
    previewScale(d: FurnitureDefinition): number { return 1500 / Math.max(d.width, d.depth); }
    toggleWallLock(): void { this.change(() => this.wall.locked = !this.wall.locked); }
    setPrecision(value: number): void { this.change(() => this.doc.precision = value); }
    setGrid(value: number): void { if (Number.isFinite(value) && value >= 10 && value <= 10000)
        this.grid = value; }
    value(n: number): number { return +(n / this.factor).toFixed(4); }
    def(i: FurnitureInstance): FurnitureDefinition { return this.doc.definitions.find(d => d.id === i.definitionId)!; }
    path(d: FurnitureDefinition): string { return furniturePath(d); }
    transform(i: FurnitureInstance): string { return `translate(${i.x} ${i.y}) rotate(${i.rotation})`; }
    fixtureTransform(f: Fixture): string { const p = interiorFixturePlan(f, this.room); return `translate(${p.point.x} ${p.point.y}) rotate(${p.angle})`; }
    fx(f: Fixture): number { return fixtureOffset(f, interiorWallLength(this.room, this.wallIndex)); }
    length(index: number): number { return interiorWallLength(this.room, index); }
    end(index: number): Point { return this.room.vertices[(index + 1) % this.room.vertices.length]; }
    error(e: unknown): void { this.message = e instanceof Error ? e.message : String(e); }
    change(action: () => void): void { const before = clone(this.doc); try {
        action();
        parseDocument(this.doc);
        this.history.commit(before);
        this.changed();
        this.message = '';
    }
    catch (e) {
        this.doc = before;
        this.error(e);
    } this.syncWall(); }
    private changed(): void { this.doc.updated = new Date().toISOString(); this.revision++; this.status = 'Cambios pendientes'; if (this.timer)
        clearTimeout(this.timer); this.timer = setTimeout(() => void this.persist(), 600); }
    async persist(): Promise<void> {
        if (this.timer)
            clearTimeout(this.timer);
        const snapshot = clone(this.drag?.before || this.doc), revision = this.revision;
        this.saveQueue = this.saveQueue.then(async () => { if (!this.destroyed && revision === this.revision)
            this.status = 'Guardando…'; try {
            await this.storage.save(snapshot);
            if (!this.destroyed) {
                this.projects = await this.storage.projects();
                if (revision === this.revision)
                    this.status = 'Guardado en este navegador';
            }
        }
        catch (e) {
            if (!this.destroyed) {
                this.status = 'Error de almacenamiento: descarga JSON';
                this.error(e);
            }
        } });
        await this.saveQueue;
    }
    undo(): void { if (this.history.canUndo) {
        this.doc = this.history.undo(this.doc);
        this.afterHistory();
    } }
    redo(): void { if (this.history.canRedo) {
        this.doc = this.history.redo(this.doc);
        this.afterHistory();
    } }
    private afterHistory(): void { if (!this.doc.rooms.some(r => r.id === this.roomId))
        this.roomId = this.doc.rooms[0].id; this.wallIndex = Math.min(this.wallIndex, this.room.walls.length - 1); this.selectedId = ''; this.selectedFixtureId = ''; this.selectedVertex = -1; this.changed(); this.syncWall(); }
    async openProject(id: string): Promise<void> { await this.persist(); const d = this.projects.find(p => p.id === id); if (d) {
        this.doc = clone(d);
        this.resetUi();
        this.status = 'Proyecto abierto';
    } }
    async createProject(): Promise<void> { await this.persist(); this.doc = newDocument(); this.resetUi(); this.changed(); }
    async copyProject(): Promise<void> { await this.persist(); this.doc = clone(this.doc); this.doc.id = uid(); this.doc.name += ' (copia)'; this.history.reset(); this.changed(); }
    async deleteProject(): Promise<void> { if (!confirm('¿Eliminar este proyecto del navegador? Puedes exportar JSON antes.'))
        return; try {
        if (this.timer)
            clearTimeout(this.timer);
        await this.saveQueue;
        await this.storage.remove(this.doc.id);
        this.projects = await this.storage.projects();
        this.doc = this.projects.length ? clone(this.projects[0]) : newDocument();
        this.resetUi();
        this.status = 'Proyecto eliminado';
    }
    catch (e) {
        this.error(e);
    } }
    private resetUi(): void { this.roomId = this.doc.rooms[0].id; this.wallIndex = 0; this.selectedId = ''; this.selectedFixtureId = ''; this.selectedVertex = -1; this.points = []; this.history.reset(); this.fit(); this.syncWall(); }
    switchRoom(id: string): void { this.roomId = id; this.wallIndex = 0; this.selectedId = ''; this.selectedFixtureId = ''; this.selectedVertex = -1; this.fit(); this.syncWall(); }
    deleteRoom(): void {
        if (this.doc.rooms.length <= 1) {
            this.message = 'El proyecto necesita al menos una habitación.';
            return;
        }
        const room = this.room;
        if (!confirm(`¿Eliminar la habitación «${room.name}» y todos sus muebles, elementos y anotaciones? Puedes deshacer esta acción.`))
            return;
        const nextRoom = this.doc.rooms.find(r => r.id !== room.id)!;
        this.change(() => {
            this.doc.rooms = this.doc.rooms.filter(r => r.id !== room.id);
            this.doc.instances = this.doc.instances.filter(i => i.roomId !== room.id);
            this.doc.fixtures = this.doc.fixtures.filter(f => f.roomId !== room.id);
            this.doc.annotations = this.doc.annotations.filter(a => a.roomId !== room.id);
            this.points = [];
            this.tool = 'select';
            this.switchRoom(nextRoom.id);
        });
    }
    setView(view: 'plan' | 'elevation'): void { this.view = view; this.points = []; this.tool = 'select'; this.fit(); }
    chooseWall(index: number): void { this.selectedVertex = -1; this.wallIndex = index; this.selectedId = ''; this.selectedFixtureId = ''; this.syncWall(); if (this.view === 'elevation')
        this.fit(); }
    syncWall(): void { if (!this.wall)
        return; this.wallIndex = Math.min(this.wallIndex, this.room.walls.length - 1); const frame = interiorWallFrame(this.room, this.wallIndex), a = frame.start, b = frame.end; this.wallDraft = { length: this.value(this.length(this.wallIndex)), angle: Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI, thickness: this.value(this.wall.thickness), height: this.value(this.wall.height), endHeight: this.value(this.wall.endHeight) }; }
    setUnit(unit: Unit): void { const old = this.factor; this.change(() => this.doc.unit = unit); const ratio = old / this.factor; this.roomWidth *= ratio; this.roomDepth *= ratio; for (const key of ['z', 'width', 'height'] as const)
        this.fixtureDraft[key] *= ratio; if (this.fixtureDraft.anchor !== 'proportional')
        this.fixtureDraft.offset *= ratio; }
    editName(name: string): void { this.change(() => this.doc.name = name); }
    addRoom(shape: 'rectangle' | 'l' | 'pentagon'): void {
        this.change(() => {
            const w = this.roomWidth * this.factor, h = this.roomDepth * this.factor;
            if (w <= 0 || h <= 0)
                throw Error('Las dimensiones deben ser positivas.');
            const r = makeRoom(this.roomName, w, h);
            if (shape === 'l')
                r.vertices = [{ x: 0, y: 0 }, { x: w, y: 0 }, { x: w, y: h * .5 }, { x: w * .5, y: h * .5 }, { x: w * .5, y: h }, { x: 0, y: h }];
            if (shape === 'pentagon')
                r.vertices = [{ x: 0, y: 0 }, { x: w * .75, y: 0 }, { x: w, y: h * .4 }, { x: w * .7, y: h }, { x: 0, y: h }];
            r.walls = r.vertices.map((_, i) => makeWall(i));
            this.doc.rooms.push(r);
            this.roomId = r.id;
            this.wallIndex = 0;
            this.selectedVertex = -1;
        });
        this.fit();
    }
    startDrawing(): void { this.view = 'plan'; this.tool = 'draw'; this.points = []; this.message = 'Marca vértices en el plano y pulsa Cerrar contorno. Escape cancela.'; }
    finishDrawing(): void { const p = this.points.map(q => ({ ...q })); try {
        validatePolygon(p);
        this.change(() => { const r = makeRoom(this.roomName); r.vertices = p; r.walls = p.map((_, i) => makeWall(i)); this.doc.rooms.push(r); this.roomId = r.id; this.wallIndex = 0; this.selectedVertex = -1; });
        this.points = [];
        this.tool = 'select';
        this.fit();
    }
    catch (e) {
        this.error(e);
    } }
    applyCoordinates(): void { try {
        const p = this.coordinateText.split(';').filter(s => s.trim()).map(s => { const n = s.trim().split(/[\s,]+/).map(Number); if (n.length !== 2)
            throw Error('Usa x,y; x,y; … con punto decimal.'); return { x: n[0] * this.factor, y: n[1] * this.factor }; });
        validatePolygon(p);
        this.change(() => { const r = makeRoom(this.roomName); r.vertices = p; r.walls = p.map((_, i) => makeWall(i)); this.doc.rooms.push(r); this.roomId = r.id; this.wallIndex = 0; this.selectedVertex = -1; });
        this.fit();
    }
    catch (e) {
        this.error(e);
    } }
    applyWall(): void { this.change(() => { if (this.wall.locked)
        throw Error('La pared está bloqueada.'); this.wall.thickness = this.wallDraft.thickness * this.factor; setInteriorWall(this.room, this.wallIndex, this.wallDraft.length * this.factor, this.wallDraft.angle); this.wall.height = this.wallDraft.height * this.factor; this.wall.endHeight = this.wallDraft.endHeight * this.factor; }); }
    midpoint(index: number): Point {
        const f = interiorWallFrame(this.room, index);
        return { x: f.axisStart.x + f.ux * f.length / 2, y: f.axisStart.y + f.uy * f.length / 2 };
    }
    splitWall(index = this.wallIndex): void {
        this.chooseWall(index);
        this.change(() => {
            if (this.wall.locked)
                throw Error('La pared está bloqueada.');
            const a = this.room.vertices[this.wallIndex], b = this.end(this.wallIndex), newWall = clone(this.wall);
            newWall.id = uid();
            newWall.name += ' · tramo';
            const half = this.length(this.wallIndex) / 2, oldHeight = this.wall.endHeight;
            this.wall.endHeight = (this.wall.height + oldHeight) / 2;
            newWall.height = this.wall.endHeight;
            this.room.vertices.splice(this.wallIndex + 1, 0, this.midpoint(this.wallIndex));
            this.room.walls.splice(this.wallIndex + 1, 0, newWall);
            for (const f of this.doc.fixtures.filter(f => f.wallId === this.wall.id)) {
                const x = fixtureOffset(f, half * 2);
                if (x < half && x + f.width > half)
                    throw Error('Un hueco atraviesa el punto de división. Muévelo antes.');
                if (x >= half) {
                    f.wallId = newWall.id;
                    f.offset = x - half;
                }
                else
                    f.offset = x;
                f.anchor = 'left';
            }
        });
    }
    moveVertex(index: number, key: 'x' | 'y', value: number): void {
        this.change(() => { const target = { ...this.wallsDrawing.innerVertices[index] }; target[key] = value * this.factor; moveInteriorVertex(this.room, index, target); });
    }
    selectVertex(index: number): void {
        if (this.vertexEditTimer) clearTimeout(this.vertexEditTimer);
        this.vertexEditTimer = undefined;
        this.vertexInputValid = { x: true, y: true };
        if (index < 0 || index >= this.room.vertices.length) { this.selectedVertex = -1; return; }
        if (this.view !== 'plan') this.setView('plan');
        this.tool = 'select';
        this.selectedId = '';
        this.selectedFixtureId = '';
        this.selectedVertex = index;
        this.vertexEdit = { ...this.wallsDrawing.innerVertices[index] };
    }
    get vertexLocked(): boolean {
        const i = this.selectedVertex, n = this.room.walls.length;
        return i >= 0 && (this.room.walls[i].locked || this.room.walls[(i + n - 1) % n].locked);
    }
    editVertexCoordinate(key: 'x' | 'y', value: number | null): void {
        if (this.vertexEditTimer) clearTimeout(this.vertexEditTimer);
        this.vertexEditTimer = undefined;
        this.vertexInputValid[key] = value !== null && Number.isFinite(value);
        if (!this.vertexInputValid[key]) return;
        this.vertexEdit[key] = value! * this.factor;
        if (!this.vertexInputValid.x || !this.vertexInputValid.y) return;
        const roomId = this.room.id, index = this.selectedVertex;
        this.vertexEditTimer = setTimeout(() => {
            this.vertexEditTimer = undefined;
            if (!this.destroyed && this.room.id === roomId && this.selectedVertex === index) this.applyVertexEdit();
        }, 300);
    }
    applyVertexEdit(): void {
        if (this.vertexEditTimer) clearTimeout(this.vertexEditTimer);
        this.vertexEditTimer = undefined;
        if (!this.vertexInputValid.x || !this.vertexInputValid.y) { this.message = 'Introduce dos coordenadas numéricas válidas.'; return; }
        const index = this.selectedVertex;
        if (index < 0 || index >= this.room.vertices.length) return;
        const point = this.wallsDrawing.innerVertices[index];
        if (distance(point, this.vertexEdit) < 1e-5) { this.message = ''; return; }
        this.change(() => {
            if (this.vertexLocked) throw Error('Hay una pared adyacente bloqueada.');
            moveInteriorVertex(this.room, index, this.vertexEdit);
        });
    }
    revealVertexEditor(): void {
        document.getElementById('cad-vertex-properties')?.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
    addFurniture(id: string, point?: Point): void { this.change(() => { const d = this.doc.definitions.find(d => d.id === id); if (!d)
        throw Error('Mueble inexistente.'); const c = point || this.center; const i: FurnitureInstance = { id: uid(), definitionId: id, roomId: this.room.id, x: c.x - d.width / 2, y: c.y - d.depth / 2, rotation: 0, locked: false, hidden: false }; this.doc.instances.push(i); this.selectFurniture(i.id); }); }
    selectFurniture(id: string): void { this.selectedId = id; this.selectedFixtureId = ''; this.selectedVertex = -1; }
    updateInstance(key: 'x' | 'y' | 'rotation', value: number): void { this.change(() => { if (!this.selected || this.selected.locked)
        throw Error('El mueble está bloqueado.'); this.selected[key] = key === 'rotation' ? value : value * this.factor; }); }
    toggleInstance(key: 'locked' | 'hidden'): void { this.change(() => { if (this.selected)
        this.selected[key] = !this.selected[key]; }); }
    editDefinition(key: 'width' | 'depth' | 'height', value: number): void { this.change(() => { if (!this.selected || this.selected.locked)
        throw Error('El mueble está bloqueado.'); const original = this.def(this.selected), d = clone(original); d.id = uid(); d[key] = value * this.factor; d.armWidth = Math.min(d.armWidth, d.width); d.bodyDepth = Math.min(d.bodyDepth, d.depth); validateDefinition(d); this.doc.definitions.push(d); this.selected.definitionId = d.id; }); }
    recolor(color: string): void { this.change(() => { if (!this.selected || this.selected.locked)
        throw Error('El mueble está bloqueado.'); const d = clone(this.def(this.selected)); d.id = uid(); d.color = color; this.doc.definitions.push(d); this.selected.definitionId = d.id; }); }
    duplicate(): void { const i = this.selected; if (!i)
        return; this.change(() => { const copy = clone(i); copy.id = uid(); copy.x += 100; copy.y += 100; copy.locked = false; this.doc.instances.push(copy); this.selectedId = copy.id; }); }
    removeSelection(): void { this.change(() => { if (this.selected?.locked)
        throw Error('El mueble está bloqueado.'); this.doc.instances = this.doc.instances.filter(i => i.id !== this.selectedId); this.doc.fixtures = this.doc.fixtures.filter(f => f.id !== this.selectedFixtureId); this.selectedId = ''; this.selectedFixtureId = ''; }); }
    alignToWall(): void { this.change(() => { const i = this.selected; if (!i || i.locked)
        throw Error('Selecciona un mueble desbloqueado.'); const frame = interiorWallFrame(this.room, this.wallIndex), a = frame.start, b = frame.end, l = frame.length, t = Math.atan2(b.y - a.y, b.x - a.x), sign = polygonSigned(this.room.vertices) > 0 ? 1 : -1; const gap = 50; i.rotation = t * 180 / Math.PI; i.x = a.x - Math.sin(t) * gap * sign; i.y = a.y + Math.cos(t) * gap * sign; if (sign < 0) {
        i.x += Math.sin(t) * this.def(i).depth;
        i.y -= Math.cos(t) * this.def(i).depth;
    } if (this.def(i).width > l)
        this.message = 'El mueble supera la longitud de la pared.'; }); }
    async saveFurniture(): Promise<void> { try {
        const d = clone(this.furnitureDraft);
        if (d.shape === 'polygon')
            d.points = this.polygonText.split(';').filter(s => s.trim()).map(s => { const n = s.trim().split(/[\s,]+/).map(Number); if (n.length !== 2)
                throw Error('Usa pares x,y normalizados.'); return { x: n[0], y: n[1] }; });
        validateDefinition(d);
        await this.storage.saveDefinition(d);
        this.personal = await this.storage.library();
        this.change(() => { const index = this.doc.definitions.findIndex(x => x.id === d.id); if (index < 0)
            this.doc.definitions.push(d);
        else
            this.doc.definitions[index] = d; });
        this.furnitureDraft = { ...clone(d), id: uid(), name: d.name + ' · variante' };
        this.message = 'Mueble guardado en la biblioteca personal.';
    }
    catch (e) {
        this.error(e);
    } }
    usePersonal(id: string): void { const d = this.personal.find(d => d.id === id); if (!d)
        return; this.change(() => { if (!this.doc.definitions.some(x => x.id === id))
        this.doc.definitions.push(clone(d)); }); this.addFurniture(id); }
    loadDraft(d: FurnitureDefinition): void { this.furnitureDraft = clone(d); this.polygonText = d.points.map(p => `${p.x},${p.y}`).join('; '); }
    get openings(): Fixture[] { return this.doc.fixtures.filter(f => f.roomId === this.room.id && isOpening(f)); }
    isOpening = isOpening;
    openingPath(f: Fixture): string { return openingSymbol(f, this.room); }
    windowElevationPath(f: Fixture): string { return windowElevation(f, this.fx(f)); }
    openingDepth(f: Fixture): number { return openingThickness(f, this.room); }
    addOpening(kind: 'door' | 'window'): void {
        this.fixtureKind = kind;
        this.fixtureDefaults();
        const length = this.length(this.wallIndex), width = this.fixtureDraft.width * this.factor;
        const preferred = kind === 'door' ? this.fixtureDraft.offset * this.factor : (length - width) / 2;
        const occupied = this.openings.filter(f => f.wallId === this.wall.id)
            .map(f => ({ start: fixtureOffset(f, length), end: fixtureOffset(f, length) + f.width }))
            .sort((a, b) => a.start - b.start);
        const candidates: number[] = [];
        let start = 0;
        for (const interval of [...occupied, { start: length, end: length }]) {
            if (interval.start - start >= width) candidates.push(Math.max(start, Math.min(preferred, interval.start - width)));
            start = Math.max(start, interval.end);
        }
        if (!candidates.length) { this.message = 'No hay un tramo libre suficiente. Ajusta las dimensiones desde Puertas, ventanas e instalaciones.'; return; }
        candidates.sort((a, b) => Math.abs(a - preferred) - Math.abs(b - preferred));
        this.fixtureDraft.offset = candidates[0] / this.factor;
        this.addFixture();
    }
    fixtureDefaults(): void { const k = this.fixtureKind, s = 10 / this.factor; this.fixtureDraft = { offset: 45 * s, z: (k === 'door' ? 0 : k === 'window' ? 90 : 30) * s, width: (k === 'door' ? 80 : k === 'window' ? 120 : 8) * s, height: (k === 'door' ? 210 : k === 'window' ? 100 : 8) * s, anchor: 'left' }; }
    addFixture(): void { this.change(() => { const p = this.fixtureDraft; const f: Fixture = { id: uid(), roomId: this.room.id, wallId: this.wall.id, kind: this.fixtureKind, name: this.fixtureLabel(this.fixtureKind), offset: p.anchor === 'proportional' ? p.offset : p.offset * this.factor, z: p.z * this.factor, width: p.width * this.factor, height: p.height * this.factor, anchor: p.anchor, color: '#d49950' }; validateOpening(f, this.room); this.doc.fixtures.push(f); this.selectFixture(f.id); }); }
    fixtureLabel(k: FixtureKind): string { return ({ door: 'Puerta', window: 'Ventana', socket: 'Enchufe', 'double-socket': 'Enchufe doble', switch: 'Interruptor', rj45: 'RJ45', water: 'Agua', drain: 'Desagüe', light: 'Punto de luz', radiator: 'Radiador', generic: 'Elemento' })[k]; }
    selectFixture(id: string): void {
        const f = this.doc.fixtures.find(f => f.id === id);
        if (!f) return;
        this.selectedFixtureId = id;
        this.selectedId = '';
        this.selectedVertex = -1;
        this.roomId = f.roomId;
        this.wallIndex = this.room.walls.findIndex(w => w.id === f.wallId);
        this.fixtureEdit = clone(f);
        this.syncWall();
    }
    revealFixtureEditor(): void {
        document.getElementById('cad-fixture-properties')?.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
    editFixture(key: 'offset' | 'z' | 'width' | 'height', value: number): void {
        if (this.fixtureEdit) this.fixtureEdit[key] = key === 'offset' && this.fixtureEdit.anchor === 'proportional' ? value : value * this.factor;
    }
    editFixtureAnchor(anchor: Fixture['anchor']): void {
        if (!this.fixtureEdit) return;
        const x = fixtureOffset(this.fixtureEdit, this.length(this.wallIndex));
        this.fixtureEdit.anchor = anchor;
        this.positionFixture(this.fixtureEdit, x);
    }
    private positionFixture(f: Fixture, x: number): void {
        const index = this.room.walls.findIndex(w => w.id === f.wallId), length = this.length(index);
        f.offset = f.anchor === 'right' ? length - x - f.width : f.anchor === 'center' ? x - (length - f.width) / 2 : f.anchor === 'proportional' ? x / length : x;
    }
    applyFixtureEdit(): void {
        const draft = this.fixtureEdit;
        if (!draft || !this.selectedFixture) return;
        if (JSON.stringify(draft) === JSON.stringify(this.selectedFixture)) return;
        this.change(() => {
            if (this.wall.locked) throw Error('Desbloquea la pared para modificar sus elementos.');
            Object.assign(this.selectedFixture!, clone(draft));
            validateOpening(this.selectedFixture!, this.room);
        });
    }
    addNote(): void { if (!this.notes.trim())
        return; this.change(() => { this.doc.annotations.push({ id: uid(), roomId: this.room.id, ...this.center, text: this.notes }); }); this.notes = ''; }
    fit(): void { this.box = bounds(this.doc, this.room, this.view === 'plan' ? null : this.wallIndex); }
    zoom(ratio: number, anchor?: Point): void { const c = anchor || { x: this.box.x + this.box.width / 2, y: this.box.y + this.box.height / 2 }; const width = Math.max(200, Math.min(1e6, this.box.width * ratio)), r = width / this.box.width; this.box = { x: c.x + (this.box.x - c.x) * r, y: c.y + (this.box.y - c.y) * r, width, height: this.box.height * r }; }
    screenPoint(e: {
        clientX: number;
        clientY: number;
    }): Point { const svg = this.drawing!.nativeElement, m = svg.getScreenCTM(); if (!m)
        throw Error('El plano no está visible.'); const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse()); return { x: p.x, y: p.y }; }
    wheel(e: WheelEvent): void { e.preventDefault(); this.zoom(e.deltaY > 0 ? 1.12 : 1 / 1.12, this.screenPoint(e)); }
    pointerDown(e: PointerEvent, kind: 'object' | 'vertex' | 'fixture' | 'pan' = 'pan', id = '', index = -1): void {
        if (e.button !== 0 && e.button !== 1)
            return;
        const p = this.screenPoint(e);
        e.stopPropagation();
        if (this.tool === 'draw' || this.tool === 'measure') {
            const targets = this.view === 'plan' ? this.wallsDrawing.innerVertices : [];
            const q = this.snapping ? snap(p, targets, this.effectiveGrid, this.box.width / 80) : p;
            if (this.tool === 'draw')
                this.points.push(q);
            else {
                if (this.measure.length === 2)
                    this.measure = [];
                this.measure.push(q);
            }
            return;
        }
        if (kind === 'object' && this.tool !== 'pan') {
            this.selectFurniture(id);
            if (this.selected!.locked)
                return;
        }
        if (kind === 'fixture' && this.tool !== 'pan') {
            this.selectFixture(id);
            index = this.wallIndex;
            if (this.wall.locked) return;
        }
        if (kind === 'vertex' && this.tool !== 'pan') {
            this.selectVertex(index);
            if (this.room.walls[index].locked || this.room.walls[(index + this.room.walls.length - 1) % this.room.walls.length].locked)
                return;
        }
        const effective = this.tool === 'pan' || e.button === 1 ? 'pan' : kind;
        if (effective === 'pan' && this.tool === 'select' && e.button === 0) {
            this.selectedId = '';
            this.selectedFixtureId = '';
            this.selectedVertex = -1;
        }
        this.drag = { kind: effective, start: p, before: clone(this.doc), origin: effective === 'object' ? { x: this.selected!.x, y: this.selected!.y } : effective === 'vertex' ? { ...this.wallsDrawing.innerVertices[index] } : effective === 'fixture' ? { x: fixtureOffset(this.selectedFixture!, this.length(index)), y: this.selectedFixture!.z } : p, box: { ...this.box }, id, index };
        this.drawing!.nativeElement.setPointerCapture(e.pointerId);
    }
    pointerMove(e: PointerEvent): void {
        const p = this.screenPoint(e);
        this.cursor = p;
        if (!this.drag)
            return;
        const d = this.drag, dx = p.x - d.start.x, dy = p.y - d.start.y;
        if (d.kind === 'pan') {
            this.box = { ...this.box, x: this.box.x - dx, y: this.box.y - dy };
            return;
        }
        if (d.kind === 'fixture') {
            const f = this.doc.fixtures.find(f => f.id === d.id)!;
            const frame = interiorWallFrame(this.room, d.index), a = frame.start, b = frame.end, length = frame.length;
            let x = d.origin.x + (this.view === 'elevation' ? dx : (dx * (b.x - a.x) + dy * (b.y - a.y)) / length);
            let z = this.view === 'elevation' ? d.origin.y - dy : d.origin.y;
            // A click selects without quantising an existing exact position.
            if (Math.hypot(dx, dy) < 1e-6) return;
            if (this.snapping) { const step = this.effectiveGrid; x = Math.round(x / step) * step; if (this.view === 'elevation') z = Math.round(z / step) * step; }
            this.positionFixture(f, x);
            f.z = z;
            this.fixtureEdit = clone(f);
            return;
        }
        if (d.kind === 'vertex' && Math.hypot(dx, dy) < this.fontSize / 4) return;
        let q = { x: d.origin.x + dx, y: d.origin.y + dy };
        if (this.snapping)
            q = snap(q, [], this.effectiveGrid, this.box.width / 80);
        if (d.kind === 'object') {
            const i = this.doc.instances.find(i => i.id === d.id)!;
            i.x = q.x;
            i.y = q.y;
        }
        else {
            try { moveInteriorVertex(this.room, d.index, q); d.invalid = undefined; this.message = ''; this.vertexEdit = { ...this.wallsDrawing.innerVertices[d.index] }; }
            catch (e) { d.invalid = e instanceof Error ? e.message : String(e); this.message = d.invalid; }
        }
    }
    pointerUp(): void { const d = this.drag; if (!d)
        return; this.drag = undefined; if (d.kind === 'pan')
        return; try {
        if (d.invalid) throw Error(d.invalid);
        parseDocument(this.doc);
        if (d.kind === 'fixture') validateOpening(this.doc.fixtures.find(f => f.id === d.id)!, this.room);
        if (JSON.stringify(d.before) !== JSON.stringify(this.doc)) {
            this.history.commit(d.before);
            this.changed();
        }
        this.message = '';
    }
    catch (e) {
        this.doc = d.before;
        this.error(e);
    } this.syncWall(); if (d.kind === 'fixture') this.selectFixture(d.id); if (d.kind === 'vertex') this.selectVertex(d.index); }
    cancelDrag(): void { if (this.drag) {
        const cancelled = this.drag;
        this.doc = cancelled.before;
        this.drag = undefined;
        if (cancelled.kind === 'fixture') this.selectFixture(cancelled.id);
        if (cancelled.kind === 'vertex') this.selectVertex(cancelled.index);
    } }
    libraryDrag(e: DragEvent, id: string): void { e.dataTransfer?.setData('text/plain', id); }
    drop(e: DragEvent): void { e.preventDefault(); if (this.view === 'plan')
        this.addFurniture(e.dataTransfer?.getData('text/plain') || '', this.screenPoint(e)); }
    @HostListener('window:keydown', ['$event'])
    key(e: KeyboardEvent): void {
        const el = e.target as HTMLElement;
        if (el.closest('input,textarea,select,[contenteditable]'))
            return;
        if (e.key === 'Escape') {
            this.cancelDrag();
            this.points = [];
            this.measure = [];
            this.tool = 'select';
            this.expanded = false;
            return;
        }
        if (!(el.closest('app-interior-planner')))
            return;
        if (e.ctrlKey || e.metaKey) {
            const k = e.key.toLowerCase();
            if (['z', 'y', 'd', 'c', 'v', 's'].includes(k))
                e.preventDefault();
            if (k === 'z')
                e.shiftKey ? this.redo() : this.undo();
            if (k === 'y')
                this.redo();
            if (k === 'd')
                this.duplicate();
            if (k === 's')
                void this.persist();
            if (k === 'c' && this.selected)
                this.copied = clone(this.selected);
            if (k === 'v' && this.copied) {
                const c = clone(this.copied);
                this.change(() => { if (!this.doc.definitions.some(d => d.id === c.definitionId))
                    throw Error('La definición copiada pertenece a otro proyecto.'); c.id = uid(); c.roomId = this.room.id; c.x += 100; c.y += 100; c.locked = false; this.doc.instances.push(c); this.selectedId = c.id; });
            }
            return;
        }
        if (e.key === 'Delete') {
            e.preventDefault();
            this.removeSelection();
        }
        if (this.selected && ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
            e.preventDefault();
            const amount = e.shiftKey ? 100 : 10;
            this.change(() => { if (this.selected!.locked)
                throw Error('El mueble está bloqueado.'); this.selected!.x += e.key === 'ArrowLeft' ? -amount : e.key === 'ArrowRight' ? amount : 0; this.selected!.y += e.key === 'ArrowUp' ? -amount : e.key === 'ArrowDown' ? amount : 0; });
        }
    }
    json(): void { download(new Blob([JSON.stringify(this.doc, null, 2)], { type: 'application/json' }), 'interiores.json'); }
    svg(): void { download(new Blob([exportSvg(this.doc, this.room, this.view === 'plan' ? null : this.wallIndex, this.dimensions)], { type: 'image/svg+xml' }), 'plano.svg'); }
    async png(): Promise<void> { try {
        download(await exportPng(exportSvg(this.doc, this.room, this.view === 'plan' ? null : this.wallIndex, this.dimensions), this.pngWidth, this.transparent), 'plano.png');
    }
    catch (e) {
        this.error(e);
    } }
    async importFile(e: Event, library = false): Promise<void> { const input = e.target as HTMLInputElement, file = input.files?.[0]; if (!file)
        return; try {
        if (file.size > 8e6)
            throw Error('El archivo supera el límite de 8 MB.');
        const parsed: unknown = JSON.parse(await file.text());
        if (library) {
            if (!Array.isArray(parsed) || parsed.length > 1000)
                throw Error('Biblioteca inválida.');
            for (const d of parsed)
                validateDefinition(d);
            for (const d of parsed)
                await this.storage.saveDefinition(d);
            this.personal = await this.storage.library();
            this.message = 'Biblioteca importada.';
        }
        else {
            const doc = parseDocument(parsed);
            await this.persist();
            doc.id = uid();
            doc.name += ' · importado';
            this.doc = doc;
            this.resetUi();
            this.changed();
            this.message = 'Proyecto importado como copia independiente.';
        }
    }
    catch (error) {
        this.error(error);
    }
    finally {
        input.value = '';
    } }
    exportLibrary(): void { download(new Blob([JSON.stringify(this.personal, null, 2)], { type: 'application/json' }), 'muebles.json'); }
    print(): void { try {
        if (!Number.isFinite(this.printScale) || this.printScale < 1 || this.printScale > 1000)
            throw Error('Escala de impresión inválida.');
        const index = this.view === 'plan' ? null : this.wallIndex, b = bounds(this.doc, this.room, index), svg = exportSvg(this.doc, this.room, index, this.dimensions).replace(`width="${b.width}mm" height="${b.height}mm"`, `width="${b.width / this.printScale}mm" height="${b.height / this.printScale}mm"`), p = window.open('', '_blank');
        if (!p)
            throw Error('Permite abrir la previsualización de impresión.');
        p.document.write(`<!doctype html><html lang="es"><head><title>${escapeXml(this.doc.name)}</title><style>@page{size:${this.paper === 'A3' ? 'A3' : 'A4'} ${this.orientation === 'portrait' ? 'portrait' : 'landscape'};margin:10mm}body{font:12px sans-serif;color:#263f55}svg{display:block;max-width:none}button{padding:10px}@media print{button{display:none}}</style></head><body><button onclick="window.print()">Imprimir / Guardar PDF</button><h1>${escapeXml(this.doc.name)}</h1><p>${escapeXml(this.room.name)} · 1:${this.printScale} · Medidas en ${this.doc.unit}. Comprueba el encaje en papel y desactiva «ajustar a página».</p>${svg}</body></html>`);
        p.document.close();
    }
    catch (e) {
        this.error(e);
    } }
}
function polygonSigned(p: Point[]): number { return p.reduce((s, a, i) => s + a.x * p[(i + 1) % p.length].y - p[(i + 1) % p.length].x * a.y, 0); }
