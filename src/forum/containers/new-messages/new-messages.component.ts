import {Component, Input, OnChanges, OnDestroy} from '@angular/core';
import {select, Store} from '@ngrx/store';
import * as fromStore from '../../store';
import {Observable} from 'rxjs';
import {User} from '../../models/user.model';
import {Message} from '../../models/message.model';
import { Router} from '@angular/router';

@Component({
    selector:'new-messages',
    styleUrls:['new-messages.component.scss'],
    template:`
    
        <new-messages-display
                [messages]="newMessages$ |async"
                [loaded]="loaded$ |async"
        ></new-messages-display>
    `
})

export class NewMessagesComponent implements OnChanges,OnDestroy{

    @Input() reload;
    user$:Observable<User>;
    newMessages$:Observable<Message[]>;
    url;
    loaded$:any;
    _subscription;
    constructor(private store:Store<fromStore.ForumAppState>,private router:Router){
        this.user$=this.store.pipe(select(fromStore.getUser));
        this.url=this.router.url;

    }
    ngOnChanges(){
        this._subscription=this.user$.subscribe((user)=> {
            if(user.id){
                this.store.dispatch(new fromStore.LoadNewMessages(user.id));
                this.newMessages$=this.store.pipe(select(fromStore.getNewMessages));
                this.loaded$=this.store.pipe(select(fromStore.newMessagesLoaded));
            }

        });
    }
    ngOnDestroy(){
        this._subscription.unsubscribe();
    }

}






















