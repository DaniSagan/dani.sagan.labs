import { ElementRef, NgZone } from '@angular/core';
import * as THREE from 'three';
import { GravityComponent } from './gravity.component';

describe('GravityComponent camera selection', () => {
  let component: GravityComponent;
  let internals: {
    camera: THREE.PerspectiveCamera;
    controls: {
      target: THREE.Vector3;
      update: () => void;
      enableDamping: boolean;
      enablePan: boolean;
      minDistance: number;
    };
    pointerDown: (e: PointerEvent) => void;
    pointerMove: (e: PointerEvent) => void;
    pointerUp: (e: PointerEvent) => void;
    pointerCancel: (e: PointerEvent) => void;
    pickBody: (x: number, y: number) => void;
  };
  beforeEach(() => {
    component = new GravityComponent(
      new NgZone({ enableLongStackTrace: false }),
    );
    component.model.load('custom');
    component.canvas = new ElementRef(document.createElement('canvas'));
    internals = component as unknown as typeof internals;
    internals.controls = {
      target: new THREE.Vector3(),
      update: () => {},
      enableDamping: true,
      enablePan: true,
      minDistance: 0.0002,
    };
    internals.camera.position.set(1, 1, 1);
  });
  const event = (id: number, x = 100, y = 100) =>
    ({ pointerId: id, button: 0, clientX: x, clientY: y }) as PointerEvent;
  it('sets the orbital pivot to the selected body at its physical scale', () => {
    const body = component.model.bodies[0];
    body.position = [2, 3, 4];
    component.focus(body.id);
    expect(component.selected).toBe(body.id);
    expect(internals.controls.target.toArray()).toEqual(body.position);
    expect(
      internals.camera.position.distanceTo(internals.controls.target),
    ).toBeCloseTo(body.radius * 6.4, 10);
    expect(internals.controls.enablePan).toBeFalse();
    component.overview();
    expect(component.selected).toBe(0);
    expect(internals.controls.enablePan).toBeTrue();
  });
  it('picks on a tap but not on drags, cancelled pointers or a pinch', () => {
    const pick = spyOn(internals, 'pickBody');
    internals.pointerDown(event(1));
    internals.pointerUp(event(1));
    expect(pick).toHaveBeenCalledTimes(1);
    internals.pointerDown(event(1));
    internals.pointerMove(event(1, 120));
    internals.pointerUp(event(1));
    expect(pick).toHaveBeenCalledTimes(1);
    internals.pointerDown(event(1));
    internals.pointerCancel(event(1));
    internals.pointerUp(event(1));
    expect(pick).toHaveBeenCalledTimes(1);
    internals.pointerDown(event(1));
    internals.pointerDown(event(2));
    internals.pointerUp(event(2));
    internals.pointerUp(event(1));
    expect(pick).toHaveBeenCalledTimes(1);
  });
  it('removes dependent moons when their host is removed', () => {
    component.model.load('solar');
    const earth = component.model.bodies.find((b) => b.name === 'Tierra')!;
    // This unit check concerns the catalogue; avoid constructing GPU resources.
    spyOn(component as unknown as { rebuild: () => void }, 'rebuild');
    component.remove(earth.id);
    expect(component.model.bodies.some((b) => b.name === 'Luna')).toBeFalse();
    expect(
      component.model.bodies.some((b) => b.parentId === earth.id),
    ).toBeFalse();
  });
});
