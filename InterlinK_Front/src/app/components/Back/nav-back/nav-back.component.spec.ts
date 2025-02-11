import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavBackComponent } from './nav-back.component';

describe('NavBackComponent', () => {
  let component: NavBackComponent;
  let fixture: ComponentFixture<NavBackComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NavBackComponent]
    });
    fixture = TestBed.createComponent(NavBackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
