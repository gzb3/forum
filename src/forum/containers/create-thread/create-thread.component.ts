import {Component} from '@angular/core';
import * as fromStore from '../../store';
import {select, Store} from '@ngrx/store';
import {ActivatedRoute} from '@angular/router';
import {User} from '../../models/user.model';
import {Observable} from 'rxjs';

@Component({
    selector:'create-thread',
    styleUrls:['create-thread.component.scss'],
    template:`        
        <div>
            <add-thread
                    [forumId]="this.forumId"
                    [user]="this.user$|async"
                    (create)="onCreate($event)"
            ></add-thread>
        </div>
    `
})
export class CreateThreadComponent {

    forumId;
    user$:Observable<User>;
    constructor(private store:Store<fromStore.ForumAppState>,private route:ActivatedRoute){
        this.forumId=this.route.snapshot.params.forumId;
        this.user$=this.store.pipe(select(fromStore.getUser));

    }

    onCreate(event){
        this.store.dispatch( new fromStore.CreateThread(event))

    }



}