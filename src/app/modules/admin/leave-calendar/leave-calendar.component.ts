import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    TemplateRef,
    ViewChild,
} from '@angular/core';
import {
    CalendarEvent,
    CalendarView,
} from 'angular-calendar';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import {
    isSameDay,
    isSameMonth,
} from 'date-fns';
import { Subject, takeUntil } from 'rxjs';

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
    modalData: {
        action: string;
        event: CalendarEvent;
    };

    refresh = new Subject<void>();

    events: CalendarEvent[] = [];

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(private _userService: UserService, private _changeDetectorRef: ChangeDetectorRef,) {}

    ngOnInit(): void {
        this._userService.get()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((user: any) => {
                this.user = user;
                this.populateCalendar();
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

    handleEvent(action: string, event: CalendarEvent): void {
        this.modalData = { event, action };
        // this.modal.open(this.modalContent, { size: 'lg' });
        console.log(this.modalData);
    }

    setView(view: CalendarView): void {
        this.view = view;
    }

    closeOpenMonthViewDay(): void {
        this.activeDayIsOpen = false;
    }

    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    private populateCalendar(): void {
        const allLeaves = JSON.parse(localStorage.getItem('allLeaves'));
        this.events = allLeaves.map((leave) => {
            // filter nama user
            const username = this.user.filter(usr => usr.id === leave.employeeId)[0];
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
}
