import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangepasswordsComponent } from './changepasswords.component';

describe('ChangepasswordsComponent', () => {
  let component: ChangepasswordsComponent;
  let fixture: ComponentFixture<ChangepasswordsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChangepasswordsComponent]
    });
    fixture = TestBed.createComponent(ChangepasswordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
