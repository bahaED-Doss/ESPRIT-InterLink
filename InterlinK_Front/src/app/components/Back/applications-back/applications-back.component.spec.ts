import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationsBackComponent } from './applications-back.component';

describe('ApplicationsBackComponent', () => {
  let component: ApplicationsBackComponent;
  let fixture: ComponentFixture<ApplicationsBackComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ApplicationsBackComponent]
    });
    fixture = TestBed.createComponent(ApplicationsBackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
