import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectListBackComponent } from './project-list-back.component';

describe('ProjectListBackComponent', () => {
  let component: ProjectListBackComponent;
  let fixture: ComponentFixture<ProjectListBackComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectListBackComponent]
    });
    fixture = TestBed.createComponent(ProjectListBackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
