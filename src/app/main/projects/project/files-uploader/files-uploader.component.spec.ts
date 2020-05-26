import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilesUploaderComponent } from './files-uploader.component';

describe('FilesUploaderComponent', () => {
  let component: FilesUploaderComponent;
  let fixture: ComponentFixture<FilesUploaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilesUploaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilesUploaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
