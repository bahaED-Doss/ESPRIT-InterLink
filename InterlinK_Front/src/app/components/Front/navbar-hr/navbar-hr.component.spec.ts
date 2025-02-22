import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarHrComponent } from './navbar-hr.component';

describe('NavbarHrComponent', () => {
  let component: NavbarHrComponent;
  let fixture: ComponentFixture<NavbarHrComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NavbarHrComponent]
    });
    fixture = TestBed.createComponent(NavbarHrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
