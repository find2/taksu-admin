import { DomSanitizer } from '@angular/platform-browser';
import {
    Component,
    OnInit,
    Inject,
    Optional,
    ElementRef,
    ViewChild,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'dialog-box-component',
    templateUrl: './dialog-box.component.html',
    styleUrls: ['./dialog-box.component.scss'],
})
export class DialogBoxComponent implements OnInit {
    action: string;
    local_data: any;

    employeeForm: FormGroup;
    id: FormControl;
    name: FormControl;
    position: FormControl;
    email: FormControl;
    address: FormControl;
    picture: FormControl;
    isValidFormSubmitted = null;
    isValidPicture = null;
    emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$';

    private base64textString: String = null;

    constructor(
        public dialogRef: MatDialogRef<DialogBoxComponent>,
        private _sanitize: DomSanitizer,
        //@Optional() is used to prevent error if no data is passed
        @Optional() @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.createFormControls();
        this.createFormGroup();
        // console.log(data);
        this.local_data = { ...data };
        this.action = this.local_data.action;
    }

    @ViewChild('myInput') myInputVariable: ElementRef;
    ngOnInit(): void {
        this.createFormControls();
        this.createFormGroup();
        // set field value for edit
        if (this.action == 'Update') {
            this.employeeForm.setValue({
                id: this.local_data.id,
                name: this.local_data.name,
                position: this.local_data.position,
                email: this.local_data.email,
                address: this.local_data.address,
                picture: this.local_data.picture,
            });
        }
    }
    // create form group
    createFormGroup() {
        this.employeeForm = new FormGroup({
            id: this.id,
            name: this.name,
            position: this.position,
            email: this.email,
            address: this.address,
            picture: this.picture,
        });
    }
    // create form controls
    createFormControls() {
        this.id = new FormControl('', Validators.required);
        this.name = new FormControl('', [
            Validators.required,
            Validators.minLength(3),
        ]);
        this.position = new FormControl('', Validators.required);
        this.email = new FormControl('', [
            Validators.required,
            Validators.pattern(this.emailPattern),
            // Validators.email,
        ]);
        this.address = new FormControl('', Validators.required);
        this.picture = new FormControl('', Validators.required);
    }

    // getter for form controls
    get nameEmployee() {
        return this.employeeForm.get('name');
    }
    get emailEmployee() {
        return this.employeeForm.get('email');
    }
    get addressEmployee() {
        return this.employeeForm.get('address');
    }
    get idEmployee() {
        return this.employeeForm.get('id');
    }
    get positionEmployee() {
        return this.employeeForm.get('position');
    }
    get randomId() {
        // Random id generator
        return 'EMP-' + Math.floor(Math.random() * 1000 + 1);
    }
    // Convert base64 to image
    convertImage(image) {
        return this._sanitize.bypassSecurityTrustUrl(
            'data:image/jpg;base64,' + image
        );
    }
    // handle file input
    handleFileSelect(evt) {
        var files = evt.target.files;
        var file = files[0];

        if (files && file) {
            var reader = new FileReader();

            reader.onload = this._handleReaderLoaded.bind(this);

            reader.readAsBinaryString(file);
        }
    }

    _handleReaderLoaded(readerEvt) {
        var binaryString = readerEvt.target.result;
        this.base64textString = btoa(binaryString);
    }
    // clear image input
    handleClearImage() {
        this.myInputVariable.nativeElement.value = null;
    }
    // form on submit
    doAction() {
        if (this.action == 'Add') {
            this.isValidFormSubmitted = false;
            this.isValidPicture = false;
            this.employeeForm.patchValue({
                id: this.randomId,
                picture: this.base64textString,
            });
            if (this.employeeForm.invalid) {
                this.isValidFormSubmitted = false;
                this.isValidPicture = false;
                // console.log(this.employeeForm.value);
            } else if (this.employeeForm.valid) {
                this.isValidPicture = true;
                this.isValidFormSubmitted = true;
                this.local_data = { ...this.employeeForm.value };
                var existingEmployees = JSON.parse(
                    localStorage.getItem('allEmployees')
                );
                if (existingEmployees == null) existingEmployees = [];

                this.dialogRef.close({
                    event: this.action,
                    data: this.local_data,
                });
                this.handleClearImage();
            }
        } else if (this.action == 'Update') {
            this.isValidFormSubmitted = false;
            this.isValidPicture = false;
            this.employeeForm.patchValue({
                id: this.data.id,
                picture:
                    this.base64textString == null
                        ? this.data.picture
                        : this.base64textString,
            });
            if (this.employeeForm.invalid) {
                this.isValidFormSubmitted = false;
                this.isValidPicture = false;
                // console.log(this.employeeForm.value);
            } else if (this.employeeForm.valid) {
                this.isValidPicture = true;
                this.isValidFormSubmitted = true;
                this.local_data = { ...this.employeeForm.value };
                var existingEmployees = JSON.parse(
                    localStorage.getItem('allEmployees')
                );
                if (existingEmployees == null) existingEmployees = [];

                this.dialogRef.close({
                    event: this.action,
                    data: this.local_data,
                });
                this.handleClearImage();
            }
        }
    }
    // form on cancel
    closeDialog() {
        this.dialogRef.close({ event: 'Cancel' });
    }
}
