import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    TemplateRef,
    ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import { UserService } from 'app/core/user/user.service';
import { isSameDay, isSameMonth } from 'date-fns';
import { Subject, takeUntil, filter } from 'rxjs';
import { DialogBoxComponent } from './dialog-box/dialog-box.component';

const colors: any = {
    red: {
        primary: '#ad2121',
        secondary: '#FAE3E3',
    },
    blue: {
        primary: '#1e90ff',
        secondary: '#D1E8FF',
    },
    yellow: {
        primary: '#e3bc08',
        secondary: '#FDF1BA',
    },
};

@Component({
    selector: 'app-leave-calendar',
    templateUrl: './leave-calendar.component.html',
    styleUrls: ['./leave-calendar.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LeaveCalendarComponent implements OnInit, OnDestroy {
    @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;
    view: CalendarView = CalendarView.Month;
    CalendarView = CalendarView;
    viewDate: Date = new Date();
    activeDayIsOpen: boolean = false;
    user: any;

    refresh = new Subject<void>();

    events: CalendarEvent[] = [];

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _userService: UserService,
        private _changeDetectorRef: ChangeDetectorRef,
        public dialog: MatDialog,
        private _fuseConfirmationService: FuseConfirmationService
    ) {}

    ngOnInit(): void {
        this._userService
            .get()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((user: any) => {
                this.user = user;
                this.populateCalendar(JSON.parse(localStorage.getItem('allLeaves')));
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
    }

    dayClicked({
        date,
        events,
    }: {
        date: Date;
        events: CalendarEvent[];
    }): void {
        if (isSameMonth(date, this.viewDate)) {
            if (
                (isSameDay(this.viewDate, date) &&
                    this.activeDayIsOpen === true) ||
                events.length === 0
            ) {
                this.activeDayIsOpen = false;
            } else {
                this.activeDayIsOpen = true;
            }
            this.viewDate = date;
        }
    }

    handleEvent(event: any): void {
        const selectedLeave = this.getSelectedLeave(event.leaveId, event.employeeName);
        console.log(selectedLeave);
        const dialogRef = this.dialog.open(DialogBoxComponent, {
            width: '100%',
            data: selectedLeave,
        });

        dialogRef.afterClosed().subscribe((result) => {});

        //click outside the dialog and close it
        dialogRef.backdropClick().subscribe((v) => {
            dialogRef.close({
                event: 'Cancel',
            });
        });
    }

    setView(view: CalendarView): void {
        this.view = view;
    }

    closeOpenMonthViewDay(): void {
        this.activeDayIsOpen = false;
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
                    const index = existingLeaves.findIndex(
                        x => x.id === rawObj.id
                    );
                    existingLeaves[index] = rawObj;
                    localStorage.setItem(
                        'allLeaves',
                        JSON.stringify(existingLeaves)
                    );
                    this.populateCalendar(existingLeaves);
                } catch (err: any) {
                    console.log(err);
                }
            }
        });
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // Populate data leaves in calender view.
    private populateCalendar(allLeaves: any): void {
        this.events = allLeaves.map((leave) => {
            // filter nama user and assign to display data as empployee name
            const username = this.user.filter(
                usr => usr.id === leave.employeeId
            )[0];
            const leaveType =
                leave.leaveType === 'annual'
                    ? 'Annual Leave'
                    : leave.leaveType === 'sick'
                    ? 'Sick Leave'
                    : leave.leaveType === 'emergency'
                    ? 'Emergency Leave'
                    : '';
            const leaveStatus =
                leave.status === 'unapprove'
                    ? '<span class="bg-gray-300 text-gray-800 text-xs font-bold rounded-md px-2 py-1">Unapprove</span>'
                    : leave.status === 'approve'
                    ? '<span class="bg-green-700 text-white text-xs font-bold rounded-md px-2 py-1">Approved</span>'
                    : leave.status === 'reject'
                    ? '<span class="bg-red-700 text-white text-xs font-bold rounded-md px-2 py-1">Rejected</span>'
                    : '';
            return {
                leaveId: leave.id,
                employeeName: username.name,
                start: new Date(leave.startLeaveDate),
                end: new Date(leave.endLeaveDate),
                title: `${leaveType} - ${username.name} ${leaveStatus}`,
                color:
                    leave.leaveType === 'annual'
                        ? colors.blue
                        : leave.leaveType === 'sick'
                        ? colors.yellow
                        : leave.leaveType === 'emergency'
                        ? colors.red
                        : '',
                allDay: leave.fullDayLeave,
            };
        });
    }

    private getSelectedLeave(leaveId: string, employeeName): any {
        const allLeaves = JSON.parse(localStorage.getItem('allLeaves'));
        let selectedLeave = allLeaves.filter(leave => leave.id === leaveId)[0];
        selectedLeave = {
            ...selectedLeave,
            employeeName
        };
        return selectedLeave;
    }
}
