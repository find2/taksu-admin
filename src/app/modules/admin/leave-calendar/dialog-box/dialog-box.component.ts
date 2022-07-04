import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'app-dialog-box',
    templateUrl: './dialog-box.component.html',
    styleUrls: ['./dialog-box.component.scss'],
})
export class DialogBoxComponent implements OnInit {

    localData: any;
    id: string;
    employeeName: string;
    startLeaveDate: string;
    endLeaveDate: string;
    fullDayLeave: boolean;
    endLeaveTime: string;
    startLeaveTime: string;
    leaveType: string;
    description: string;
    status: string;
    picture: string;

    constructor(
        public dialogRef: MatDialogRef<DialogBoxComponent>,
        private _sanitize: DomSanitizer,
        //@Optional() is used to prevent error if no data is passed
        @Optional() @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.localData = {
            ...data,
        };
    }

    ngOnInit(): void {
        this.description = this.localData.description;
        this.employeeName = this.localData.employeeName;
        this.endLeaveDate = this.localData.endLeaveDate;
        this.startLeaveDate = this.localData.startLeaveDate;
        this.endLeaveTime = this.localData.endLeaveTime;
        this.startLeaveTime = this.localData.startLeaveTime;
        this.fullDayLeave = this.localData.fullDayLeave;
        this.id = this.localData.id;
        this.leaveType = this.localData.leaveType;
        this.picture = this.localData.picture;
        this.status = this.localData.status;
    }
}
