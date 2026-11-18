import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThirdSection } from './third-section';

describe('ThirdSection', () => {
  let component: ThirdSection;
  let fixture: ComponentFixture<ThirdSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThirdSection],
    }).compileComponents();

    fixture = TestBed.createComponent(ThirdSection);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
