import { AuthService } from 'app/core/auth/auth.service';
import { Injectable } from '@angular/core';
import { cloneDeep } from 'lodash-es';
import { FuseNavigationItem } from '@fuse/components/navigation';
import { FuseMockApiService } from '@fuse/lib/mock-api';
import { defaultNavigation, employeeNavigation } from 'app/mock-api/common/navigation/data';

@Injectable({
    providedIn: 'root'
})
export class NavigationMockApi
{
    private readonly _defaultNavigation: FuseNavigationItem[] = defaultNavigation;
    private readonly _employeeNavigation: FuseNavigationItem[] = employeeNavigation;

    /**
     * Constructor
     */
    constructor(private _fuseMockApiService: FuseMockApiService, private _authService: AuthService)
    {
        // Register Mock API handlers
        this.registerHandlers();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Register Mock API handlers
     */
    registerHandlers(): void
    {
        // -----------------------------------------------------------------------------------------------------
        // @ Navigation - GET
        // -----------------------------------------------------------------------------------------------------
        const isMenuAdmin = +this._authService.userLevel === 1;
        this._fuseMockApiService
            .onGet('api/common/navigation')
            .reply(() => [
                200,
                {
                    compact   : cloneDeep(isMenuAdmin ? this._defaultNavigation : this._employeeNavigation),
                    default   : cloneDeep(isMenuAdmin ? this._defaultNavigation : this._employeeNavigation),
                    futuristic: cloneDeep(isMenuAdmin ? this._defaultNavigation : this._employeeNavigation),
                    horizontal: cloneDeep(isMenuAdmin ? this._defaultNavigation : this._employeeNavigation)
                }
            ]);
    }
}
