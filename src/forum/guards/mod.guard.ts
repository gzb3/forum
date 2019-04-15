import * as fromStore from '../store';
import {filter, map} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {select, Store} from '@ngrx/store';
import {User} from '../models/user.model';
/*if user is moderator */

@Injectable()
export class ModGuard implements CanActivate{
    user$:Observable<User>;
    constructor(private route:ActivatedRoute,private router:Router,private store:Store<fromStore.ForumAppState>){}
    canActivate(route:ActivatedRouteSnapshot,state:RouterStateSnapshot){
        if(localStorage.getItem('token')){
            let token=localStorage.getItem('token');
            this.store.dispatch(new fromStore.KeepLoggedIn(token));
            this.user$=this.store.pipe(select(fromStore.getUser));
            return this.user$.pipe(
                filter((user => user.mod!==undefined)),
                    map(user=>{
                           if(user.mod!='1')this.router.navigate(['unavailable']);
                           return user.mod=="1";
                        }
                    )
            );
        }else{
            this.router.navigate(['log-in']);
        }
    }
}