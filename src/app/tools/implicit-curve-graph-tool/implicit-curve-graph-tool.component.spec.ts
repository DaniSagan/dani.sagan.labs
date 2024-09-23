import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImplicitCurveGraphToolComponent } from './implicit-curve-graph-tool.component';

describe('ImplicitCurveGraphToolComponent', () => {
  let component: ImplicitCurveGraphToolComponent;
  let fixture: ComponentFixture<ImplicitCurveGraphToolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImplicitCurveGraphToolComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ImplicitCurveGraphToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
