import {
    Component,
    OnInit,
    ViewEncapsulation,
    ChangeDetectorRef,
    AfterViewInit,
} from '@angular/core'
import {
    FuseConfirmationService
} from '@fuse/services/confirmation/confirmation.service'
import {
    MatPaginator
} from '@angular/material/paginator'
import {
    MatSort,
    Sort
} from '@angular/material/sort'
import {
    ViewChild
} from '@angular/core'
import {
    LiveAnnouncer
} from '@angular/cdk/a11y'
import {
    MatDialog
} from '@angular/material/dialog'
import {
    MatTableDataSource
} from '@angular/material/table'
import {
    DialogBoxComponent
} from './dialog-box/dialog-box.component'
import {
    TranslocoService
} from '@ngneat/transloco'

@Component({
    selector: 'app-leaves',
    templateUrl: './leaves.component.html',
    styleUrls: ['./leaves.component.scss'],
    encapsulation: ViewEncapsulation.None,
})

export class LeavesComponent implements OnInit {
    isValidFormSubmitted = null
    isValidUpdated = null
    lv_content = null
    lv_title = null
    lvdl_button = null
    lvcl_button = null
    dataSource = new MatTableDataSource(
        localStorage.getItem('allLeaves') != null ?
        JSON.parse(localStorage.getItem('allLeaves')) :
        []
    )

    @ViewChild(MatSort) sort: MatSort
    @ViewChild(MatPaginator) paginator: MatPaginator

    constructor(
        public dialog: MatDialog,
        private changeDetectorRefs: ChangeDetectorRef,
        private _liveAnnouncer: LiveAnnouncer,
        private _fuseConfirmationService: FuseConfirmationService,
        private service: TranslocoService
    ) {}

    ngAfterViewInit() {
        this.dataSource.sort = this.sort
        this.dataSource.paginator = this.paginator
    }

    public displayedColumns: string[] = [
        'employeeName',
        'leaveType',
        'fullDayLeave',
        'startLeaveDate',
        'endLeaveDate',
        'startLeaveTime',
        'endLeaveTime',
        'actions'
    ]

    /** Announce the change in sort state */
    announceSortChange(sortState: Sort) {
        if (sortState.direction) {
            this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`)
        } else {
            this._liveAnnouncer.announce('Sorting cleared')
        }
    }

    ngOnInit(): void {
        this.tableDataLeaves
        this.service.selectTranslate("Are you sure you want to delete this leave?").subscribe(
            (res) => {
                this.lv_content = res
            }
        )
        this.service.selectTranslate("Delete Leave").subscribe(
            (res) => {
                this.lv_title = res
            }
        )
        this.service.selectTranslate("Delete").subscribe(
            (res) => {
                this.lvdl_button = res
            }
        )
        this.service.selectTranslate("Cancel").subscribe(
            (res) => {
                this.lvcl_button = res
            }
        )

    }

    openDialog(action, obj) {

        obj.action = action
        const dialogRef = this.dialog.open(DialogBoxComponent, {
            width: '100%',
            data: obj,
        })

        dialogRef.afterClosed().subscribe(result => {
            try {
                switch (result.event) {
                  case "Add":
                    this.addLeaves(result.data)
                    break;
                    
                  case "Update":
                    this.updateLeaves(result.data)
                    break;

                  case "Cancel":
                    this.isValidFormSubmitted = null
                    this.isValidUpdated = null
                    break;

                  default:
                    this.isValidFormSubmitted = null
                    this.isValidUpdated = null
                    break;

                }  

            } catch (err: any) {
                console.log(err)
            }
        })

        //click outside the dialog and close it
        dialogRef.backdropClick().subscribe((v) => {
            dialogRef.close({
                event: 'Cancel'
            })
        })

    }


    // add new Leaves
    addLeaves(raw_obj) {
        if (JSON.parse(localStorage.getItem('allLeaves')) == null) {
            localStorage.setItem('allLeaves', JSON.stringify([raw_obj]))
            this.dataSource.data = JSON.parse(localStorage.getItem('allLeaves'))
            this.isValidFormSubmitted = true
        } else {
            var existingLeaves = JSON.parse(localStorage.getItem('allLeaves'))
            existingLeaves.push(raw_obj)
            localStorage.setItem('allLeaves', JSON.stringify(existingLeaves))
            this.dataSource.data = existingLeaves
            this.isValidFormSubmitted = true
        }
    }

    get tableDataLeaves() {
        this.changeDetectorRefs.detectChanges()
        return this.dataSource.data
    }

    // search leaves
    search(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value
        this.dataSource.filter = filterValue.trim().toLowerCase()

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage()
        }
    }

    deleteLeaves(id: any) {
        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            title: this.lv_title,
            message: this.lv_content,
            actions: {
                confirm: {
                    label: this.lvdl_button,
                },
                cancel: {
                    label: this.lvcl_button,
                },
            },
        })

        // Subscribe to the confirmation dialog closed action
        confirmation.afterClosed().subscribe((result) => {
            // If the confirm button pressed...
            if (result === 'confirmed') {
                var existingLeaves = JSON.parse(
                    localStorage.getItem('allLeaves')
                )
                const index = existingLeaves.findIndex(
                    (leaves) => leaves.id === id
                )
                existingLeaves.splice(index, 1)
                localStorage.setItem(
                    'allLeaves',
                    JSON.stringify(existingLeaves)
                )

                this.dataSource.data = existingLeaves
            }
        })
    }

    updateLeaves(raw_obj) {
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
        })
        confirmation.afterClosed().subscribe((result) => {
            if (result === 'confirmed') {
                try {
                    var existingLeaves = JSON.parse(
                        localStorage.getItem('allLeaves')
                    )
                    const index = existingLeaves.findIndex(
                        (x) => x.id === raw_obj.id
                    )
                    existingLeaves[index] = raw_obj
                    localStorage.setItem(
                        'allLeaves',
                        JSON.stringify(existingLeaves)
                    )
                    this.dataSource.data = existingLeaves
                    this.isValidUpdated = true
                } catch (err: any) {
                    console.log(err)
                }
            }
        })
    }

}
