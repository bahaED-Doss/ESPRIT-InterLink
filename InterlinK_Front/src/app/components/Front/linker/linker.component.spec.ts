import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LINKERComponent } from './linker.component';

describe('LINKERComponent', () => {
  let component: LINKERComponent;
  let fixture: ComponentFixture<LINKERComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LINKERComponent]
    });
    fixture = TestBed.createComponent(LINKERComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
