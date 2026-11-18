import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Sardarmonograph } from './sardarmonograph';

describe('Sardarmonograph', () => {
  let component: Sardarmonograph;
  let fixture: ComponentFixture<Sardarmonograph>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Sardarmonograph],
    }).compileComponents();

    fixture = TestBed.createComponent(Sardarmonograph);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
