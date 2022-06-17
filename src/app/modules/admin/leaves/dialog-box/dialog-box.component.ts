import {
    Component,
    OnInit,
    Inject,
    Optional
} from '@angular/core'
import {
    MatDialogRef,
    MAT_DIALOG_DATA
} from '@angular/material/dialog'
import {
    FormControl,
    FormGroup,
    Validators
} from '@angular/forms'

@Component({
    selector: 'app-dialog-box',
    templateUrl: './dialog-box.component.html',
    styleUrls: ['./dialog-box.component.scss']
})
export class DialogBoxComponent implements OnInit {
    action: string
    local_data: any

    leavesForm: FormGroup
    id: FormControl
    startLeaveDate: FormControl
    endLeaveDate: FormControl
    startLeaveTime: FormControl
    endLeaveTime: FormControl
    fullDayLeave: FormControl
    leaveType: FormControl
    assignTo: FormControl

    minDate: Date

    employeeData = JSON.parse(localStorage.getItem('allEmployees')) || []

    fullDay: Boolean = false
    minEndLeaveTime = "08:00"

    leaveTypeData = [{
            code: 'annual-leave',
            name: "Annual Leave"
        },
        {
            code: 'unpaid-leave',
            name: "Unpaid Leave"
        },
        {
            code: 'sick-leave',
            name: "Sick Leave"
        },
        {
            code: 'complementary-leave',
            name: "Complementary Leave"
        }
    ]

    placeHolderEndTime : string

    isValidFormSubmitted = null

    constructor(
        public dialogRef: MatDialogRef < DialogBoxComponent > ,
        //@Optional() is used to prevent error if no data is passed
        @Optional() @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.createFormControls()
        this.createFormGroup()
        this.local_data = {
            ...data
        }
        this.action = this.local_data.action

        const currentDate = new Date()
        this.minDate = new Date(currentDate)
    }

    ngOnInit(): void {
        this.createFormControls()
        this.createFormGroup()

        // set input field value for update
        if (this.action == 'Update') {
            let dataObj: {} = {
                id: this.local_data.id,
                startLeaveDate: this.local_data.startLeaveDate,
                endLeaveDate: this.local_data.endLeaveDate,
                fullDayLeave: this.local_data.fullDayLeave,
                leaveType: this.local_data.leaveType,
                assignTo: this.local_data.assignTo,
            }

            if (this.local_data.fullDayLeave) {
                dataObj = {
                    ...dataObj,
                    startLeaveTime: "",
                    endLeaveTime: ""
                }
            } else {
                dataObj = {
                    ...dataObj,
                    startLeaveTime: this.local_data.startLeaveTime,
                    endLeaveTime: this.local_data.endLeaveTime
                }
                this.placeHolderEndTime = this.local_data.endLeaveTime
            }

            this.leavesForm.setValue(dataObj)

        }

    }

    createFormGroup() {
        this.leavesForm = new FormGroup({
            id: this.id,
            startLeaveDate: this.startLeaveDate,
            endLeaveDate: this.endLeaveDate,
            startLeaveTime: this.startLeaveTime,
            endLeaveTime: this.endLeaveTime,
            fullDayLeave: this.fullDayLeave,
            leaveType: this.leaveType,
            assignTo: this.assignTo,
        })
    }

    // create form controls
    createFormControls() {
        this.id = new FormControl('', [Validators.required])
        this.startLeaveDate = new FormControl('', [Validators.required])
        this.endLeaveDate = new FormControl('', [Validators.required])
        this.startLeaveTime = new FormControl('', [Validators.required])
        this.endLeaveTime = new FormControl('', [Validators.required])
        this.fullDayLeave = new FormControl('', [Validators.required])
        this.leaveType = new FormControl('', [Validators.required])
        this.assignTo = new FormControl('unasigned')
    }

    get randomId() {
        return 'LVE-' + Math.floor(Math.random() * 1000 + 1)
    }

    get getStartLeaveDate() {
        return this.leavesForm.get('startLeaveDate')
    }

    get getStartLeaveTime() {
        return this.startLeaveTime.get('startLeaveTime')
    }

    get getEndLeaveTime() {
        return this.startLeaveTime.get('endLeaveTime')
    }

    get getEndLeaveDate() {
        return this.leavesForm.get('endLeaveDate')
    }

    get leaveAssignTo() {
        return this.leavesForm.get('assignTo')
    }

    get getLeaveType() {
        return this.leavesForm.get('leaveType')
    }

    get getFullDayLeave(): Boolean {
        this.fullDay = (!this.leavesForm.get('fullDayLeave').value) ? false : true
        return this.fullDay
    }

    setMinStartTime(data: any): void {
        this.minEndLeaveTime = data
    }

    doAction() {
        switch (this.action) {
            case 'Add':
                this.isValidFormSubmitted = false

                if (this.getFullDayLeave) {
                    this.leavesForm.patchValue({
                        id: this.randomId,
                        fullDayLeave: this.getFullDayLeave,
                        startLeaveTime: "08:00",
                        endLeaveTime: "17:00"
                    })
                } else {
                    this.leavesForm.patchValue({
                        id: this.randomId,
                        fullDayLeave: this.getFullDayLeave,
                        endLeaveDate: this.getStartLeaveDate.value,
                    })
                }

                if (this.leavesForm.invalid) {
                    this.isValidFormSubmitted = false
                    console.log("Form Invalid!")

                    // Debuggin the cause of invalidity
                    let daInvalid = []
                    const controls = this.leavesForm.controls

                    for (const name in controls) {
                        if (controls[name].invalid) {
                            daInvalid.push(name)
                        }
                    }
                    console.log(daInvalid)

                } else if (this.leavesForm.valid) {
                    this.isValidFormSubmitted = true
                    this.local_data = {
                        ...this.leavesForm.value
                    }
                    console.log("local data imported")
                    var existingLeaves = JSON.parse(
                        localStorage.getItem('allEmployees')
                    )
                    if (existingLeaves == null) existingLeaves = []

                    this.dialogRef.close({
                        event: this.action,
                        data: this.local_data,
                    })
                }

                break
            case 'Update':
                console.log('update jalan: ')
                this.isValidFormSubmitted = false

                if (this.getFullDayLeave) {
                    this.leavesForm.patchValue({
                        fullDayLeave: this.getFullDayLeave,
                        startLeaveTime: "08:00",
                        endLeaveTime: "17:00"
                    })
                } else {
                    this.leavesForm.patchValue({
                        fullDayLeave: this.getFullDayLeave,
                        endLeaveDate: this.getStartLeaveDate.value,
                    })
                }

                if (this.leavesForm.invalid) {
                    this.isValidFormSubmitted = false
                    console.log("sayang sekali!")
                    const daInvalid = []
                    const controls = this.leavesForm.controls
                    for (const name in controls) {
                        if (controls[name].invalid) {
                            daInvalid.push(name)
                        }
                    }
                    console.log(daInvalid)
                } else if (this.leavesForm.valid) {
                    this.isValidFormSubmitted = true
                    this.local_data = {
                      ...this.leavesForm.value
                    }
                    var existingLeaves = JSON.parse(
                        localStorage.getItem('allEmployees')
                    )
                    if (existingLeaves == null) existingLeaves = []

                    this.dialogRef.close({
                        event: this.action,
                        data: this.local_data,
                    })
                }

                break

            default:
                console.log("asdasdasd")
                this.dialogRef.close({
                  event: 'Cancel'
                })
                break
        }
    }

    closeDialog() {
        this.dialogRef.close({
            event: 'Cancel'
        })
    }
}
