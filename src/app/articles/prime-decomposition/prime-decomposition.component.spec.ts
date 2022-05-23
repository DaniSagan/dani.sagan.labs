import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrimeDecompositionComponent } from './prime-decomposition.component';

describe('PrimeDecompositionComponent', () => {
  let component: PrimeDecompositionComponent;
  let fixture: ComponentFixture<PrimeDecompositionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrimeDecompositionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrimeDecompositionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
