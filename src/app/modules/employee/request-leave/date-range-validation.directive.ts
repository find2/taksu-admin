/* eslint-disable prefer-arrow/prefer-arrow-functions */
import { AbstractControl, ValidatorFn } from '@angular/forms';

export function validateDateRequest(): ValidatorFn {

    return (control: AbstractControl): {[key: string]: boolean} | null => {
        const date1 = new Date();
        const date2 = new Date(control.value);
        const diffDays = Math.round(
            (date2.getTime() - date1.getTime()) / (1000 * 60 * 60 * 24)
        );
        if (diffDays < 14) {
            return {'invalidDateRange': true};
        }
        return null;
    };
}
