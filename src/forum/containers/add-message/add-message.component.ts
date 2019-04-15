import {Component, Input} from '@angular/core';
import {select, Store} from '@ngrx/store';
import * as fromStore from '../../store';
import {User} from '../../models/user.model';
import {Observable} from 'rxjs';

@Component({
    selector:'add-message',
    styleUrls:['add-message.component.scss'],
    template:`
        <add-message-display
                (create)="onCreate($event)"
                [conversationId]="conversationId "
                [user]="user$ |async"
        ></add-message-display>
    `
})
export class AddMessageComponent{
    @Input() conversationId:string;
     user$:Observable<User>;
    constructor(private store:Store<fromStore.ForumAppState>){
        this.user$=this.store.pipe(select(fromStore.getUser));
    }
    onCreate(event){
        this.store.dispatch(new fromStore.AddMessage(event))
    }
}
