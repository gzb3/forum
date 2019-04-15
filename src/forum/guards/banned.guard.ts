import * as fromStore from '../store';
import {filter, map, skip} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {select, Store} from '@ngrx/store';
import {User} from '../models/user.model';
/* allow route if user is not banned*/

@Injectable()
export class BannedGuard implements CanActivate{
    user$:Observable<User>;
    constructor(private route:ActivatedRoute,private router:Router,private store:Store<fromStore.ForumAppState>){}
    canActivate(route:ActivatedRouteSnapshot,state:RouterStateSnapshot){
        if(localStorage.getItem('token')){
            let token=localStorage.getItem('token');
            this.store.dispatch(new fromStore.KeepLoggedIn(token));
            this.user$=this.store.pipe(select(fromStore.getUser));
            return this.user$.pipe(
                filter((user => user.ban!==undefined)),
                map(user=>{
                        if(user.ban!==null){
                            alert("Error: You are banned!\nYour ban expires on: "+user.ban);
                        }
                        return user.ban==null;
                    }
                )
            );
        }else{
            this.router.navigate(['log-in']);
        }
    }
}