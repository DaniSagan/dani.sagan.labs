import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DragonCurveComponent } from './dragon-curve.component';

describe('DragonCurveComponent', () => {
  let component: DragonCurveComponent;
  let fixture: ComponentFixture<DragonCurveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DragonCurveComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DragonCurveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
