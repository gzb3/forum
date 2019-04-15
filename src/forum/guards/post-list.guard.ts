import {Injectable, OnInit} from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import * as fromStore from '../store';
import {select, Store} from '@ngrx/store';
import {catchError, filter,switchMap, take, tap} from 'rxjs/operators';
import { Observable, of} from 'rxjs';
import {CookieService} from 'angular2-cookie/services/cookies.service';

/* Preloads store with thread (post list)*/
@Injectable()
export class PostListGuard implements OnInit,CanActivate{
    hasVisitedAlready:boolean;

    constructor(private router:Router,private store:Store<fromStore.ForumAppState>,private cookieService:CookieService){}

    ngOnInit(){}
    getFromStoreOrAPI(page,id):Observable<any>{
        let c=0;
        return this.store.pipe(select(fromStore.getPostsAndPage),
            tap(()=>{
                if(c==0)
                this.store.dispatch(new fromStore.LoadPosts({page:page,threadId:id,visitedThread:this.hasVisitedAlready}));
                c++;
            }),
            filter(postsAndPage=>postsAndPage.posts.length>0),
            filter(postsAndPage=>postsAndPage.posts[0].threadId==id && page==postsAndPage.page),
            take(1))
    }

    canActivate(route:ActivatedRouteSnapshot,state:RouterStateSnapshot){
        let page=route.queryParams['page']||'1';
        this.hasUserVisitedThread(route.params['id']);
        if (state.url.includes("/new-post")) {
            return of(true);
        }else return this.getFromStoreOrAPI(page,route.params['id']).pipe(
            switchMap(()=>of(true)),
            catchError(()=>of(false))
        )
    }

    hasUserVisitedThread(id){//for increasing number of thread views

        if (this.cookieService.get('visited')){//if exists
            if (this.cookieService.get('visited').includes(',' + id + ',')) {//if includes id
                this.hasVisitedAlready = true;//if we have already visited thread return true
            } else {//if exists but does not include
                this.hasVisitedAlready = false;
                this.cookieService.put('visited',  this.cookieService.get('visited')+id + ',');//add it
            }
        }else {
            this.cookieService.put('visited',','+id+',');
            this.hasVisitedAlready=false;
        }
    }
}