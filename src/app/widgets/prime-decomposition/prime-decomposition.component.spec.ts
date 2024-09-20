import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrimeDecompositionComponent } from './prime-decomposition.component';
import { MathjaxModule } from 'mathjax-angular';

describe('PrimeDecompositionComponent', () => {
  let component: PrimeDecompositionComponent;
  let fixture: ComponentFixture<PrimeDecompositionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrimeDecompositionComponent, MathjaxModule.forRoot()],
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
});
