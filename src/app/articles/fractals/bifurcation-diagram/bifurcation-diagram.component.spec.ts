import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BifurcationDiagramComponent } from './bifurcation-diagram.component';

describe('BifurcationDiagramComponent', () => {
  let component: BifurcationDiagramComponent;
  let fixture: ComponentFixture<BifurcationDiagramComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BifurcationDiagramComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BifurcationDiagramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
