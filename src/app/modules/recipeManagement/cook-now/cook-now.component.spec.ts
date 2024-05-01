import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CookNowComponent } from './cook-now.component';

describe('CookNowComponent', () => {
  let component: CookNowComponent;
  let fixture: ComponentFixture<CookNowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CookNowComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CookNowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
