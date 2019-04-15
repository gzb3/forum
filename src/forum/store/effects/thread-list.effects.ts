import * as fromRoot from '../../../app/store';
import * as threadListActions from '../actions/thread-list.actions';
import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {map, switchMap } from 'rxjs/operators';
import {Thread} from '../../models/thread.model';
import {Post} from '../../models/post.model';
import {Forum} from '../../models/forum.model';
import {BackendUrlService} from '../../services/backendUrl.service';

@Injectable()
export class ThreadListEffects {
   servicesUrl;

    constructor(private actions$:Actions,private httpClient:HttpClient,private burl:BackendUrlService){
        this.servicesUrl=burl.getUrl();
    }

    @Effect()
    deleteThread=this.actions$.pipe(
        ofType(threadListActions.DELETE_THREAD),
        map((action:threadListActions.DeleteThread)=>action.payload),
        switchMap((threadId)=>{
            let url=this.servicesUrl+'/thread.service.php?deleteThread=1&threadId='+threadId;
            return this.httpClient.get(url).pipe(
                map((thread:Thread)=>{
                    return new threadListActions.DeleteThreadSuccess(thread);
                })
            )
        })
    );

    @Effect()
    lockUnlockThread$=this.actions$.pipe(
        ofType(threadListActions.LOCK_THREAD,threadListActions.UNLOCK_THREAD),
        map((action:threadListActions.LockThread | threadListActions.UnlockThread)=>action.payload),
        switchMap((payload)=>{
            let url=this.servicesUrl+'/thread.service.php?'+payload[0]+'=1&threadId='+payload[1];
            return this.httpClient.get(url).pipe(
                map((thread:Thread)=>{
                    return new threadListActions.LockUnlockThreadSuccess(thread);
                })
            )
        })
    );
    @Effect()//load threads
    loadForum$=this.actions$.pipe(
        ofType(threadListActions.LOAD_THREADS),
        map((action:threadListActions.LoadThreads)=>action.payload),
        switchMap((payload)=>{
            let url=this.servicesUrl+'/forum.service.php?loadForum=1&forumId='+payload.forumId+'&page='+payload.page;
            return this.httpClient.get(url).pipe(
                map((result:{page:string,forum:Forum,threads:Thread[]})=>{
                    return new threadListActions.LoadThreadsCompleted(result)
                })
            )
        })
    );

    @Effect()//create thread
    createThread$=this.actions$.pipe(
        ofType(threadListActions.CREATE_THREAD),
        map((action:threadListActions.CreateThread)=>action.payload),
        switchMap((payload:[Thread,Post])=>{

            let url=this.servicesUrl+'/thread.service.php';
            let body=new HttpParams()
                .set('createThread','1')
                .set('thread',JSON.stringify(payload[0]))
                .set('post',JSON.stringify(payload[1]));
            return this.httpClient.post(url,body.toString(),
                {headers:new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded')}
            ).pipe(map((thread:Thread)=>{ return new threadListActions.CreateThreadCompleted(thread)}  ));
        })
    );

    @Effect()//navigate to thread
    navigateToNewThread=this.actions$.pipe(
        ofType(threadListActions.CREATE_THREAD_COMPLETED),
        map((action:threadListActions.CreateThreadCompleted)=>action.payload),
        map(thread=> {
                return new fromRoot.Go({
                    path: ['./forum', thread.forumId, 'thread', thread.id],
                    query: {page: 1}

                })
            }
        )
    )
}
