import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Dispensation } from './dispensation';

describe('Dispensation', () => {
  let component: Dispensation;
  let fixture: ComponentFixture<Dispensation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Dispensation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Dispensation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
