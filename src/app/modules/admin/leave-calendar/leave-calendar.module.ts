import { CalendarHeaderModule } from './calendar-header/calendar-header.module';
import { LeaveCalendarComponent } from './leave-calendar.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';

import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

const leaveCalendarRoutes: Route[] = [
  {
      path: '',
      component: LeaveCalendarComponent,
  },
];

@NgModule({
  declarations: [
    LeaveCalendarComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(leaveCalendarRoutes),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    CalendarHeaderModule
  ]
})
export class LeaveCalendarModule { }
