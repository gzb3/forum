import * as fromStore from '../store';
import {Injectable} from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {select, Store} from '@ngrx/store';
import {catchError, filter, switchMap, take, tap} from 'rxjs/operators';
import {Observable, of} from 'rxjs';
/*  acts as a route resolver for home component*/
@Injectable()
export class HomeGuard implements CanActivate{

    constructor(private router:Router,private store:Store<fromStore.ForumAppState>){}

    getFromStoreOrAPI():Observable<any>{
        let c=0; //for some reason tap dispatches twice so I limited number of dispatches with this counter
        return this.store.pipe(select(fromStore.getThreadsAndPage),
            tap((data)=> {
                if(c==0){
                    this.store.dispatch(new fromStore.LoadRecentUsers());
                    this.store.dispatch(new fromStore.LoadThreads({page: '1', forumId: 'newThreads'}));
                    this.store.dispatch(new fromStore.LoadStats());
                }
                c++;
            }),
            filter(data=>data.page=='new'),//if threads are loaded (backend returns new for forum page when loading new threads for home component)
            take(1))
    }
    canActivate(route:ActivatedRouteSnapshot,state:RouterStateSnapshot){
        return this.getFromStoreOrAPI().pipe(
            switchMap(()=>of(true)),
            catchError(()=>of(false))
        )
    }
}