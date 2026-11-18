import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultationAudio } from './consultation-audio';

describe('ConsultationAudio', () => {
  let component: ConsultationAudio;
  let fixture: ComponentFixture<ConsultationAudio>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultationAudio],
    }).compileComponents();

    fixture = TestBed.createComponent(ConsultationAudio);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
