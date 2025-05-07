import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SociallinkshrComponent } from './sociallinkshr.component';

describe('SociallinkshrComponent', () => {
  let component: SociallinkshrComponent;
  let fixture: ComponentFixture<SociallinkshrComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SociallinkshrComponent]
    });
    fixture = TestBed.createComponent(SociallinkshrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
