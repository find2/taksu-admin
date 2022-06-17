import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { LeavesComponent } from './leaves.component';
import { TranslocoModule } from '@ngneat/transloco';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { DialogBoxComponent } from './dialog-box/dialog-box.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatSelectModule } from '@angular/material/select';
import { FuseHighlightModule } from '@fuse/components/highlight';
import { SharedModule } from 'app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FuseAlertModule } from '@fuse/components/alert';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MomentDateModule } from '@angular/material-moment-adapter';
import { MAT_DATE_FORMATS } from '@angular/material/core';

import { MY_DATE_FORMATS } from '../../../my-date-formats';

const leaveRoutes: Route[] = [
  {
      path: '',
      component: LeavesComponent,
  },
];

@NgModule({
  declarations: [
    LeavesComponent,
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
    NgxMaterialTimepickerModule,
    MatCheckboxModule,

    // Moment Date Formatter
    MomentDateModule,
  ],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ],
})
export class LeavesModule { }
