import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {select, Store} from '@ngrx/store';
import * as fromStore from '../../store';
import {Observable} from 'rxjs';
import {Post} from '../../models/post.model';
import {ActivatedRoute, Router} from '@angular/router';
import {User} from '../../models/user.model';
import {Thread} from '../../models/thread.model';

@Component({
    selector:'post-list',    changeDetection:ChangeDetectionStrategy.OnPush,

    styleUrls:['post-list.component.scss'],
    template:`        
        <div [hidden]="p.isActivated">
            <post-list-display
                    [threadPosts]="this.posts$ |async"
                    [page]="this.page"
                    [pagesArray]="this.pagesArray"
                    [thread]="this.thread$ | async"
                    [user]="this.user$ |async"
                    (quote)="onReply($event)"
                    (deletePost)="onDelete($event)"
                    (editPost)="onEdit($event)"
                    (report)="onReport($event)"
                    
            ></post-list-display>
        </div>

        <router-outlet #p="outlet"></router-outlet>
    `
})
export class PostListComponent implements OnInit,OnDestroy{

    posts$:Observable<Post[]>;
    threadId;
    isAuthenticated$;
    user$:Observable<User>;
    page:number;
    thread$:Observable<Thread>;
    pagesArray=[];
    _sub;

    constructor(private store:Store<fromStore.ForumAppState>,private router:Router ,private route :ActivatedRoute) {

        this.threadId = route.snapshot.params.id;
        this.getPage();
        this.isAuthenticated$=this.store.pipe(select(fromStore.isAuthenticated));
        this.posts$=this.store.pipe(select(fromStore.getPosts));
        this.user$=this.store.pipe(select(fromStore.getUser));

    }
    getPage(){
        this.route
            .queryParams
            .subscribe(params=>{
                this.page=params['page'] || 1;
                this.thread$=this.store.pipe(select(fromStore.getThread));
                this._sub=this.thread$.subscribe((thread)=>this.pagesArray=Array.from(new Array(thread && thread.pageNumber), (x,i) => i +1)); })

    }

    ngOnDestroy(){
        this._sub.unsubscribe();
    }

    ngOnInit(){}
    onReply(event){
        this.isAuthenticated$.subscribe(auth=>{
            if(auth){
                this.store.dispatch( new fromStore.StoreQuote(event));
                this.router.navigate(['new-post'],{relativeTo:this.route});
            }else{
                this.router.navigate(['./log-in']);
            }
        })

    }
    onReport(event){
        this.store.dispatch(new fromStore.ToggleFlag(event));
    }
    onDelete(event){
        this.store.dispatch(new fromStore.RemovePost(event))
    }
    onEdit(event){
        this.store.dispatch(new fromStore.EditPost(event))
    }







}