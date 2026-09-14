import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import {
  classifyPrime,
  integerSqrt,
  spiralPosition,
  spiralValue,
} from '../../shared/math/ulam';
import { UlamExplorerComponent } from './ulam-explorer.component';

describe('Ulam spiral', () => {
  it('renders a PNG with the cell colors instead of SVG elements', async () => {
    await TestBed.configureTestingModule({
      imports: [UlamExplorerComponent],
    }).compileComponents();
    const fixture = TestBed.createComponent(UlamExplorerComponent);
    const c = fixture.componentInstance;
    c.cellSize = 80;
    c.render();
    c.stop();
    const cell = c.cells.find((cell) => cell.n === 2n)!;
    cell.state = 'prime';
    c.redrawImage();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('svg')).toBeNull();
    expect(
      fixture.nativeElement.querySelector('img').getAttribute('src'),
    ).toMatch(/^data:image\/png;base64,/);
    const image = new Image();
    image.src = c.imageUrl;
    await image.decode();
    const canvas = document.createElement('canvas');
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    const context = canvas.getContext('2d')!;
    context.drawImage(image, 0, 0);
    const scale = image.naturalWidth / 600;
    const pixel = context.getImageData(
      Math.floor((cell.x + 10) * scale),
      Math.floor((cell.y + 10) * scale),
      1,
      1,
    ).data;
    expect(Array.from(pixel)).toEqual([117, 207, 255, 255]);
    fixture.destroy();
  });
  it('uses pixel-sized cells and keeps the center and hit testing aligned', () => {
    TestBed.configureTestingModule({ imports: [UlamExplorerComponent] });
    const fixture = TestBed.createComponent(UlamExplorerComponent);
    const c = fixture.componentInstance;
    c.cellSize = 30;
    c.viewportSize = 600;
    c.render();
    expect(c.size).toBe(19);
    expect(c.offset).toBe(15);
    expect(c.selected!.x + c.cellSize / 2).toBe(300);
    c.viewportSize = 320;
    c.render();
    expect(c.size).toBe(9);
    expect(c.pitch).toBe(30);
    expect(c.selected!.x + c.cellSize / 2).toBe(160);
    c.inspect({
      clientX: 190,
      clientY: 160,
      currentTarget: {
        getBoundingClientRect: () => ({
          left: 0,
          top: 0,
          width: 320,
          height: 320,
        }),
      },
    } as unknown as MouseEvent);
    expect(c.selected!.n).toBe(2n);
    fixture.destroy();
  });
  it('matches a walked spiral and inverts huge coordinates exactly', () => {
    let x = 0n,
      y = 0n,
      n = 1n,
      length = 1;
    const directions = [
      [1n, 0n],
      [0n, 1n],
      [-1n, 0n],
      [0n, -1n],
    ];
    for (let segment = 0; segment < 60; segment++) {
      const [dx, dy] = directions[segment % 4];
      for (let j = 0; j < length; j++) {
        expect(spiralValue(x, y)).toBe(n);
        expect(spiralPosition(n)).toEqual({ x, y });
        x += dx;
        y += dy;
        n++;
      }
      if (segment % 2) length++;
    }
    for (const value of [
      10n ** 100n,
      (2n * 10n ** 70n + 1n) ** 2n,
      9007199254740993n,
    ]) {
      const p = spiralPosition(value);
      expect(spiralValue(p.x, p.y)).toBe(value);
      const root = integerSqrt(value);
      expect(root * root <= value).toBeTrue();
      expect((root + 1n) ** 2n > value).toBeTrue();
    }
  });
  it('labels exact primes, composites, and probable primes distinctly', () => {
    const classify = (n: bigint) => {
      const generator = classifyPrime(n);
      let step = generator.next();
      while (!step.done) step = generator.next();
      return step.value;
    };
    expect(classify(1n)).toBe('unit');
    for (const n of [2n, 41n, 997n, 999983n]) expect(classify(n)).toBe('prime');
    for (const n of [49n, 1681n, 1009n ** 2n, 3215031751n])
      expect(classify(n)).toBe('composite');
    expect(classify(1000000007n)).toBe('probable');
  });
  it('navigates huge bounds, validates input, and cancels pending tests', fakeAsync(() => {
    TestBed.configureTestingModule({ imports: [UlamExplorerComponent] });
    const fixture = TestBed.createComponent(UlamExplorerComponent);
    const c = fixture.componentInstance;
    c.cellSize = 80;
    c.render();
    tick(1000);
    fixture.detectChanges();
    expect(c.running).toBeFalse();
    expect(c.completed).toBe(49);
    c.endInput = (10n ** 100n).toString();
    c.apply(true);
    expect(c.selected!.n).toBe(10n ** 100n);
    expect(c.cells.every((cell) => cell.n <= c.end)).toBeTrue();
    c.stop();
    const done = c.completed;
    tick(1000);
    expect(c.completed).toBe(done);
    c.resume();
    expect(c.running).toBeTrue();
    c.targetInput = '0';
    c.apply();
    expect(c.error).not.toBe('');
    c.origin();
    expect(c.cx).toBe(0n);
    expect(c.cy).toBe(0n);
    fixture.destroy();
    tick(1000);
    expect(c.running).toBeFalse();
  }));
});
