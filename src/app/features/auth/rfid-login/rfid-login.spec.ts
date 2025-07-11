import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RfidLogin } from './rfid-login';

describe('RfidLogin', () => {
  let component: RfidLogin;
  let fixture: ComponentFixture<RfidLogin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RfidLogin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RfidLogin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
