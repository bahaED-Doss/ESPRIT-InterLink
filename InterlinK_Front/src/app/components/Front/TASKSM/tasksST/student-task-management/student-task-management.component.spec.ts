import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentTaskManagementComponent } from './student-task-management.component';

describe('StudentTaskManagementComponent', () => {
  let component: StudentTaskManagementComponent;
  let fixture: ComponentFixture<StudentTaskManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StudentTaskManagementComponent]
    });
    fixture = TestBed.createComponent(StudentTaskManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
