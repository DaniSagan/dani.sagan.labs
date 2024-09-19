import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DodecahedronViewerComponent } from './dodecahedron-viewer.component';

describe('DodecahedronViewerComponent', () => {
  let component: DodecahedronViewerComponent;
  let fixture: ComponentFixture<DodecahedronViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DodecahedronViewerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DodecahedronViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
