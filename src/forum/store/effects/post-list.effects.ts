import * as fromRoot from '../../../app/store';
import * as postListActions from '../actions/post-list.actions';
import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {map, switchMap} from 'rxjs/operators';
import {Post} from '../../models/post.model';
import {Thread} from '../../models/thread.model';
import {BackendUrlService} from '../../services/backendUrl.service';

@Injectable()
export class PostListEffects {
    servicesUrl;

    constructor(private actions$:Actions,private httpClient:HttpClient,private burl:BackendUrlService){
        this.servicesUrl=burl.getUrl();
    }

    @Effect()
    loadFlags=this.actions$.pipe(
        ofType(postListActions.LOAD_FLAGS),
        switchMap(()=>{
            let url=this.servicesUrl+'/post.service.php?loadFlags=1';
            return this.httpClient.get(url).pipe(
                map((res:Post[])=>{return new postListActions.LoadFlagsCompleted(res)})
            )
        })
    );

    @Effect()//loadThread
    loadThread$=this.actions$.pipe(
        ofType(postListActions.LOAD_POSTS),
        map((action:postListActions.LoadPosts)=>action.payload),
        switchMap((payload)=>{
            let url=this.servicesUrl+'/thread.service.php?loadThread=1&threadId='+payload.threadId+'&page='+payload.page+'&hasVisited='+payload.visitedThread;
            return this.httpClient.get(url).pipe(
                map((res:{page:string,thread:Thread,posts:Post[]})=>{return new postListActions.LoadPostsCompleted(res)})
            )
        })
    );
    @Effect()
    createPost$=this.actions$.pipe(
        ofType(postListActions.CREATE_POST),
        map((action:postListActions.CreatePost)=>action.payload),
        switchMap((post:Post)=>{
            let url=this.servicesUrl+'/post.service.php';
            let body=new HttpParams()
                .set('createPost','1')
                .set('threadId',post.threadId)
                .set('authorId',post.author.id)
                .set('text',post.text);

            return this.httpClient.post(url,body.toString(),
                {headers:new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded')}
                ).pipe( map((response:{post:Post,nav:any})=>{return new postListActions.CreatePostCompleted(response)}));
        })
    );

    @Effect()//navigate to new post
    createPostCompleted$=this.actions$.pipe(
        ofType(postListActions.CREATE_POST_COMPLETED),
        map((action:postListActions.CreatePostCompleted)=>action.payload.nav),
        map((nav)=>{
            return new fromRoot.Go({
                path:[nav.url],
                query:{page:nav.page}
            })
        })
    );

    @Effect()//report post
    toggleFlag$=this.actions$.pipe(
        ofType(postListActions.TOGGLE_FLAG),
        map( (action:postListActions.RemovePost)=>action.payload),
        switchMap((postId)=>{
            let url=this.servicesUrl+'/post.service.php';
            let body=new HttpParams()
                .set('toggleFlag','1')
                .set('postId',postId);
            return this.httpClient.post(url,body.toString(),
                {headers:new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded')}
            ).pipe(map( (post:Post)=>{
                return new postListActions.EditPostCompleted(post)
            }))
        })
    );

    @Effect()
    deletePost$=this.actions$.pipe(
        ofType(postListActions.REMOVE_POST),
        map( (action:postListActions.RemovePost)=>action.payload),
        switchMap((postId)=>{
            let url=this.servicesUrl+'/post.service.php';
            let body=new HttpParams()
                .set('deletePost','1')
                .set('postId',postId);

            return this.httpClient.post(url,body.toString(),
                {headers:new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded')}
                ).pipe(map( (post:Post)=>{ return new postListActions.RemovePostCompleted(post)}))
        })
    );

    @Effect()
    editPost$=this.actions$.pipe(
        ofType((postListActions.EDIT_POST)),
        map((action:postListActions.EditPost)=>action.payload),
        switchMap((post)=>{

            let url=this.servicesUrl+'/post.service.php';
            let body=new HttpParams()
                .set('editPost','1')
                .set('post',JSON.stringify(post));

            return this.httpClient.post(url,body.toString(),
                {headers:new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded')}
            ).pipe(map((post:Post)=>{return new postListActions.EditPostCompleted(post)}))

        })
    )
}

























