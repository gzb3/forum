import {Component} from '@angular/core';
import {select, Store} from '@ngrx/store';
import * as fromStore from '../../store';

@Component({
    selector:'edit-user',
    styleUrls:['edit-user.component.scss'],
    template:`
        <edit-user-display
                [user]="user$ |async"
                (edit)="onEdit($event)"
        ></edit-user-display>
    `
})
export class EditUserComponent{
    user$;

    constructor(private store:Store<fromStore.ForumAppState>){
        this.user$=this.store.pipe(select(fromStore.getUser));
    }

    onEdit(formData){
        this.store.dispatch(new fromStore.EditUserProfile(formData));
    }
}