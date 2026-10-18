import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrimeDecompositionComponent } from './prime-decomposition.component';

describe('PrimeDecompositionComponent', () => {
  let component: PrimeDecompositionComponent;
  let fixture: ComponentFixture<PrimeDecompositionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrimeDecompositionComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrimeDecompositionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('rejects malformed or zero input before starting a worker', () => {
    const worker = spyOn(window, 'Worker');
    for (const value of ['0', '1e30', '12.5', '']) {
      component.value = value;
      component.calculate();
      expect(component.error).toBeTruthy();
      expect(component.result).toBeNull();
    }
    expect(worker).not.toHaveBeenCalled();
  });

  it('terminates a calculation on reset and ignores stale messages', () => {
    const first = { terminate: jasmine.createSpy('terminate'), postMessage: jasmine.createSpy('postMessage') } as unknown as Worker;
    const second = { terminate: jasmine.createSpy('terminate'), postMessage: jasmine.createSpy('postMessage') } as unknown as Worker;
    spyOn(window, 'Worker').and.returnValues(first, second);
    component.value = '9007199254740993';
    component.calculate();
    expect(first.postMessage).toHaveBeenCalledWith({ input: '9007199254740993', timeMs: 15000, requireProof: false });
    component.value = '360';
    component.calculate();
    expect(first.terminate).toHaveBeenCalled();
    first.onmessage?.call(first, new MessageEvent('message', { data: { kind: 'result', result: { input: 'old' } } }));
    expect(component.result?.input).toBe('360');
    component.ngOnDestroy();
    expect(second.terminate).toHaveBeenCalled();
    expect(component.working).toBeFalse();
    expect(component.result?.status).toBe('partial');
  });

  it('sends the selected proof requirement to the worker', () => {
    const worker = { terminate: jasmine.createSpy('terminate'), postMessage: jasmine.createSpy('postMessage') } as unknown as Worker;
    spyOn(window, 'Worker').and.returnValue(worker);
    component.requireProof = true;
    component.calculate();
    expect(worker.postMessage).toHaveBeenCalledWith({ input: '360', timeMs: 15000, requireProof: true });
    component.ngOnDestroy();
  });

  it('supports ten minutes and an unlimited deadline while preserving cancellation', () => {
    const worker = { terminate: jasmine.createSpy('terminate'), postMessage: jasmine.createSpy('postMessage') } as unknown as Worker;
    spyOn(window, 'Worker').and.returnValue(worker);
    component.seconds = 600;
    component.calculate();
    expect(worker.postMessage).toHaveBeenCalledWith({ input: '360', timeMs: 600000, requireProof: false });
    component.seconds = null;
    component.calculate();
    expect(worker.postMessage).toHaveBeenCalledWith({ input: '360', timeMs: null, requireProof: false });
    component.stop();
    expect(worker.terminate).toHaveBeenCalled();
    expect(component.working).toBeFalse();
  });
});
