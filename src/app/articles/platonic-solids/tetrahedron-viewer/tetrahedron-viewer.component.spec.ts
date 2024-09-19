import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TetrahedronViewerComponent } from './tetrahedron-viewer.component';

describe('TetrahedronViewerComponent', () => {
  let component: TetrahedronViewerComponent;
  let fixture: ComponentFixture<TetrahedronViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TetrahedronViewerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TetrahedronViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
