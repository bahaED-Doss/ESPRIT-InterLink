import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentTaskBoardComponent } from './student-task-board.component';

describe('StudentTaskBoardComponent', () => {
  let component: StudentTaskBoardComponent;
  let fixture: ComponentFixture<StudentTaskBoardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StudentTaskBoardComponent]
    });
    fixture = TestBed.createComponent(StudentTaskBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
