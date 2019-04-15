import * as fromStore from '../store';
import { map} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import { Store} from '@ngrx/store';
import {User} from '../models/user.model';
import {HttpClient} from '@angular/common/http';
import {BackendUrlService} from '../services/backendUrl.service';
/* allow route if thread isn't locked*/

@Injectable()
export class LockGuard implements CanActivate{
    user$:Observable<User>;
    threadId;
    constructor(private router:Router,private store:Store<fromStore.ForumAppState>,private httpClient:HttpClient,private burl:BackendUrlService){}
    canActivate(route:ActivatedRouteSnapshot,state:RouterStateSnapshot){
        if(localStorage.getItem('token')){
            this.threadId = route.params.id;
            //check if thread is locked
            let url=this.burl.getUrl()+'/thread.service.php?checkLock=1&threadId='+this.threadId;
            return this.httpClient.get(url)
                .pipe(
                    map((res)=>{
                       if(res=='1'){alert("Error: This thread is locked!"); return false }
                        else if (res=='0') return true;
                    })
            );
        }else{
            this.router.navigate(['log-in']);
        }
    }
}