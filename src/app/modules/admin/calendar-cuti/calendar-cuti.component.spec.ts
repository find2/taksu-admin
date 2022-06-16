import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarCutiComponent } from './calendar-cuti.component';

describe('CalendarCutiComponent', () => {
  let component: CalendarCutiComponent;
  let fixture: ComponentFixture<CalendarCutiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalendarCutiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarCutiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
