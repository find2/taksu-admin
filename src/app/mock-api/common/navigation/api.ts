import { AuthService } from 'app/core/auth/auth.service';
import { Injectable } from '@angular/core';
import { cloneDeep } from 'lodash-es';
import { FuseNavigationItem } from '@fuse/components/navigation';
import { FuseMockApiService } from '@fuse/lib/mock-api';
import { defaultNavigation } from 'app/mock-api/common/navigation/data';

@Injectable({
    providedIn: 'root'
})
export class NavigationMockApi
{
    private readonly _defaultNavigation: FuseNavigationItem[] = defaultNavigation;

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
                    compact   : cloneDeep(this._defaultNavigation),
                    default   : cloneDeep(this._defaultNavigation),
                    futuristic: cloneDeep(this._defaultNavigation),
                    horizontal: cloneDeep(this._defaultNavigation)
                }
            ]);
    }
}
