import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyListBackComponent } from './company-list-back.component';

describe('CompanyListBackComponent', () => {
  let component: CompanyListBackComponent;
  let fixture: ComponentFixture<CompanyListBackComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CompanyListBackComponent]
    });
    fixture = TestBed.createComponent(CompanyListBackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
