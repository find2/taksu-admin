import { Component, ElementRef, Inject, OnInit, Optional, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
    selector: 'app-dialog-box',
    templateUrl: './dialog-box.component.html',
    styleUrls: ['./dialog-box.component.scss'],
})
export class DialogBoxComponent implements OnInit {

    @ViewChild('filePickerInput') filePickerVariable: ElementRef;

    action: string;
    localData: any;

    leavesForm: FormGroup;
    id: FormControl;
    startLeaveDate: FormControl;
    endLeaveDate: FormControl;
    startLeaveTime: FormControl;
    endLeaveTime: FormControl;
    fullDayLeave: FormControl;
    leaveType: FormControl;
    employeeId: FormControl;
    description: FormControl;
    status: FormControl;
    picture: FormControl;

    minDate: Date;

    fullDay: boolean = false;
    minEndLeaveTime = '08:00';
    invalidDateDuration = false;

    leaveTypeData = [
        {
            code: 'annual',
            name: 'Annual Leave',
        },
        {
            code: 'sick',
            name: 'Sick Leave',
        },
        {
            code: 'emergency',
            name: 'Emergency Leave',
        },
    ];

    placeHolderEndTime: string;
    isValidFormSubmitted = null;
    isValidPicture = null;

    private base64textString: string = null;

    constructor(
        public dialogRef: MatDialogRef<DialogBoxComponent>,
        private _sanitize: DomSanitizer,
        //@Optional() is used to prevent error if no data is passed
        @Optional() @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.createFormControls();
        this.createFormGroup();
        this.localData = {
            ...data,
        };
        this.action = this.localData.action;

        const currentDate = new Date();
        this.minDate = new Date(currentDate);
    }

    get randomId() {
        return 'LVE-' + Math.floor(Math.random() * 1000 + 1);
    }

    get getStartLeaveDate() {
        return this.leavesForm.get('startLeaveDate');
    }

    get getStartLeaveTime() {
        return this.startLeaveTime.get('startLeaveTime');
    }

    get getEndLeaveTime() {
        return this.startLeaveTime.get('endLeaveTime');
    }

    get getEndLeaveDate() {
        return this.leavesForm.get('endLeaveDate');
    }

    get getLeaveType() {
        return this.leavesForm.get('leaveType');
    }

    get getDescription() {
        return this.leavesForm.get('description');
    }

    get getFullDayLeave() {
        this.fullDay = (!this.leavesForm.get('fullDayLeave').value) ? false : true;
        return this.fullDay;
    }

    get getEmployeeId() {
        return localStorage.getItem('userId') || '';
    }

    ngOnInit(): void {
        this.createFormControls();
        this.createFormGroup();

        // set input field value for update
        if (this.action === 'Update') {
            setTimeout(() => {
                let dataObj: {} = {
                    id: this.localData.id,
                    startLeaveDate: this.localData.startLeaveDate,
                    endLeaveDate: this.localData.endLeaveDate,
                    fullDayLeave: this.localData.fullDayLeave,
                    leaveType: this.localData.leaveType,
                    employeeId: this.localData.employeeId,
                    description: this.localData.description,
                    status: this.localData.status,
                    picture: this.localData.picture,
                };

                if (this.localData.fullDayLeave) {
                    dataObj = {
                        ...dataObj,
                        startLeaveTime: '',
                        endLeaveTime: ''
                    };
                } else {
                    dataObj = {
                        ...dataObj,
                        startLeaveTime: this.localData.startLeaveTime,
                        endLeaveTime: this.localData.endLeaveTime
                    };
                    this.placeHolderEndTime = this.localData.endLeaveTime;
                }
                this.leavesForm.setValue(dataObj);
            }, 500);
        }
    }

    createFormControls(): void {
        this.id = new FormControl('', [Validators.required]);
        this.startLeaveDate = new FormControl('', [Validators.required]);
        this.endLeaveDate = new FormControl('', [Validators.required]);
        this.startLeaveTime = new FormControl('', [Validators.required]);
        this.endLeaveTime = new FormControl('', [Validators.required]);
        this.fullDayLeave = new FormControl('', [Validators.required]);
        this.leaveType = new FormControl('', [Validators.required]);
        this.employeeId = new FormControl('', [Validators.required]);
        this.description = new FormControl('', [Validators.required]);
        this.status = new FormControl('', [Validators.required]);
        this.picture = new FormControl('');
    }

    createFormGroup(): void {
        this.leavesForm = new FormGroup({
            id: this.id,
            startLeaveDate: this.startLeaveDate,
            endLeaveDate: this.endLeaveDate,
            startLeaveTime: this.startLeaveTime,
            endLeaveTime: this.endLeaveTime,
            fullDayLeave: this.fullDayLeave,
            leaveType: this.leaveType,
            employeeId: this.employeeId,
            description: this.description,
            status: this.status,
            picture: this.picture
        });
    }

    setMinStartTime(data: any): void {
        this.minEndLeaveTime = data;
    }

