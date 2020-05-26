import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlowPreviewComponent } from './flow-preview.component';

describe('FlowPreviewComponent', () => {
  let component: FlowPreviewComponent;
  let fixture: ComponentFixture<FlowPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlowPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlowPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
