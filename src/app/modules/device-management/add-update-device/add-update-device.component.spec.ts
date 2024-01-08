import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateDeviceComponent } from './add-update-device.component';

describe('AddUpdateDeviceComponent', () => {
  let component: AddUpdateDeviceComponent;
  let fixture: ComponentFixture<AddUpdateDeviceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUpdateDeviceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddUpdateDeviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
