import { filter } from 'rxjs';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { TranslocoService } from '@ngneat/transloco';
import { DialogBoxComponent } from './dialog-box/dialog-box.component';

@Component({
  selector: 'app-request-leave',
  templateUrl: './request-leave.component.html',
  styleUrls: ['./request-leave.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RequestLeaveComponent implements OnInit, AfterViewInit {

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    isValidFormSubmitted = null;
    isValidUpdated = null;
    lvContent = null;
    lvTitle = null;
    lvDlButton = null;
    lvClButton = null;
    dataSource = new MatTableDataSource(
        localStorage.getItem('allLeaves') != null ?
        this.getAllLeaves(JSON.parse(localStorage.getItem('allLeaves'))) :
        []
    );
    displayedColumns: string[] = [
        'leaveType',
        'startLeaveDate',
        'endLeaveDate',
        'startLeaveTime',
        'endLeaveTime',
        'description',
        'status',
        'actions'
    ];

    constructor(public dialog: MatDialog,
        private changeDetectorRefs: ChangeDetectorRef,
        private _liveAnnouncer: LiveAnnouncer,
        private _fuseConfirmationService: FuseConfirmationService,
        private service: TranslocoService) {}

    get tableDataLeaves() {
        this.changeDetectorRefs.detectChanges();
        return this.dataSource.data;
    }

    ngAfterViewInit(): void {
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
    }

    /** Announce the change in sort state */
    announceSortChange(sortState: Sort): void {
        if (sortState.direction) {
            this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
        } else {
            this._liveAnnouncer.announce('Sorting cleared');
        }
    }

    ngOnInit(): void {
        this.tableDataLeaves;
        this.service.selectTranslate('Are you sure you want to delete this leave?').subscribe(
            (res) => {
                this.lvContent = res;
            }
        );
        this.service.selectTranslate('Delete Leave').subscribe(
            (res) => {
                this.lvTitle = res;
            }
        );
        this.service.selectTranslate('Delete').subscribe(
            (res) => {
                this.lvDlButton = res;
            }
        );
        this.service.selectTranslate('Cancel').subscribe(
            (res) => {
                this.lvClButton = res;
            }
        );
    }

    // Open dialog form for add new leaves or update existing leave
    openDialog(action, obj): void {
        obj.action = action;
        const dialogRef = this.dialog.open(DialogBoxComponent, {
            width: '100%',
            data: obj,
        });

        dialogRef.afterClosed().subscribe((result) => {
            try {
                switch (result.event) {
                  case 'Add':
                    this.addLeaves(result.data);
                    break;
                  case 'Update':
                    this.updateLeaves(result.data);
                    break;
                  case 'Cancel':
                    this.isValidFormSubmitted = null;
                    this.isValidUpdated = null;
                    break;
                  default:
                    this.isValidFormSubmitted = null;
                    this.isValidUpdated = null;
                    break;

                };

            } catch (err: any) {
                console.log(err);
            }
        });

        //click outside the dialog and close it
        dialogRef.backdropClick().subscribe((v) => {
            dialogRef.close({
                event: 'Cancel'
            });
        });

    }

    // add new Leaves
    addLeaves(rawObj): void {
        if (JSON.parse(localStorage.getItem('allLeaves')) == null) {
            localStorage.setItem('allLeaves', JSON.stringify([rawObj]));
            this.dataSource.data = this.getAllLeaves(JSON.parse(localStorage.getItem('allLeaves')));
            this.isValidFormSubmitted = true;
        } else {
            const existingLeaves = JSON.parse(localStorage.getItem('allLeaves'));
            existingLeaves.push(rawObj);
            localStorage.setItem('allLeaves', JSON.stringify(existingLeaves));
            this.dataSource.data = this.getAllLeaves(existingLeaves);
            this.isValidFormSubmitted = true;
        }
    }

    deleteLeaves(id: string): void {
        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            title: this.lvTitle,
            message: this.lvContent,
            actions: {
                confirm: {
                    label: this.lvDlButton,
                },
                cancel: {
                    label: this.lvClButton,
                },
            },
        });

        // Subscribe to the confirmation dialog closed action
        confirmation.afterClosed().subscribe((result) => {
            // If the confirm button pressed...
            if (result === 'confirmed') {
                const existingLeaves = JSON.parse(
                    localStorage.getItem('allLeaves')
                );
                const index = existingLeaves.findIndex(leaves => leaves.id === id);
                existingLeaves.splice(index, 1);
                localStorage.setItem(
                    'allLeaves',
                    JSON.stringify(existingLeaves)
                );

                this.dataSource.data = this.getAllLeaves(existingLeaves);
            }
        });
    }

    updateLeaves(rawObj): void {
        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            title: 'Update Leave Information',
            message: 'Are you sure you want to update this information?',
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
        confirmation.afterClosed().subscribe((result) => {
            if (result === 'confirmed') {
                try {
                    const existingLeaves = JSON.parse(
                        localStorage.getItem('allLeaves')
                    );
                    const index = existingLeaves.findIndex(x => x.id === rawObj.id);
                    existingLeaves[index] = rawObj;
                    localStorage.setItem(
                        'allLeaves',
                        JSON.stringify(existingLeaves)
                    );
                    this.dataSource.data = this.getAllLeaves(existingLeaves);
                    this.isValidUpdated = true;
                } catch (err: any) {
                    console.log(err);
                }
            }
        });
    }

    getAllLeaves(allLeaves: any): any {
        const userId = localStorage.getItem('userId') || '';
        if (userId === '') {
            return [];
        }
        const filterLeaves = allLeaves.filter(leave => leave.employeeId === userId);
        return filterLeaves;
    }

}
