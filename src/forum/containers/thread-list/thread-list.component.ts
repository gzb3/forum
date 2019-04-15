import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import * as fromStore from '../../store';
import {Observable} from 'rxjs';
import {select, Store} from '@ngrx/store';
import {Thread} from '../../models/thread.model';
import {ActivatedRoute} from '@angular/router';
import {Forum} from '../../models/forum.model';
import {User} from '../../models/user.model';

@Component({
    selector:'thread-list',
    changeDetection:ChangeDetectionStrategy.OnPush,
    styleUrls:['thread-list.component.scss'],
    //show thread list only if we are not in thread
    template:   `        
            <div>
                <thread-list-display
                        [threads]="threads$ | async"
                        [forum]="forum$ | async"
                        [pagesArray]="pagesArray"
                        [page]="page"
                        [user]="user$ |async"
                        (lock)="onLockThread($event)"
                        (unlock)="onUnlock($event)"
                        (delete)="onDeleteThread($event)"
                ></thread-list-display>
            </div>
    `
})

export class ThreadListComponent implements OnInit,OnDestroy{
    threads$:Observable<Thread[]>;
    forumId;
    page;
    forum$:Observable<Forum>;
    pagesArray;
    user$:Observable<User>;
    _subscription;

    constructor(private store:Store<fromStore.ForumAppState>,private route:ActivatedRoute){
        this.threads$=this.store.pipe(select(fromStore.getThreads));
        this.forum$=this.store.pipe(select(fromStore.getForum));
        this.user$=this.store.pipe(select(fromStore.getUser));
    }
    ngOnInit(){
        this.route.params.subscribe(
            params => {
                this.forumId = params['forumId'];
            }
        );
        this.route
            .queryParams
            .subscribe(params=>{
                this.page=params['page'] || '1';                              //page          forumId
                          this._subscription=  this.forum$.subscribe((forum)=>{
                            if(forum) {this.pagesArray = Array.from(new Array( Math.floor(Number(forum.threadsNumber)/20)+1), (x, i) => i + 1)}
                });
            })
    }
    onLockThread(event:string){
        this.store.dispatch(new fromStore.LockThread(['lock',event]))
    }
    onUnlock(event:string){
        this.store.dispatch(new fromStore.UnlockThread(['unlock',event]));
    }

    onDeleteThread(event){
        this.store.dispatch(new fromStore.DeleteThread(event));

    }
    ngOnDestroy(){
        this._subscription.unsubscribe();
    }
}
