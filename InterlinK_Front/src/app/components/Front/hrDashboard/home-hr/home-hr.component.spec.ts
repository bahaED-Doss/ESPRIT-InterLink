import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeHrComponent } from './home-hr.component';

describe('HomeHrComponent', () => {
  let component: HomeHrComponent;
  let fixture: ComponentFixture<HomeHrComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HomeHrComponent]
    });
    fixture = TestBed.createComponent(HomeHrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
