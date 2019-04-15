import {Component} from '@angular/core';
import {select, Store} from '@ngrx/store';
import * as fromStore from '../../store';
import {User} from '../../models/user.model';
import {Observable} from 'rxjs';

@Component({
    selector:'user-profile',
    styleUrls:['user-profile.component.scss'],
    template:`        
            <display-user
                    [user]="this.user$|async">
            </display-user>
    `
})
export class UserProfileComponent{
    user$:Observable<User>;

    constructor(private store:Store<fromStore.ForumAppState>){
        this.user$=this.store.pipe(select(fromStore.getProfile));
    }




}