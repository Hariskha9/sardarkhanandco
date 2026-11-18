import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InPersonConsultation } from './in-person-consultation';

describe('InPersonConsultation', () => {
  let component: InPersonConsultation;
  let fixture: ComponentFixture<InPersonConsultation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InPersonConsultation],
    }).compileComponents();

    fixture = TestBed.createComponent(InPersonConsultation);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
