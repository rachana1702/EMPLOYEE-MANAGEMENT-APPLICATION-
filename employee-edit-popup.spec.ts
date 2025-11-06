import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeEditPopup } from './employee-edit-popup';

describe('EmployeeEditPopup', () => {
  let component: EmployeeEditPopup;
  let fixture: ComponentFixture<EmployeeEditPopup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeEditPopup]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeEditPopup);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
