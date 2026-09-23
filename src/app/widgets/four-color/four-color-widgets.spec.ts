import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FourColorEditorComponent } from './four-color-editor.component';
import { FourColorSearchComponent } from './four-color-search.component';
import { FourColorKempeComponent } from './four-color-kempe.component';

describe('Four-color widgets', () => {
  it('selects a region by keyboard and updates conflict feedback with undo', async () => {
    await TestBed.configureTestingModule({
      imports: [FourColorEditorComponent],
    }).compileComponents();
    const fixture = TestBed.createComponent(FourColorEditorComponent);
    fixture.detectChanges();
    const regions = fixture.nativeElement.querySelectorAll('g[role="button"]');
    regions[1].dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }),
    );
    fixture.detectChanges();
    const editor = fixture.componentInstance;
    expect(editor.selected).toBe(1);
    editor.paint(0);
    editor.selected = 0;
    editor.paint(0);
    fixture.detectChanges();
    expect(editor.conflicts.length).toBe(1);
    expect(fixture.nativeElement.textContent).toContain('Hay regiones vecinas');
    editor.undo();
    expect(editor.conflicts.length).toBe(0);
    editor.solve();
    expect(editor.remaining).toBe(0);
    expect(editor.conflicts.length).toBe(0);
    fixture.destroy();
  });
  it('replaces the geometry and resets colors when switching maps', () => {
    const editor = new FourColorEditorComponent();
    editor.solve();
    editor.kind = 'point';
    editor.load();
    expect(editor.map.edges.length).toBe(4);
    expect(editor.remaining).toBe(4);
    editor.kind = 'mosaic';
    editor.load();
    expect(editor.colors.length).toBe(12);
    expect(editor.history.length).toBe(0);
  });
  it('shows the actual search result and cancels playback when reset or destroyed', fakeAsync(() => {
    const search = new FourColorSearchComponent();
    expect(search.result.status).toBe('impossible');
    search.toggle();
    tick(350);
    expect(search.step).toBe(1);
    search.k = 4;
    search.reset();
    expect(search.running).toBeFalse();
    expect(search.result.status).toBe('solved');
    search.toggle();
    search.ngOnDestroy();
    const step = search.step;
    tick(700);
    expect(search.step).toBe(step);
  }));
  it('swaps exactly the selected component and reverses the operation', () => {
    const widget = new FourColorKempeComponent(),
      original = [...widget.colors];
    widget.a = widget.colors[0];
    widget.b = (widget.a + 1) % 4;
    const component = widget.component;
    expect(component.length).toBeGreaterThan(0);
    widget.swap();
    expect(widget.conflicts).toBe(0);
    expect(
      widget.colors.every((c, i) => component.includes(i) || c === original[i]),
    ).toBeTrue();
    widget.swap();
    expect(widget.colors).toEqual(original);
  });
});
