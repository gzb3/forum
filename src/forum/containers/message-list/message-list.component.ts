import {combineLatest, Observable} from 'rxjs';
import {User} from '../../models/user.model';
import {select, Store} from '@ngrx/store';
import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import * as fromStore from '../../store';
import {Message} from '../../models/message.model';
import {map } from 'rxjs/operators';
import {Conversation} from '../../models/conversation.model';

@Component({
    selector:'message-list',    changeDetection:ChangeDetectionStrategy.OnPush,
    styleUrls:['message-list.component.scss'],
    template:`        
        <div >
            <message-list-display
                    [messages]="messages$ |async"
                    [conversation]="conversation$ | async"
                    [user]="user$ |async"
            ></message-list-display>
        </div>
        <div>
            <add-message
                    [conversationId]="conversationId$ | async"
            ></add-message>
        </div>
    `
})

export class MessageListComponent implements OnInit,OnDestroy{
    messages$:Observable<Message[]>;
    user$:Observable<User>;
    conversation$:Observable<Conversation>;
    conversationId$:Observable<string>;
    _subscription;

    constructor(private store:Store<fromStore.ForumAppState>,private router:Router ,private route :ActivatedRoute) {

        this.conversationId$=this.route.params.pipe(map((params)=>{
            return params['id'];
        }));

        this.conversation$=this.store.pipe(select(fromStore.getConversation));
        this.user$=this.store.pipe(select(fromStore.getUser));
        this.messages$=this.store.pipe(select(fromStore.getMessages));

    }
    ngOnInit(){
       this._subscription= combineLatest(this.user$,this.route.params).subscribe(([user,params])=>{
            if(user.id) this.store.dispatch(new fromStore.LoadMessages([params['id'],user.id]))
        });
    }

    ngOnDestroy(){
        this._subscription.unsubscribe();
    }

}

