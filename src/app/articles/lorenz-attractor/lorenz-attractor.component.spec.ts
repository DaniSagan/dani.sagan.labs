import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LorenzAttractorComponent } from './lorenz-attractor.component';

describe('LorenzAttractorComponent', () => {
  let component: LorenzAttractorComponent;
  let fixture: ComponentFixture<LorenzAttractorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LorenzAttractorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LorenzAttractorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
