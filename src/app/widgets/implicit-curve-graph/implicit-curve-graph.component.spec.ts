import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImplicitCurveGraphComponent } from './implicit-curve-graph.component';

describe('ImplicitCurveGraphComponent', () => {
  let component: ImplicitCurveGraphComponent;
  let fixture: ComponentFixture<ImplicitCurveGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImplicitCurveGraphComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ImplicitCurveGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
