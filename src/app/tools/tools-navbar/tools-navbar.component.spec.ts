import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolsNavbarComponent } from './tools-navbar.component';
import { ActivatedRoute } from '@angular/router';

const fakeActivatedRoute = {
  snapshot: { data: { } }
} as ActivatedRoute;

describe('ToolsNavbarComponent', () => {
  let component: ToolsNavbarComponent;
  let fixture: ComponentFixture<ToolsNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToolsNavbarComponent],
      providers: [{provide: ActivatedRoute, useValue: fakeActivatedRoute}]
    }).compileComponents();

    fixture = TestBed.createComponent(ToolsNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
