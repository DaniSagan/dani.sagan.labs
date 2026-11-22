import { isOpening, openingSymbol, openingThickness, windowElevation } from './cad-openings';
import { CadDocument, Room, UNIT_MM } from './cad-model';
import { fixtureOffset, furniturePath, polygonPath } from './cad-geometry';
import { interiorWallFrame, interiorWallLength, interiorFixturePlan, wallDrawing } from './cad-walls';
export const escapeXml = (s: string): string => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' }[c] as string));
export interface Bounds {
    x: number;
    y: number;
    width: number;
    height: number;
}
export function bounds(doc: CadDocument, room: Room, wallIndex: number | null): Bounds {
    if (wallIndex !== null) {
        const w = room.walls[wallIndex];
        return { x: -350, y: -Math.max(w.height, w.endHeight) - 350, width: interiorWallLength(room, wallIndex) + 700, height: Math.max(w.height, w.endHeight) + 700 };
    }
    const points = [...room.vertices, ...wallDrawing(room).outer];
    for (const i of doc.instances.filter(i => i.roomId === room.id && !i.hidden)) {
        const d = doc.definitions.find(d => d.id === i.definitionId)!;
        points.push({ x: i.x - d.width - d.depth, y: i.y - d.width - d.depth }, { x: i.x + d.width + d.depth, y: i.y + d.width + d.depth });
    }
    const xs = points.map(p => p.x), ys = points.map(p => p.y), x = Math.min(...xs) - 450, y = Math.min(...ys) - 450;
    return { x, y, width: Math.max(...xs) + 450 - x, height: Math.max(...ys) + 450 - y };
}
export function sceneSvg(doc: CadDocument, room: Room, wallIndex: number | null, dimensions = true): string {
    const fmt = (n: number) => (n / UNIT_MM[doc.unit]).toLocaleString('es-ES', { maximumFractionDigits: doc.precision }) + ' ' + doc.unit;
    const label = (x: number, y: number, s: string) => `<text x="${x}" y="${y}" font-size="75" text-anchor="middle" fill="#263f55" stroke="#fff" stroke-width="12" paint-order="stroke">${escapeXml(s)}</text>`;
    if (wallIndex !== null) {
        const w = room.walls[wallIndex], length = interiorWallLength(room, wallIndex);
        let out = `<path d="M 0 0 L ${length} 0 L ${length} ${-w.endHeight} L 0 ${-w.height} Z" fill="#edf2f7" stroke="${w.color}" stroke-width="15"/>`;
        for (const f of doc.fixtures.filter(f => f.wallId === w.id)) {
            const x = fixtureOffset(f, length);
            out += `<rect x="${x}" y="${-f.z - f.height}" width="${f.width}" height="${f.height}" fill="${isOpening(f) ? '#fff' : f.color}" stroke="#263f55" stroke-width="8"/><path d="${windowElevation(f, x)}" fill="none" stroke="#263f55" stroke-width="8"/>` + label(x + f.width / 2, -f.z - f.height - 50, f.name);
        }
        return out + (dimensions ? label(length / 2, 180, fmt(length)) + label(-170, -w.height / 2, fmt(w.height)) + label(length + 170, -w.endHeight / 2, fmt(w.endHeight)) : '');
    }
    const walls = wallDrawing(room), b = bounds(doc, room, null);
    const cuts = doc.fixtures.filter(f => f.roomId === room.id && isOpening(f)).map(f => {
        const p = interiorFixturePlan(f, room), thickness = openingThickness(f, room);
        return `<rect transform="translate(${p.point.x} ${p.point.y}) rotate(${p.angle})" x="0" y="${-thickness / 2 - 6}" width="${f.width}" height="${thickness + 12}" fill="black"/>`;
    }).join('');
    let out = `<defs><pattern id="export-wall-hatch" patternUnits="userSpaceOnUse" width="40" height="40" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="40" stroke="#65717a" stroke-width="4"/></pattern><mask id="export-openings" maskUnits="userSpaceOnUse" x="${b.x}" y="${b.y}" width="${b.width}" height="${b.height}"><rect x="${b.x}" y="${b.y}" width="${b.width}" height="${b.height}" fill="white"/>${cuts}</mask></defs><path d="${polygonPath(room.vertices)}" fill="#f5f7fa" stroke="none"/><g mask="url(#export-openings)"><path d="${walls.band}" fill="#fff" fill-rule="evenodd"/><path d="${walls.band}" fill="url(#export-wall-hatch)" fill-rule="evenodd"/>`;
    room.walls.forEach((w, i) => { const frame = interiorWallFrame(room, i), a = frame.start, b = frame.end; out += `<path d="${walls.sections[i].faces}" fill="none" stroke="${w.color}" stroke-width="6"/>`; if (dimensions)
        out += label((a.x + b.x) / 2, (a.y + b.y) / 2 - 95, `${i + 1} · ${fmt(interiorWallLength(room, i))}`); });
    out += '</g>';
    for (const f of doc.fixtures.filter(f => f.roomId === room.id)) {
        const p = interiorFixturePlan(f, room);
        if (isOpening(f)) {
            out += `<g transform="translate(${p.point.x} ${p.point.y}) rotate(${p.angle})"><path d="${openingSymbol(f, room)}" fill="none" stroke="#526b80" stroke-width="8"/></g>`;
            continue;
        }
        out += `<g transform="translate(${p.point.x} ${p.point.y}) rotate(${p.angle})"><rect x="0" y="-45" width="${f.width}" height="90" fill="${f.color}" stroke="#263f55" stroke-width="8"/>${f.kind === 'door' ? `<path d="M 0 0 L 0 ${f.width} A ${f.width} ${f.width} 0 0 0 ${f.width} 0" fill="none" stroke="#526b80" stroke-width="12"/>` : ''}</g>`;
    }
    for (const i of doc.instances.filter(i => i.roomId === room.id && !i.hidden)) {
        const d = doc.definitions.find(d => d.id === i.definitionId)!;
        out += `<g transform="translate(${i.x} ${i.y}) rotate(${i.rotation})"><path d="${furniturePath(d)}" fill="${d.color}" stroke="#263f55" stroke-width="12"/>${label(d.width / 2, d.depth / 2, d.name)}</g>`;
    }
    for (const a of doc.annotations.filter(a => a.roomId === room.id))
        out += label(a.x, a.y, a.text);
    return out;
}
export function exportSvg(doc: CadDocument, room: Room, wallIndex: number | null, dimensions = true): string {
    const b = bounds(doc, room, wallIndex);
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${b.x} ${b.y} ${b.width} ${b.height}" width="${b.width}mm" height="${b.height}mm"><title>${escapeXml(doc.name)}</title><g font-family="sans-serif">${sceneSvg(doc, room, wallIndex, dimensions)}</g></svg>`;
}
export function download(data: Blob, filename: string): void { const url = URL.createObjectURL(data), a = document.createElement('a'); a.href = url; a.download = filename; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); }
export async function exportPng(svg: string, width: number, transparent: boolean): Promise<Blob> {
    if (!Number.isFinite(width) || width < 256 || width > 8192)
        throw Error('La anchura PNG debe estar entre 256 y 8192 píxeles.');
    const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
    try {
        const img = new Image();
        await new Promise<void>((resolve, reject) => { img.onload = () => resolve(); img.onerror = () => reject(Error('No se pudo generar la imagen.')); img.src = url; });
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(width);
        canvas.height = Math.max(1, Math.round(width * img.height / img.width));
        if (canvas.height > 16384)
            throw Error('Imagen demasiado alta.');
        const ctx = canvas.getContext('2d');
        if (!ctx)
            throw Error('Canvas no disponible.');
        if (!transparent) {
            ctx.fillStyle = '#fff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        return await new Promise<Blob>((resolve, reject) => canvas.toBlob(b => b ? resolve(b) : reject(Error('No se pudo exportar PNG.')), 'image/png'));
    }
    finally {
        URL.revokeObjectURL(url);
    }
}
