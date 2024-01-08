import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MappedDevicesComponent } from './mapped-devices.component';

describe('MappedDevicesComponent', () => {
  let component: MappedDevicesComponent;
  let fixture: ComponentFixture<MappedDevicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MappedDevicesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MappedDevicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
