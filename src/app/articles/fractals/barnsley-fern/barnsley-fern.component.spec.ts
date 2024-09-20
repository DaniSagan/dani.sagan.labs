import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarnsleyFernComponent } from './barnsley-fern.component';

describe('BarnsleyFernComponent', () => {
  let component: BarnsleyFernComponent;
  let fixture: ComponentFixture<BarnsleyFernComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarnsleyFernComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BarnsleyFernComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