    // Convert base64 to image
    convertImage(image): SafeUrl {
        return this._sanitize.bypassSecurityTrustUrl(
            'data:image/jpg;base64,' + image
        );
    }
    // handle file input
    handleFileSelect(evt): void {
        const files = evt.target.files;
        const file = files[0];

        if (files && file) {
            const reader = new FileReader();

            reader.onload = this._handleReaderLoaded.bind(this);

            reader.readAsBinaryString(file);
        }
    }

    _handleReaderLoaded(readerEvt): void {
        const binaryString = readerEvt.target.result;
        this.base64textString = btoa(binaryString);
    }
    // clear image input
    handleClearImage(): void {
        this.filePickerVariable.nativeElement.value = null;
    }

    doAction(): void {
        this.invalidDateDuration = false;
        if (this.getEmployeeId === '') {
            console.log('EmployeeId Not Found');
            this.isValidFormSubmitted = false;
            this.closeDialog();
            return;
        }
        console.log(this.getStartLeaveDate.value);
        const date1 = new Date();
        const date2 = new Date(this.getStartLeaveDate.value);
        console.log(date2.getTime(), date1.getTime());
        const diffDays = Math.round((date2.getTime() - date1.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays < 14 && this.getLeaveType.value === 'annual') {
            console.log('Return');
            this.invalidDateDuration = true;
            return;
        }
        if (this.getTotalLeaves() >= 14 && this.getLeaveType.value === 'annual') {
            console.log('Return Total');
            this.invalidDateDuration = true;
            return;
        }
        switch (this.action) {
            case 'Add':
                this.isValidFormSubmitted = false;

                if (this.getFullDayLeave) {
                    this.leavesForm.patchValue({
                        id: this.randomId,
                        fullDayLeave: this.getFullDayLeave,
                        startLeaveTime: '08:00',
                        endLeaveTime: '17:00',
                        status: 'unapprove',
                        employeeId: this.getEmployeeId,
                        picture: this.base64textString
                    });
                } else {
                    this.leavesForm.patchValue({
                        id: this.randomId,
                        fullDayLeave: this.getFullDayLeave,
                        endLeaveDate: this.getStartLeaveDate.value,
                        status: 'unapprove',
                        employeeId: this.getEmployeeId,
                        picture: this.base64textString
                    });
                }

                if (this.leavesForm.invalid) {
                    this.isValidFormSubmitted = false;
                    console.log('Form Invalid!');

                    // Debuggin the cause of invalidity
                    const daInvalid = [];
                    const controls = this.leavesForm.controls;

                    for (const name in controls) {
                        if (controls[name].invalid) {
                            daInvalid.push(name);
                        }
                    }
                    console.log(daInvalid);

                } else if (this.leavesForm.valid) {
                    this.isValidFormSubmitted = true;
                    this.localData = {
                        ...this.leavesForm.value
                    };
                    console.log('local data imported');
                    let existingLeaves = JSON.parse(
                        localStorage.getItem('allLeaves')
                    );
                    if (existingLeaves == null) {
                        existingLeaves = [];
                    }

                    this.dialogRef.close({
                        event: this.action,
                        data: this.localData,
                    });
                    this.handleClearImage();
                }

                break;
            case 'Update':
                this.isValidFormSubmitted = false;

                if (this.getFullDayLeave) {
                    this.leavesForm.patchValue({
                        fullDayLeave: this.getFullDayLeave,
                        startLeaveTime: '08:00',
                        endLeaveTime: '17:00',
                        picture:
                        this.base64textString == null
                            ? this.localData.picture
                            : this.base64textString,
                    });
                } else {
                    this.leavesForm.patchValue({
                        fullDayLeave: this.getFullDayLeave,
                        endLeaveDate: this.getStartLeaveDate.value,
                        picture:
                        this.base64textString == null
                            ? this.localData.picture
                            : this.base64textString,
                    });
                }

                if (this.leavesForm.invalid) {
                    this.isValidFormSubmitted = false;
                    console.log('Form invalid!');
                    const daInvalid = [];
                    const controls = this.leavesForm.controls;
                    for (const name in controls) {
                        if (controls[name].invalid) {
                            daInvalid.push(name);
                        }
                    }
                    console.log(daInvalid);
                } else if (this.leavesForm.valid) {
                    this.isValidFormSubmitted = true;
                    this.localData = {
                      ...this.leavesForm.value
                    };
                    let existingLeaves = JSON.parse(
                        localStorage.getItem('allLeaves')
                    );
                    if (existingLeaves == null) {
                        existingLeaves = [];
                    }

                    this.dialogRef.close({
                        event: this.action,
                        data: this.localData,
                    });
                    this.handleClearImage();
                }

                break;

            default:
                console.log('Case Not Found');
                this.dialogRef.close({
                  event: 'Cancel'
                });
                break;
        }
    }

    closeDialog(): void {
        this.dialogRef.close({
            event: 'Cancel'
        });
    }

    getTotalLeaves(): any {
        const allLeaves = JSON.parse(localStorage.getItem('allLeaves'));
        const userId = localStorage.getItem('userId') || '';
        if (userId === '') {
            return 14;
        }
        const filterLeaves = allLeaves.filter(leave => leave.employeeId === userId && leave.leaveType === 'annual');
        return filterLeaves.length;
    }
}
