import { interiorWallLength } from './cad-walls';
import { Fixture, Room } from './cad-model';
import { fixtureOffset, signedArea } from './cad-geometry';

export const isOpening = (f: Fixture): boolean => f.kind === 'door' || f.kind === 'window';

/** Door swing and hinge are relative to the room and wall direction. */
export function openingSymbol(f: Fixture, room: Room): string {
  const index = room.walls.findIndex(w => w.id === f.wallId);
  const half = room.walls[index].thickness / 2, width = f.width;
  const sign = (signedArea(room.vertices) > 0 ? 1 : -1) * (f.doorSwing === 'outward' ? -1 : 1), y = sign * half;
  const hinge = f.doorHinge === 'end' ? width : 0;
  const tip = f.doorHinge === 'end' ? 0 : width;
  const sweep = (sign > 0) === (f.doorHinge !== 'end') ? 0 : 1;
  const jambs = `M 0 ${-half} V ${half} M ${width} ${-half} V ${half}`;
  return f.kind === 'door'
    ? `${jambs} M ${hinge} ${y} V ${y + sign * width} A ${width} ${width} 0 0 ${sweep} ${tip} ${y}`
    : `${jambs} M 0 ${-half} H ${width} M 0 0 H ${width} M 0 ${half} H ${width}`;
}

export function openingThickness(f: Fixture, room: Room): number {
  return room.walls.find(w => w.id === f.wallId)!.thickness;
}

export function windowElevation(f: Fixture, x: number): string {
  if (f.kind !== 'window') return '';
  return `M ${x} ${-f.z - f.height / 2} H ${x + f.width} M ${x + f.width / 2} ${-f.z} V ${-f.z - f.height}`;
}

export function validateOpening(f: Fixture, room: Room): void {
  if (!isOpening(f)) return;
  const index = room.walls.findIndex(w => w.id === f.wallId), wall = room.walls[index];
  if (wall.locked) throw Error('Desbloquea la pared para añadir o modificar el hueco.');
  const length = interiorWallLength(room, index), x = fixtureOffset(f, length);
  const roof = (at: number): number => wall.height + (wall.endHeight - wall.height) * at / length;
  if (f.width <= 0 || f.height <= 0 || f.z < 0 || x < 0 || x + f.width > length + 1e-6 ||
      f.z + f.height > Math.min(roof(x), roof(x + f.width)) + 1e-6)
    throw Error('La puerta o ventana debe caber en la longitud y la altura de la pared. Revisa posición y dimensiones.');
}
