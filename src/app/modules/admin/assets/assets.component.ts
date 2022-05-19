import { TranslocoService } from '@ngneat/transloco';
import { FuseConfirmationService } from '@fuse/services/confirmation/confirmation.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
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
import { DialogAssetsComponent } from './dialog-assets/dialog-assets.component';

@Component({
    selector: 'app-assets',
    templateUrl: './assets.component.html',
    styleUrls: ['./assets.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class AssetsComponent implements OnInit, AfterViewInit {
    isValidFormSubmitted = null;
    isValidUpdated = null;
    as_content = null;
    as_title = null;
    asdl_button = null;
    ascl_button = null;
    dataSource = new MatTableDataSource(
        localStorage.getItem('allAssets') != null
            ? JSON.parse(localStorage.getItem('allAssets'))
            : []
    );

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(
        public dialog: MatDialog,
        private changeDetectorRefs: ChangeDetectorRef,
        private _liveAnnouncer: LiveAnnouncer,
        private _fuseConfirmationService: FuseConfirmationService,
        private service: TranslocoService
    ) {}

    ngOnInit(): void {
        this.tableDataAsset;
        this.service.selectTranslate("Are you sure you want to delete this asset?").subscribe(
            (res) => {
                this.as_content = res;
            }
        );
        this.service.selectTranslate("Delete Asset").subscribe(
            (res) => {
                this.as_title = res;
            }
        );
        this.service.selectTranslate("Delete").subscribe(
            (res) => {
                this.asdl_button = res;
            }
        );
        this.service.selectTranslate("Cancel").subscribe(
            (res) => {
                this.ascl_button = res;
            }
        );

    }
    ngAfterViewInit() {
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    }

    public displayedColumns: string[] = [
        'code',
        'name',
        'dateRegister',
        'model',
        'serialNumber',
        'assignTo',
        'status',
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

    openDialog(action, obj) {
        this.isValidFormSubmitted = null;
        this.isValidUpdated = null;
        obj.action = action;
        const dialogRef = this.dialog.open(DialogAssetsComponent, {
            width: '100%',
            data: obj,
        });
        dialogRef.afterClosed().subscribe((result) => {
            try {
                if (result.event === 'Add') {
                    this.addAsset(result.data);
                } else if (result.event === 'Update') {
                    this.editAsset(result.data);
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
    // add new asset
    addAsset(raw_obj) {
        if (JSON.parse(localStorage.getItem('allAssets')) == null) {
            localStorage.setItem('allAssets', JSON.stringify([raw_obj]));
            this.dataSource.data = JSON.parse(localStorage.getItem('allAssets'));
            this.isValidFormSubmitted = true;
        } else {
            var existingAssets = JSON.parse(localStorage.getItem('allAssets'));
            existingAssets.push(raw_obj);
            localStorage.setItem('allAssets', JSON.stringify(existingAssets));
            this.dataSource.data = existingAssets;
            this.isValidFormSubmitted = true;
        }
    }
    // edit asset
    editAsset(raw_obj) {
        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            title: 'Update Asset Information',
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
                var existingAssets = JSON.parse(
                    localStorage.getItem('allAssets')
                );
                const index = existingAssets.findIndex(
                    (x) => x.id === raw_obj.id
                );
                existingAssets[index] = raw_obj;
                localStorage.setItem(
                    'allAssets',
                    JSON.stringify(existingAssets)
                );
                this.dataSource.data = existingAssets;
                this.isValidUpdated = true;
            }
        });
    }
    // delete asset
    deleteAsset(id) {
        // Open the confirmation dialog
        const confirmation = this._fuseConfirmationService.open({
            title: this.as_title,
            message: this.as_content,
            actions: {
                confirm: {
                    label: this.asdl_button,
                },
                cancel: {
                    label: this.ascl_button,
                },
            },
        });

        // Subscribe to the confirmation dialog closed action
        confirmation.afterClosed().subscribe((result) => {
            // If the confirm button pressed...
            if (result === 'confirmed') {
                var existingAssets = JSON.parse(
                    localStorage.getItem('allAssets')
                );
                const index = existingAssets.findIndex(
                    (asset) => asset.id === id
                );
                existingAssets.splice(index, 1);
                localStorage.setItem(
                    'allAssets',
                    JSON.stringify(existingAssets)
                );

                this.dataSource.data = existingAssets;
            }
        });
    }
    // search asset
    search(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();

        if (this.dataSource.paginator) {
            this.dataSource.paginator.firstPage();
        }
    }
    get tableDataAsset() {
        this.changeDetectorRefs.detectChanges();
        return this.dataSource.data;
    }
}
