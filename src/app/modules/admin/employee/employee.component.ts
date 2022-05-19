import { TranslocoService } from '@ngneat/transloco';
import { FuseConfirmationService } from '@fuse/services/confirmation/confirmation.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { DomSanitizer } from '@angular/platform-browser';
import { ViewChild } from '@angular/core';

import {
    Component,
    ViewEncapsulation,
    OnInit,
    ChangeDetectorRef,
    AfterViewInit,
} from '@angular/core';

import { MatTableDataSource } from '@angular/material/table';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatDialog } from '@angular/material/dialog';
import { DialogBoxComponent } from './dialog-box/dialog-box.component';

@Component({
    selector: 'app-employee',
    templateUrl: './employee.component.html',
    styleUrls: ['./employee.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class EmployeeComponent implements OnInit, AfterViewInit {
    isValidFormSubmitted = null;
    isValidUpdated = null;
    isValidPicture = null;
    tl_content = null;
    tl_title = null;
    dl_button = null;
    cl_button = null;

    dataSource = new MatTableDataSource(
        localStorage.getItem('allEmployees') != null
            ? JSON.parse(localStorage.getItem('allEmployees'))
            : []
    );

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(
        private changeDetectorRefs: ChangeDetectorRef,
        private _sanitize: DomSanitizer,
        private _liveAnnouncer: LiveAnnouncer,
        public dialog: MatDialog,
        private _fuseConfirmationService: FuseConfirmationService,
        private service: TranslocoService
    ) {}

    ngOnInit(): void {
        this.tableData;
        this.service.selectTranslate("Are you sure you want to delete this employee?").subscribe(
            (res) => {
                this.tl_content = res;
            }
        );
        this.service.selectTranslate("Delete Employee").subscribe(
            (res) => {
                this.tl_title = res;
            }
        );
        this.service.selectTranslate("Delete").subscribe(
            (res) => {
                this.dl_button = res;
            }
        );
        this.service.selectTranslate("Cancel").subscribe(
            (res) => {
                this.cl_button = res;
            }
        );

    }

    ngAfterViewInit() {
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
    }

    openDialog(action, obj) {
        this.isValidFormSubmitted = null;
        this.isValidUpdated = null;
        obj.action = action;
        const dialogRef = this.dialog.open(DialogBoxComponent, {
            width: '100%',
            data: obj,
        });
        dialogRef.afterClosed().subscribe((result) => {
            try {
                if (result.event === 'Add') {
                    this.addEmployee(result.data);
                } else if (result.event === 'Update') {
                    this.editEmployee(result.data);
                } else if (result.event === 'Cancel') {
                    this.isValidFormSubmitted = null;
                    this.isValidUpdated = null;
                }
            } catch (error) {
                console.log(error);
            }
        });
        //click outside the dialog and close it
        dialogRef.backdropClick().subscribe((v) => {
            dialogRef.close({ event: 'Cancel' });
        });
    }

    public displayedColumns: string[] = [
        'id',
        'name',
        'position',
        'email',
        'address',
        'picture',
        'actions',
    ];

    /** Announce the change in sort state */
    announceSortChange(sortState: Sort) {
        if (sortState.direction) {
            this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
        } else {
            this._liveAnnouncer.announce('Sorting cleared');
        }
    }

    // Convert base64 to display image
    convertImage(image) {
        return this._sanitize.bypassSecurityTrustUrl(
            'data:image/jpg;base64,' + image
        );
    }

    // Delete Employee
    deleteEmployee(id) {
        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            title: this.tl_title,
            message: this.tl_content,
            actions: {
                confirm: {
                    label: this.dl_button,
                },
                cancel: {
                    label: this.cl_button,
                }   
            },
        });

        // Subscribe to the confirmation dialog closed action
        confirmation.afterClosed().subscribe((result) => {
            // If the confirm button pressed...
            if (result === 'confirmed') {
                var existingEmployees = JSON.parse(
                    localStorage.getItem('allEmployees')
                );
                const index = existingEmployees.findIndex(
                    (employee) => employee.id === id
                );
                existingEmployees.splice(index, 1);
                localStorage.setItem(
                    'allEmployees',
                    JSON.stringify(existingEmployees)
                );

                this.dataSource.data = existingEmployees;
            }
        });
    }

    // Edit Employee
    editEmployee(row_obj) {
        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            title: 'Update Employee Information',
            message: 'Are you sure you want to update this information ?',
            icon: {
                show: true,
                name: 'heroicons_outline:information-circle',
                color: 'info',
            },
            actions: {
                confirm: {
                    label: 'Edit',
                    color: 'primary',
                },
            },
        });
        // Subscribe to the confirmation dialog closed action
        confirmation.afterClosed().subscribe((result) => {
            // If the confirm button pressed...
            if (result === 'confirmed') {
                var existingEmployees = JSON.parse(
                    localStorage.getItem('allEmployees')
                );
                const index = existingEmployees.findIndex(
                    (employee) => employee.id === row_obj.id
                );
                existingEmployees[index] = row_obj;
                localStorage.setItem(
                    'allEmployees',
                    JSON.stringify(existingEmployees)
                );

                this.dataSource.data = existingEmployees;
                this.isValidUpdated = true;
            }
        });
    }
    // Add Employee
    addEmployee(raw_obj) {
        if (JSON.parse(localStorage.getItem('allEmployees')) == null) {
            localStorage.setItem('allEmployees', JSON.stringify([raw_obj]));
            this.dataSource.data = JSON.parse(
                localStorage.getItem('allEmployees')
            );
            this.isValidFormSubmitted = true;
        } else {
            var existingEmployees = JSON.parse(
                localStorage.getItem('allEmployees')
            );
            existingEmployees.push(raw_obj);
            localStorage.setItem(
                'allEmployees',
                JSON.stringify(existingEmployees)
            );
            this.dataSource.data = existingEmployees;
            this.isValidFormSubmitted = true;
        }
    }

    search(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }

    get tableData() {
        this.changeDetectorRefs.detectChanges();
        return this.dataSource.data;
    }
}
