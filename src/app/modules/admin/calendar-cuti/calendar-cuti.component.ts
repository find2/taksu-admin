import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import { CalendarEvent, CalendarView } from 'angular-calendar';

@Component({
  selector: 'app-calendar-cuti',
  templateUrl: './calendar-cuti.component.html',
  styleUrls: ['./calendar-cuti.component.scss'],

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarCutiComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  view: CalendarView = CalendarView.Month;

  viewDate: Date = new Date();

  events: CalendarEvent[] = [];

  changeDay(date: Date) {
    this.viewDate = date;
    this.view = CalendarView.Day;
  }

}
