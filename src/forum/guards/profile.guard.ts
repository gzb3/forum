import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import * as fromStore from '../store';
import {select, Store} from '@ngrx/store';
import {catchError, filter, switchMap, take, tap} from 'rxjs/operators';

import {Observable, of} from 'rxjs';

/* Preloads store with user info*/
@Injectable()
export class ProfileGuard implements CanActivate{
    constructor(private router:Router,private store:Store<fromStore.ForumAppState>){}
    getFromStoreOrAPI(id):Observable<any>{
        let c=0;// for some reason tap dispatches twice so I put this counter to limit dispatches to 1
        return this.store.pipe(select(fromStore.getUserData),
                tap((data)=> {
                    if(data.loading==false&&c==0)
                        this.store.dispatch(new fromStore.LoadUser(id));
                    c++;
                }
            ),
            filter(data=>data.user.id==id),
            take(1)
        )
    }
    canActivate(route:ActivatedRouteSnapshot,state:RouterStateSnapshot){
      return this.getFromStoreOrAPI(route.params['id']).pipe(
          switchMap(()=>of(true)),
          catchError(()=>of(false))
      )
    }
}