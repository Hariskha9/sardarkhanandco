import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NumberBar } from './number-bar';

describe('NumberBar', () => {
  let component: NumberBar;
  let fixture: ComponentFixture<NumberBar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NumberBar],
    }).compileComponents();

    fixture = TestBed.createComponent(NumberBar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
