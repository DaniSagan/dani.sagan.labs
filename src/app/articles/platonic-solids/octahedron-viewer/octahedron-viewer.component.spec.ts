import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OctahedronViewerComponent } from './octahedron-viewer.component';

describe('OctahedronViewerComponent', () => {
  let component: OctahedronViewerComponent;
  let fixture: ComponentFixture<OctahedronViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OctahedronViewerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OctahedronViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
