import { Component, OnInit, Inject, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-dialog-assets',
    templateUrl: './dialog-assets.component.html',
    styleUrls: ['./dialog-assets.component.scss'],
})
export class DialogAssetsComponent implements OnInit {
    action: string;
    local_data: any;

    assetsForm: FormGroup;
    id: FormControl;
    code: FormControl;
    name: FormControl;
    dateRegister: FormControl;
    model: FormControl;
    serialNumber: FormControl;
    assignTo: FormControl;
    status: FormControl;

    minDate: Date;

    employeeData = JSON.parse(localStorage.getItem('allEmployees')) || [];

    isValidFormSubmitted = null;

    constructor(
        public dialogRef: MatDialogRef<DialogAssetsComponent>,
        //@Optional() is used to prevent error if no data is passed
        @Optional() @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.createFormControls();
        this.createFormGroup();
        this.local_data = { ...data };
        this.action = this.local_data.action;

        const currentDate = new Date();
        this.minDate = new Date(currentDate);
    }
    ngOnInit(): void {
        this.createFormControls();
        this.createFormGroup();
        // set input field value for update
        if (this.action == 'Update') {
            this.assetsForm.setValue({
                id: this.local_data.id,
                code: this.local_data.code,
                name: this.local_data.name,
                dateRegister: this.local_data.dateRegister,
                model: this.local_data.model,
                serialNumber: this.local_data.serialNumber,
                assignTo: this.local_data.assignTo,
                status: this.local_data.status,
            });
        }
    }
    // create form group
    createFormGroup() {
        this.assetsForm = new FormGroup({
            id: this.id,
            code: this.code,
            name: this.name,
            dateRegister: this.dateRegister,
            model: this.model,
            serialNumber: this.serialNumber,
            assignTo: this.assignTo,
            status: this.status,
        });
    }
    // create form controls
    createFormControls() {
        this.id = new FormControl('', [Validators.required]);
        this.code = new FormControl('', [Validators.required]);
        this.name = new FormControl('', [Validators.required]);
        this.dateRegister = new FormControl('', [Validators.required]);
        this.model = new FormControl('', [Validators.required]);
        this.serialNumber = new FormControl('', [Validators.required]);
        this.assignTo = new FormControl('unasigned');
        this.status = new FormControl('', [Validators.required]);
    }

    // Getter for form control
    get assetCode() {
        return this.assetsForm.get('code');
    }

    get assetName() {
        return this.assetsForm.get('name');
    }

    get assetDateRegister() {
        return this.assetsForm.get('dateRegister');
    }
    get assetModel() {
        return this.assetsForm.get('model');
    }
    get assetSerialNumber() {
        return this.assetsForm.get('serialNumber');
    }
    get assetAssignTo() {
        return this.assetsForm.get('assignTo');
    }

    get assetStatus() {
        return this.assetsForm.get('status');
    }

    get randomId() {
        return 'AST-' + Math.floor(Math.random() * 1000 + 1);
    }

    // form on submit
    doAction() {
        if (this.action == 'Add') {
            this.isValidFormSubmitted = false;
            this.assetsForm.patchValue({
                id: this.randomId,
            });
            if (this.assetsForm.invalid) {
                this.isValidFormSubmitted = false;
                // console.log(this.assetsForm.value);
            } else if (this.assetsForm.valid) {
                this.isValidFormSubmitted = true;
                this.local_data = { ...this.assetsForm.value };
                var existingAssets = JSON.parse(
                    localStorage.getItem('allEmployees')
                );
                if (existingAssets == null) existingAssets = [];

                this.dialogRef.close({
                    event: this.action,
                    data: this.local_data,
                });
            }
        } else if (this.action == 'Update') {
            this.isValidFormSubmitted = false;
            this.assetsForm.patchValue({
                id: this.local_data.id,
            });
            if (this.assetsForm.invalid) {
                this.isValidFormSubmitted = false;
                // console.log(this.assetsForm.value);
            } else if (this.assetsForm.valid) {
                this.isValidFormSubmitted = true;
                this.local_data = { ...this.assetsForm.value };
                var existingAssets = JSON.parse(
                    localStorage.getItem('allEmployees')
                );
                if (existingAssets == null) existingAssets = [];

                this.dialogRef.close({
                    event: this.action,
                    data: this.local_data,
                });
            }
        }
    }

    // form on cancel
    closeDialog() {
        this.dialogRef.close({ event: 'Cancel' });
    }
}
