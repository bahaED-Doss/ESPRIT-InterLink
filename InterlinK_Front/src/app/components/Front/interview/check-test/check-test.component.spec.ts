import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckTestComponent } from './check-test.component';

describe('CheckTestComponent', () => {
  let component: CheckTestComponent;
  let fixture: ComponentFixture<CheckTestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CheckTestComponent]
    });
    fixture = TestBed.createComponent(CheckTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
