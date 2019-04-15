import {Injectable} from '@angular/core';
import {ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {select, Store} from '@ngrx/store';
import * as fromStore from '../store';
import {filter, map} from 'rxjs/operators';
/*route can be activated if user is logged in and
  if user is author or participant in conversation
* */
@Injectable()
export class ConversationGuard implements CanActivate{
    conversationAvailable$:Observable<boolean>;
    conversationId:string;

    constructor(private route:ActivatedRoute,private router:Router,private store:Store<fromStore.ForumAppState>){}

    canActivate(route:ActivatedRouteSnapshot,state:RouterStateSnapshot){
        if(localStorage.getItem('token')){
            let convId=state.url.split('/')[state.url.split('/').length-1];
            let token=localStorage.getItem('token');
            this.store.dispatch(new fromStore.CheckConversationAvailability([convId,token]));
            this.conversationAvailable$=this.store.pipe(select(fromStore.getActivateConversation));
            return this.conversationAvailable$.pipe(
                filter((res => res!== null)),
                map(res=>{
                            if(res==false)this.router.navigate(['unavailable']);
                            return res==true}
                        )
            );
        }else{
            this.router.navigate(['log-in']);
        }
    }
}


