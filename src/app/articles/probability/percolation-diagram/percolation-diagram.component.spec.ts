import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PercolationDiagramComponent } from './percolation-diagram.component';

describe('PercolationDiagramComponent', () => {
  let component: PercolationDiagramComponent;
  let fixture: ComponentFixture<PercolationDiagramComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PercolationDiagramComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PercolationDiagramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
