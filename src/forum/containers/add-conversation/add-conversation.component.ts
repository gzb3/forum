import {Component, OnInit} from '@angular/core';
import {select, Store} from '@ngrx/store';
import * as fromStore from '../../store';
import {ActivatedRoute, Router} from '@angular/router';
import {User} from '../../models/user.model';
import {Observable} from 'rxjs';

@Component({
    selector:'add-conversation',
    styleUrls:['add-conversation.component.scss'],
    template:`
        <div>
            <add-conversation-display
                    [user]="this.user$|async"
                    [searchUsers]="this.searchUsers$|async"
                    (create)="onCreate($event)"
                    (search)="onSearch($event)"
                    
            ></add-conversation-display>
        </div>
    `
})

export class AddConversationComponent implements OnInit{

    user$:Observable<User>;
    searchUsers$:Observable<User[]>;

    constructor(private store:Store<fromStore.ForumAppState>,private route:ActivatedRoute, private router :Router){
        this.user$=this.store.pipe(select(fromStore.getUser));
        this.searchUsers$=this.store.pipe(select(fromStore.getUsers));
    }

    ngOnInit(){}

    onCreate(event){
        this.store.dispatch(new fromStore.AddConversation(event));
    }
    onSearch(event){
        this.store.dispatch( new fromStore.LoadSearchUsers(event));
    }

}
