import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OurAdvocates } from './our-advocates';

describe('OurAdvocates', () => {
  let component: OurAdvocates;
  let fixture: ComponentFixture<OurAdvocates>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OurAdvocates],
    }).compileComponents();

    fixture = TestBed.createComponent(OurAdvocates);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
