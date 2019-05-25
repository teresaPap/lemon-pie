import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavAsideComponent } from './nav-aside.component';

describe('NavAsideComponent', () => {
  let component: NavAsideComponent;
  let fixture: ComponentFixture<NavAsideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavAsideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavAsideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
