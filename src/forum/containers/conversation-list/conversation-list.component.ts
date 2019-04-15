import {Observable} from 'rxjs';
import {User} from '../../models/user.model';
import {select, Store} from '@ngrx/store';
import {ChangeDetectionStrategy, Component} from '@angular/core';
import * as fromStore from '../../store';
import {ActivatedRoute, Router} from '@angular/router';
import {Conversation} from '../../models/conversation.model';

@Component({
    selector:'conversation-list',    changeDetection:ChangeDetectionStrategy.OnPush,

    styleUrls:['conversation-list.component.scss'],
    template:`        
        <div >
            <conversation-list-display
                    [conversations]="conversations$ |async"
                    [user]="user$ |async"
            ></conversation-list-display>
        </div>
    `
})
export class ConversationListComponent{
    user$:Observable<User>;

    conversations$:Observable<Conversation[]>;
    userId:string;

    constructor(private store:Store<fromStore.ForumAppState>,private router:Router ,private route :ActivatedRoute) {

        this.userId=this.route.snapshot.params.id;
        this.store.dispatch(new fromStore.LoadConversations(this.userId));
        this.conversations$=this.store.pipe(select(fromStore.getConversations));
        this.user$=this.store.pipe(select(fromStore.getUser));

    }

}