import {Thread} from '../../models/thread.model';
import {Action} from '@ngrx/store';
import {Post} from '../../models/post.model';
import {User} from '../../models/user.model';

export const CREATE_POST='[Forum] Create Post';
export const CREATE_POST_COMPLETED='[Forum] Create Post Completed';
export const REMOVE_POST='[Forum] Remove Post';
export const REMOVE_POST_COMPLETED='[Forum] Remove Post Completed';
export const LOAD_POSTS ='[Forum] Load Posts';
export const LOAD_POSTS_COMPLETED='[Forum] Load Posts Completed';
export const LOAD_FLAGS='[Forum] Load Flags';
export const LOAD_FLAGS_COMPLETED='[Forum] Load Flags Completed';
export const EDIT_POST ='[Forum] Edit Post';
export const EDIT_POST_COMPLETED='[Forum] Edit Post Completed';
export const STORE_QUOTE='[Forum] Store Quote';
export const TOGGLE_FLAG ='[Forum] Toggle Flag';

export class StoreQuote implements Action{
    readonly type=STORE_QUOTE;
    constructor(public payload:{quote:string,user:User}){}
}

export class LoadFlags implements Action{
    readonly type =LOAD_FLAGS;
    constructor(){}
}

export class LoadFlagsCompleted implements Action{
    readonly type=LOAD_FLAGS_COMPLETED;
    constructor(public payload:Post[]){}
}

export class CreatePost implements Action{
    readonly type=CREATE_POST;
    constructor(public payload:Post){}
}

export class CreatePostCompleted implements Action{
    readonly type=CREATE_POST_COMPLETED;
    constructor(public payload:{post:Post,nav:{url:string,page:string}}){}
}

export class EditPost implements Action{
    readonly type=EDIT_POST;
    constructor(public payload:Post){}
}

export class EditPostCompleted implements Action{
    readonly type=EDIT_POST_COMPLETED;
    constructor(public payload:Post){}
}

export class LoadPosts implements Action{
    readonly type =LOAD_POSTS;
     constructor(public payload:{page:any,threadId:number,visitedThread:boolean}){}
}

export class LoadPostsCompleted implements Action{
    readonly type=LOAD_POSTS_COMPLETED;

    constructor(public payload:{page:string,thread:Thread,posts:Post[]}){}
}

export class RemovePost implements Action {
    readonly type= REMOVE_POST;
    constructor(public  payload: string){}
}

export class ToggleFlag implements Action {
    readonly type= TOGGLE_FLAG;
    constructor(public  payload: string){}
}

export class RemovePostCompleted implements Action {
    readonly type= REMOVE_POST_COMPLETED;
    constructor(public  payload: Post){
    }
}


export type postListAction=CreatePost|
    ToggleFlag|
    LoadFlags|
    LoadFlagsCompleted|
    RemovePost|
    CreatePostCompleted|
    RemovePostCompleted|
    EditPost|
    EditPostCompleted|
    LoadPosts|
    LoadPostsCompleted|
    StoreQuote
