import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PiDecimalComponent } from './pi-decimal.component';
import { provideRouter } from '@angular/router';

describe('PiDecimalComponent', () => {
  let component: PiDecimalComponent;
  let fixture: ComponentFixture<PiDecimalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PiDecimalComponent],
      providers: [provideRouter([])],
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PiDecimalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('validates precision and block size before creating a worker', () => {
    const worker = spyOn(window, 'Worker');
    for (const n of [null, -1, 1.5, 1000001]) {
      component.n = n; component.onCalculate(); expect(component.error).toBeTruthy();
    }
    component.n = 100;
    component.blockSize = -1; component.onCalculate(); expect(component.error).toBeTruthy();
    expect(worker).not.toHaveBeenCalled();
  });

  it('cancels workers and ignores stale results', () => {
    const first = { terminate: jasmine.createSpy(), postMessage: jasmine.createSpy() } as unknown as Worker;
    const second = { terminate: jasmine.createSpy(), postMessage: jasmine.createSpy() } as unknown as Worker;
    spyOn(window, 'Worker').and.returnValues(first, second);
    component.n = 1000; component.onCalculate();
    expect(first.postMessage).toHaveBeenCalledWith({ digits: 1000 });
    component.n = 10; component.onCalculate(); expect(first.terminate).toHaveBeenCalled();
    first.onmessage?.call(first, new MessageEvent('message', { data: { kind: 'result', result: { digits: 1000 } } }));
    expect(component.result).toBeNull();
    component.ngOnDestroy(); expect(second.terminate).toHaveBeenCalled(); expect(component.calculating).toBeFalse();
  });

  it('regroups and paginates without changing computed digits', () => {
    const decimals = '1234567890'.repeat(200);
    component.result = { decimals, digits: 2000, terms: 145, guardDigits: 24, elapsedMs: 1 };
    component.blockSize = 7; component.applyBlocks();
    expect(component.pageSize).toBe(994);
    expect(component.blocks[0].text).toBe('1234567');
    component.changePage(1); expect(component.firstDigit).toBe(995);
    component.blockSize = 0; component.applyBlocks();
    expect(component.blocks.length).toBe(1); expect(component.blocks[0].text.length).toBe(1000);
    expect(component.result.decimals).toBe(decimals);
  });
});
