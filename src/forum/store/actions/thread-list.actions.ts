import {Action} from '@ngrx/store';
import {Forum} from '../../models/forum.model';
import {Thread} from '../../models/thread.model';
import {Post} from '../../models/post.model';

export const CREATE_THREAD='[Forum] Create Thread';
export const CREATE_THREAD_COMPLETED='[Forum] Create Thread Completed';
export const DELETE_THREAD='[Forum] Delete Thread';
export const DELETE_THREAD_SUCCESS='[Forum] Delete Thread Completed';
export const LOCK_THREAD='[Forum] Lock Thread';
export const UNLOCK_THREAD='[Forum] Unlock Thread';
export const LOCK_UNLOCK_THREAD_SUCCESS='[Forum] Lock/Unlock Thread Success';
export const LOAD_THREADS='[Forum] Load Threads';
export const LOAD_THREADS_COMPLETED='[Forum] Load Threads Completed';

export class LockThread implements Action{
    readonly type =LOCK_THREAD;//threadId
    constructor(public payload:["lock",string]){}
}
export class LockUnlockThreadSuccess implements Action{
    readonly type =LOCK_UNLOCK_THREAD_SUCCESS;
    constructor(public payload:Thread){}
}
export class UnlockThread implements Action{
    readonly type =UNLOCK_THREAD;
    constructor(public  payload:["unlock",string]){}
}
export class DeleteThreadSuccess implements Action {
    readonly type= DELETE_THREAD_SUCCESS;
    constructor(public  payload?: any){
    }
}
export class DeleteThread implements Action {
    readonly type= DELETE_THREAD;
    constructor(public  payload: Thread){
    }
}
export class LoadThreads implements Action{
    readonly type =LOAD_THREADS;//page, forumId
    constructor(public payload:{page:string,forumId:string}){}
}
export class LoadThreadsCompleted implements Action{
    readonly type=LOAD_THREADS_COMPLETED;
    constructor(public payload:{page:string,forum:Forum,threads:Thread[]}){}
}
export class CreateThread implements Action{
    readonly type=CREATE_THREAD;
    constructor(public payload:[Thread,Post]){}
}
export class CreateThreadCompleted implements Action{
    readonly type=CREATE_THREAD_COMPLETED;
    constructor(public payload:Thread){}
}

export type threadListAction=LoadThreads|LoadThreadsCompleted|CreateThread|CreateThreadCompleted|LockThread|UnlockThread|LockUnlockThreadSuccess|DeleteThread|DeleteThreadSuccess;
