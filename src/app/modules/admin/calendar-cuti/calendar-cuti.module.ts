import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarCutiComponent } from './calendar-cuti.component';
import { Route, RouterModule } from '@angular/router';

import { CalendarModule, DateAdapter } from 'angular-calendar';
// import { DemoUtilsModule } from '../demo-utils/module';
import { CalendarHeaderModule} from './calendar-header/calendar-header.module'
// import { DemoComponent } from './component';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

const calendarCutiRoutes: Route[] = [
  {
      path: '',
      component: CalendarCutiComponent,
  },
];

@NgModule({
  declarations: [
    CalendarCutiComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(calendarCutiRoutes),

    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    CalendarHeaderModule,
  ]
})
export class CalendarCutiModule { }
