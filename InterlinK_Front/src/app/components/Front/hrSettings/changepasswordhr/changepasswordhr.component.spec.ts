import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangepasswordhrComponent } from './changepasswordhr.component';

describe('ChangepasswordhrComponent', () => {
  let component: ChangepasswordhrComponent;
  let fixture: ComponentFixture<ChangepasswordhrComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChangepasswordhrComponent]
    });
    fixture = TestBed.createComponent(ChangepasswordhrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
