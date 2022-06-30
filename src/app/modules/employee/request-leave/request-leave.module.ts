import { DialogBoxComponent } from './dialog-box/dialog-box.component';
import { RequestLeaveComponent } from './request-leave.component';
import { Route, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatMomentDateModule, MomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { FuseAlertModule } from '@fuse/components/alert';
import { FuseHighlightModule } from '@fuse/components/highlight';
import { TranslocoModule } from '@ngneat/transloco';
import { SharedModule } from 'app/shared/shared.module';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { CUSTOM_DATE_FORMATS } from 'app/app.date-format';

const leaveRoutes: Route[] = [
    {
        path: '',
        component: RequestLeaveComponent,
    },
  ];

  @NgModule({
    declarations: [
      RequestLeaveComponent,
      DialogBoxComponent
    ],
    imports: [
      CommonModule,
      RouterModule.forChild(leaveRoutes),
      TranslocoModule,
      MatDialogModule,
      MatButtonModule,
      MatButtonToggleModule,
      MatChipsModule,
      MatDatepickerModule,
      MatDividerModule,
      MatFormFieldModule,
      MatIconModule,
      MatInputModule,
      MatMenuModule,
      MatMomentDateModule,
      MatSelectModule,
      FuseHighlightModule,
      SharedModule,
      MatTableModule,
      FuseAlertModule,
      MatSortModule,
      MatPaginatorModule,
      MatCheckboxModule,
      // Moment Date Formatter
      MomentDateModule,
      NgxMaterialTimepickerModule
    ],
    providers: [
      { provide: MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS }
    ],
  })
  export class RequestLeavesModule { }
