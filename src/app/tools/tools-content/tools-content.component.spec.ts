import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolsContentComponent } from './tools-content.component';
import { ActivatedRoute } from '@angular/router';

const fakeActivatedRoute = {
  snapshot: { data: { } }
} as ActivatedRoute;

describe('ToolsContentComponent', () => {
  let component: ToolsContentComponent;
  let fixture: ComponentFixture<ToolsContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToolsContentComponent],
      providers: [{provide: ActivatedRoute, useValue: fakeActivatedRoute}]
    }).compileComponents();

    fixture = TestBed.createComponent(ToolsContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
