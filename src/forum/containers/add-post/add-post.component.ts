import {Component, OnInit} from '@angular/core';
import * as fromStore from '../../store';
import {select, Store} from '@ngrx/store';
import {ActivatedRoute} from '@angular/router';
import {User} from '../../models/user.model';
import {Observable} from 'rxjs';

@Component({
    selector:'add-post',
    styleUrls:['add-post.component.scss'],
    template:`        
        <div>
                <add-post-display [thread]="this.thread$| async"
                                  (create)="onCreate($event)"
                                  [user]="this.user$|async"
                                  [quote]="this.quote$ |async"
                                  [quotedUser]="this.quotedUser$|async"
                ></add-post-display>
        </div>
    `
})

export class AddPostComponent implements OnInit{
    threadId;
    forumId;
    user$:Observable<User>;
    thread$;
    quote$:Observable<string>;
    quotedUser$:Observable<User>;

    constructor(private store:Store<fromStore.ForumAppState>,private route:ActivatedRoute){
        this.forumId=this.route.snapshot.params.forumId;
        this.user$=this.store.pipe(select(fromStore.getUser));
        this.threadId=route.snapshot.params.id;
        this.thread$=this.store.pipe(select(fromStore.getThread));
        this.quote$=this.store.pipe(select(fromStore.getQuote));
        this.quotedUser$=this.store.pipe(select(fromStore.getQuotedUser));
    }
   ngOnInit(){}

    onCreate(event){
                    this.store.dispatch( new fromStore.CreatePost(event));
    }



}