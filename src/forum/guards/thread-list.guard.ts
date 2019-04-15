import {Injectable, OnInit} from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import * as fromStore from '../store';
import {select, Store} from '@ngrx/store';
import {catchError, filter,switchMap, take, tap} from 'rxjs/operators';
import { Observable, of} from 'rxjs';
/* Preloads store with threads*/
@Injectable()
export class ThreadListGuard implements OnInit,CanActivate{
    //dispatch only if we are on thread-list component and not on post-list
    constructor(private router:Router,private store:Store<fromStore.ForumAppState>){}
    ngOnInit(){}
    getFromStoreOrAPI(page,id):Observable<any>{
        let c=0;
        return this.store.pipe(select(fromStore.getThreadsAndPage),
            tap(()=>{
                if(c==0)
                this.store.dispatch(new fromStore.LoadThreads({page:page,forumId:id}));
                c++;
            }),
            filter(threadsAndPage=> page==threadsAndPage.page),//if store is loaded with correct forum page
            take(1))
    }

    canActivate(route:ActivatedRouteSnapshot,state:RouterStateSnapshot){
        let page=route.queryParams['page']||'1';
        //if we are on the post-list component then return true and let post-list guard resolve data
        if(route['_routerState'].url.includes('/thread/')){
            return true
        }else{
            return this.getFromStoreOrAPI(page,route.params['forumId']).pipe(
                switchMap(()=>of(true)),
                catchError(()=>of(false))
            )

        }

    }
}