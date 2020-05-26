import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectDeleteFormComponent } from './project-delete-form.component';

describe('ProjectDeleteFormComponent', () => {
  let component: ProjectDeleteFormComponent;
  let fixture: ComponentFixture<ProjectDeleteFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectDeleteFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectDeleteFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
