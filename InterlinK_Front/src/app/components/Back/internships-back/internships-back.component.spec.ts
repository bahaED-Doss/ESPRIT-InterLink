import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternshipsBackComponent } from './internships-back.component';

describe('InternshipsBackComponent', () => {
  let component: InternshipsBackComponent;
  let fixture: ComponentFixture<InternshipsBackComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InternshipsBackComponent]
    });
    fixture = TestBed.createComponent(InternshipsBackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
