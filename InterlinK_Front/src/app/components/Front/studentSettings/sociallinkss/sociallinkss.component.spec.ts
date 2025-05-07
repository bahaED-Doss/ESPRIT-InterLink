import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SociallinkssComponent } from './sociallinkss.component';

describe('SociallinkssComponent', () => {
  let component: SociallinkssComponent;
  let fixture: ComponentFixture<SociallinkssComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SociallinkssComponent]
    });
    fixture = TestBed.createComponent(SociallinkssComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
