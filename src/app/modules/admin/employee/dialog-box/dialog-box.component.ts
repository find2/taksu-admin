import { LiveAnnouncer } from '@angular/cdk/a11y';
import { DomSanitizer } from '@angular/platform-browser';
import { MatTableDataSource } from '@angular/material/table';
import {
    Component,
    OnInit,
    Inject,
    Optional,
    ChangeDetectorRef,
    ElementRef,
    ViewChild,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
    FormControl,
    FormGroup,
    Validators,
    FormGroupDirective,
} from '@angular/forms';
@Component({
    selector: 'dialog-box-component',
    templateUrl: './dialog-box.component.html',
    styleUrls: ['./dialog-box.component.scss'],
})
export class DialogBoxComponent implements OnInit {
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

    dataSource = new MatTableDataSource(
        localStorage.getItem('allEmployees') != null
            ? JSON.parse(localStorage.getItem('allEmployees'))
            : []
    );
    private base64textString: String = null;

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
        ]);
        this.address = new FormControl('', Validators.required);
        this.picture = new FormControl('', Validators.required);
    }

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

    @ViewChild('myInput') myInputVariable: ElementRef;
    ngOnInit(): void {
        this.createFormControls();
        this.createFormGroup();
    }

    action: string;
    local_data: any;

    constructor(
        public dialogRef: MatDialogRef<DialogBoxComponent>,
        private changeDetectorRefs: ChangeDetectorRef,
        private _sanitize: DomSanitizer,
        private _liveAnnouncer: LiveAnnouncer,
        //@Optional() is used to prevent error if no data is passed
        @Optional() @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.createFormControls();
        this.createFormGroup();
        // console.log(data);
        this.local_data = { ...data };
        this.action = this.local_data.action;
    }
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
    get tableData() {
        this.changeDetectorRefs.detectChanges();
        return this.dataSource.data;
    }
    get randomId() {
        // Random id generator
        return Math.floor(Math.random() * 1000 + 1);
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

    handleClearImage() {
        this.myInputVariable.nativeElement.value = null;
    }

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
                console.log(this.employeeForm.value);
            } else if (this.employeeForm.valid) {
                this.isValidPicture = true;
                this.isValidFormSubmitted = true;
                this.local_data = { ...this.employeeForm.value };
                var existingEmployees = JSON.parse(
                    localStorage.getItem('allEmployees')
                );
                if (existingEmployees == null) existingEmployees = [];
    
                this.dialogRef.close({ event: this.action, data: this.local_data });
                this.handleClearImage();
            }
        }
        else if(this.action == 'Update')
        {
            this.isValidFormSubmitted = false;
            this.isValidPicture = false;
            this.employeeForm.patchValue({
                id: this.data.id,
                picture: this.base64textString == null ? this.data.picture : this.base64textString,
            });
            if (this.employeeForm.invalid) {
                this.isValidFormSubmitted = false;
                this.isValidPicture = false;
                console.log(this.employeeForm.value);
            } else if (this.employeeForm.valid) {
                this.isValidPicture = true;
                this.isValidFormSubmitted = true;
                this.local_data = { ...this.employeeForm.value };
                var existingEmployees = JSON.parse(
                    localStorage.getItem('allEmployees')
                );
                if (existingEmployees == null) existingEmployees = [];
    
                this.dialogRef.close({ event: this.action, data: this.local_data });
                this.handleClearImage();
            }
        }
    }

    closeDialog() {
        this.dialogRef.close({ event: 'Cancel' });
    }
}
